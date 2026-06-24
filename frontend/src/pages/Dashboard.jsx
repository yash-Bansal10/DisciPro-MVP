import { useState, useEffect } from 'react'
import { api } from '../store'
import { Search, UserCircle2, ArrowRight } from 'lucide-react'

export default function Dashboard() {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users')
        setUsers(res.data.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchUsers()
  }, [])

  const handleRequest = async (receiverId, requestedSkill, offeredSkill) => {
    try {
      await api.post('/requests', {
        receiverId,
        requestedSkill,
        offeredSkill
      })
      alert("Swap request sent successfully!")
    } catch {
      alert("Failed to send request. You may have already sent one.")
    }
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.skillsToTeach.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Explore Skills</h2>
          <p className="text-gray-500">Discover people to learn from and teach.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or skill..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No users found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUsers.map(u => (
            <div key={u.id} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                  <UserCircle2 size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">{u.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm font-medium text-gray-500">New Member</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-6 line-clamp-2 min-h-[40px]">
                {u.bio || "No bio provided"}
              </p>
              
              <div className="flex-grow space-y-5">
                <div>
                  <strong className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Teaches</strong>
                  <div className="flex flex-wrap gap-2">
                    {u.skillsToTeach.length > 0 ? u.skillsToTeach.map(s => (
                      <span key={s} className="bg-indigo-50 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">{s}</span>
                    )) : <span className="text-gray-400 text-sm">None listed</span>}
                  </div>
                </div>
                
                <div>
                  <strong className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Wants to Learn</strong>
                  <div className="flex flex-wrap gap-2">
                    {u.skillsToLearn.length > 0 ? u.skillsToLearn.map(s => (
                      <span key={s} className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">{s}</span>
                    )) : <span className="text-gray-400 text-sm">None listed</span>}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                {u.skillsToTeach.length > 0 && u.skillsToLearn.length > 0 ? (
                  <button 
                    onClick={() => handleRequest(u.id, u.skillsToTeach[0], u.skillsToLearn[0])}
                    className="w-full bg-white border-2 border-indigo-600 text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors flex justify-center items-center gap-2"
                  >
                    Request Swap <ArrowRight size={18} />
                  </button>
                ) : (
                  <button disabled className="w-full bg-gray-50 border-2 border-gray-200 text-gray-400 font-bold py-3 rounded-xl cursor-not-allowed">
                    Incomplete Profile
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
