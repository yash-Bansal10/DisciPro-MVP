import { useState, useEffect } from 'react'
import { api, useAuthStore } from '../store'
import { UserCircle2, Settings, ShieldCheck, TrendingUp, Users } from 'lucide-react'

export default function Profile() {
  const { user, checkAuth } = useAuthStore()
  const [bio, setBio] = useState('')
  const [teach, setTeach] = useState('')
  const [learn, setLearn] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setBio(user.bio || '')
      setTeach(user.skillsToTeach.join(', '))
      setLearn(user.skillsToLearn.join(', '))
    }
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/users/profile', {
        bio,
        skillsToTeach: teach.split(',').map(s => s.trim()).filter(Boolean),
        skillsToLearn: learn.split(',').map(s => s.trim()).filter(Boolean)
      })
      await checkAuth()
      alert("Profile updated successfully!")
    } catch {
      alert("Failed to update profile.")
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Profile Editor */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-8">
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
              <div className="h-20 w-20 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                <UserCircle2 size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">About Me</label>
                <textarea 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white resize-none" 
                  value={bio} 
                  onChange={e=>setBio(e.target.value)} 
                  rows="4" 
                  placeholder="Share a bit about your background and what you're looking for..."
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Skills I Can Teach</label>
                <p className="text-xs text-gray-500 mb-2">Separate skills with commas (e.g. React, Python, Guitar)</p>
                <input 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" 
                  value={teach} 
                  onChange={e=>setTeach(e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Skills I Want To Learn</label>
                <p className="text-xs text-gray-500 mb-2">Separate skills with commas (e.g. Spanish, UI Design)</p>
                <input 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" 
                  value={learn} 
                  onChange={e=>setLearn(e.target.value)} 
                />
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 flex justify-end">
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md hover:shadow-indigo-200 disabled:opacity-70"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Statistics */}
        <div className="w-full lg:w-80">
          <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-indigo-600" /> My Impact
            </h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Requests Completed</span>
                <span className="text-xl font-bold text-gray-900">0</span>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Reviews Received</span>
                <span className="text-xl font-bold text-gray-900">0</span>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Average Rating</span>
                <span className="text-xl font-bold text-gray-900">--</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100">
            <h3 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
              <ShieldCheck size={18} /> Trust & Safety
            </h3>
            <p className="text-sm text-indigo-700">
              Your profile is verified. Complete your first skill exchange to start building your public reputation.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
