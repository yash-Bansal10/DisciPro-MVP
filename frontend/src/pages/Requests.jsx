import { useState, useEffect } from 'react'
import { api } from '../store'
import { Inbox, CheckCircle2, XCircle, Clock } from 'lucide-react'

export default function Requests() {
  const [requests, setRequests] = useState([])
  const [activeTab, setActiveTab] = useState('incoming')

  const fetchReqs = async () => {
    try {
      const res = await api.get('/requests/incoming')
      setRequests(res.data.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchReqs()
  }, [])

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/requests/${id}/status?status=${status}`)
      fetchReqs() // Refresh list
    } catch {
      alert("Action failed.")
    }
  }

  const filteredRequests = requests.filter(r => {
    if (activeTab === 'incoming') return r.status === 'pending'
    if (activeTab === 'completed') return r.status === 'completed'
    if (activeTab === 'archived') return r.status === 'accepted' || r.status === 'rejected'
    return true
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Requests</h2>
        <p className="text-gray-500 mt-2">View and respond to skill exchange offers.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200 pb-px">
        <button 
          onClick={() => setActiveTab('incoming')}
          className={`pb-4 px-4 font-medium text-sm transition-colors border-b-2 ${activeTab === 'incoming' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          Incoming Offers
        </button>
        <button 
          onClick={() => setActiveTab('archived')}
          className={`pb-4 px-4 font-medium text-sm transition-colors border-b-2 ${activeTab === 'archived' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          Archived
        </button>
      </div>

      <div className="space-y-4">
        {filteredRequests.map(r => (
          <div key={r.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-50 p-3 rounded-xl shrink-0">
                <Inbox className="text-indigo-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {r.senderName} <span className="font-normal text-gray-500">wants to exchange skills</span>
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 mt-3">
                  <div className="bg-gray-50 px-4 py-2 rounded-lg">
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">They want to learn</span>
                    <span className="font-medium text-gray-900">{r.requestedSkill}</span>
                  </div>
                  <div className="bg-indigo-50/50 px-4 py-2 rounded-lg">
                    <span className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">They can teach</span>
                    <span className="font-medium text-indigo-900">{r.offeredSkill}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto flex items-center justify-end border-t border-gray-100 md:border-0 pt-4 md:pt-0">
              {r.status === 'pending' ? (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => handleStatus(r.id, 'rejected')} 
                    className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} /> Decline
                  </button>
                  <button 
                    onClick={() => handleStatus(r.id, 'accepted')} 
                    className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <CheckCircle2 size={18} /> Accept
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl bg-gray-50 text-gray-600">
                  <Clock size={16} /> 
                  <span className="capitalize">{r.status}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm border-dashed">
            <Inbox className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No requests yet</h3>
            <p className="text-gray-500 mt-1">Discover people on the Explore page and start exchanging!</p>
          </div>
        )}
      </div>
    </div>
  )
}
