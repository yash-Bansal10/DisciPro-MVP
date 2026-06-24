import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store'
import { BookOpen, UserCircle, Inbox, LogOut, Search } from 'lucide-react'

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <BookOpen size={24} />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">DisciPro</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 flex items-center gap-1.5 font-medium transition-colors">
                  <Search size={18} /> Explore
                </Link>
                <Link to="/requests" className="text-gray-600 hover:text-indigo-600 flex items-center gap-1.5 font-medium transition-colors">
                  <Inbox size={18} /> Requests
                </Link>
                <div className="h-6 w-px bg-gray-200"></div>
                <Link to="/profile" className="text-gray-600 hover:text-indigo-600 flex items-center gap-1.5 font-medium transition-colors">
                  <UserCircle size={18} /> Profile
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-gray-500 hover:text-red-600 flex items-center gap-1.5 font-medium transition-colors ml-2"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
