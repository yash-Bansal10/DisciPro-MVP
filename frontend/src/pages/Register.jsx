import { useState } from 'react'
import { api, useAuthStore } from '../store'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/register', form)
      await login(form.email, form.password)
      navigate('/profile')
    } catch (err) {
      console.error(err)
      const errorDetail = err.response?.data?.detail || err.message
      alert("Registration failed: " + JSON.stringify(errorDetail))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="flex justify-center mb-8">
          <div className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl">
            <UserPlus size={32} />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Identity</h2>
          <p className="text-gray-500">Join the learning network today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" 
              value={form.name} onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" 
              value={form.email} onChange={e => setForm({...form, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input 
              type="password" 
              required
              minLength={8}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" 
              value={form.password} onChange={e => setForm({...form, password: e.target.value})}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md hover:shadow-indigo-200 disabled:opacity-70 mt-4"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
