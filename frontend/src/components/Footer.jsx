import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-gray-900">
            <BookOpen size={20} className="text-indigo-600" />
            <span className="text-lg font-bold tracking-tight">DisciPro</span>
          </div>
          
          <div className="flex gap-8 text-sm text-gray-500 font-medium">
            <Link to="/" className="hover:text-indigo-600 transition-colors">About</Link>
            <Link to="/" className="hover:text-indigo-600 transition-colors">Privacy</Link>
            <Link to="/" className="hover:text-indigo-600 transition-colors">Terms</Link>
            <Link to="/" className="hover:text-indigo-600 transition-colors">Contact</Link>
          </div>
          
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} DisciPro. Built for Lenovo Leap.
          </div>
        </div>
      </div>
    </footer>
  )
}
