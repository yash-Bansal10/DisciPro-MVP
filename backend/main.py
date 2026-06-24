from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
import jwt
import os
import bcrypt
from dotenv import load_dotenv
from typing import List, Optional
from bson import ObjectId

load_dotenv()

# --- CONFIGURATION ---
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey_discipro_mvp_only")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

app = FastAPI(title="DisciPro API (Phase 0 Standardized)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GLOBAL EXCEPTION HANDLER ---
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    if isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"success": False, "message": exc.detail}
        )
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": "Internal Server Error"}
    )

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- DATABASE ---
client = AsyncIOMotorClient(MONGO_URI)
db = client.discipro_mvp

# --- HELPERS ---
def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_bytes = plain_password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    return bcrypt.checkpw(password_bytes, hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt).decode('utf-8')

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception
    user = await db.users.find_one({"email": email})
    if user is None:
        raise credentials_exception
    return user

# --- SCHEMAS ---
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(..., max_length=72)

class UserProfileUpdate(BaseModel):
    bio: Optional[str] = None
    skillsToTeach: List[str] = []
    skillsToLearn: List[str] = []

class SwapRequestCreate(BaseModel):
    receiverId: str
    offeredSkill: str
    requestedSkill: str

def format_user(user):
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "bio": user.get("bio", ""),
        "skillsToTeach": user.get("skillsToTeach", []),
        "skillsToLearn": user.get("skillsToLearn", [])
    }

# --- ROUTES ---

@app.post("/register")
async def register(user: UserCreate):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user.dict()
    user_dict["passwordHash"] = get_password_hash(user_dict.pop("password"))
    user_dict["bio"] = ""
    user_dict["skillsToTeach"] = []
    user_dict["skillsToLearn"] = []
    
    result = await db.users.insert_one(user_dict)
    new_user = await db.users.find_one({"_id": result.inserted_id})
    return {"success": True, "data": format_user(new_user)}

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await db.users.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["passwordHash"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user["email"]})
    # OAuth2 spec requires direct token response, bypassing wrapper for compatibility
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return {"success": True, "data": format_user(current_user)}

@app.put("/users/profile")
async def update_profile(profile: UserProfileUpdate, current_user: dict = Depends(get_current_user)):
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": profile.dict(exclude_unset=True)}
    )
    updated_user = await db.users.find_one({"_id": current_user["_id"]})
    return {"success": True, "data": format_user(updated_user)}

@app.get("/users")
async def discover_users(current_user: dict = Depends(get_current_user)):
    cursor = db.users.find({"_id": {"$ne": current_user["_id"]}})
    users = await cursor.to_list(length=100)
    return {"success": True, "data": [format_user(u) for u in users]}

@app.post("/requests")
async def create_swap_request(req: SwapRequestCreate, current_user: dict = Depends(get_current_user)):
    if req.receiverId == str(current_user["_id"]):
        raise HTTPException(status_code=400, detail="Cannot send request to yourself")
        
    request_doc = {
        "senderId": str(current_user["_id"]),
        "receiverId": req.receiverId,
        "offeredSkill": req.offeredSkill,
        "requestedSkill": req.requestedSkill,
        "status": "pending",
        "createdAt": datetime.utcnow()
    }
    
    result = await db.requests.insert_one(request_doc)
    request_doc["id"] = str(result.inserted_id)
    request_doc.pop("_id")
    return {"success": True, "data": request_doc}

@app.get("/requests/incoming")
async def get_incoming_requests(current_user: dict = Depends(get_current_user)):
    cursor = db.requests.find({"receiverId": str(current_user["_id"])})
    requests = await cursor.to_list(length=100)
    
    enriched = []
    for r in requests:
        sender = await db.users.find_one({"_id": ObjectId(r["senderId"])})
        enriched.append({
            "id": str(r["_id"]),
            "senderName": sender["name"] if sender else "Unknown User",
            "offeredSkill": r["offeredSkill"],
            "requestedSkill": r["requestedSkill"],
            "status": r["status"]
        })
    return {"success": True, "data": enriched}

@app.put("/requests/{req_id}/status")
async def update_request_status(req_id: str, status: str, current_user: dict = Depends(get_current_user)):
    if status not in ["accepted", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    req = await db.requests.find_one({"_id": ObjectId(req_id)})
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
        
    if req["receiverId"] != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized")
        
    await db.requests.update_one({"_id": ObjectId(req_id)}, {"$set": {"status": status}})
    return {"success": True, "data": {"message": f"Request {status}"}}
