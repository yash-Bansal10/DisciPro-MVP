import { Link } from 'react-router-dom'
import { ArrowRight, Globe2, BookOpen, Users, Star, CheckCircle2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
          Learn Anything. <span className="text-indigo-600">Teach Everything.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Exchange skills with people around the world and grow together. A cashless peer-to-peer learning network designed to break down financial barriers to education.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 flex items-center justify-center gap-2">
            Get Started <ArrowRight size={20} />
          </Link>
          <Link to="/login" className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center">
            Explore Skills
          </Link>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y border-gray-100 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">10k+</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">50k+</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Skills Exchanged</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">120+</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Countries</div>
            </div>
            <div>
              <div className="flex justify-center items-center gap-1 mb-2">
                <span className="text-4xl font-bold text-gray-900">4.9</span>
                <Star className="text-yellow-400 fill-current" size={32} />
              </div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600">Start learning for free in four simple steps.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-1/8 right-1/8 h-0.5 bg-gray-100 -z-10"></div>
          
          {[
            { step: '01', title: 'Create Profile', desc: 'Sign up and build your identity.' },
            { step: '02', title: 'List Skills', desc: 'Add what you can teach.' },
            { step: '03', title: 'Find Matches', desc: 'Discover skills you want to learn.' },
            { step: '04', title: 'Exchange', desc: 'Connect and share knowledge.' }
          ].map((item) => (
            <div key={item.step} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center relative z-10 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SDG Mission Section */}
      <section className="bg-gray-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Built for the Global Goals</h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                DisciPro directly addresses the United Nations Sustainable Development Goals by completely removing financial barriers to quality education and equalizing opportunities for everyone.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="text-green-400 shrink-0 mt-1" />
                  <div>
                    <strong className="block text-xl mb-1">SDG 4: Quality Education</strong>
                    <span className="text-gray-400">Enabling a cashless knowledge exchange economy accessible to anyone with internet.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="text-indigo-400 shrink-0 mt-1" />
                  <div>
                    <strong className="block text-xl mb-1">SDG 10: Reduced Inequalities</strong>
                    <span className="text-gray-400">Valuing everyone's time and expertise equally, regardless of geographic or economic background.</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-8 rounded-2xl flex flex-col items-center text-center justify-center aspect-square">
                <BookOpen size={48} className="text-green-400 mb-4" />
                <span className="font-medium">Free Education</span>
              </div>
              <div className="bg-gray-800 p-8 rounded-2xl flex flex-col items-center text-center justify-center aspect-square translate-y-8">
                <Globe2 size={48} className="text-blue-400 mb-4" />
                <span className="font-medium">Global Access</span>
              </div>
              <div className="bg-gray-800 p-8 rounded-2xl flex flex-col items-center text-center justify-center aspect-square">
                <Users size={48} className="text-indigo-400 mb-4" />
                <span className="font-medium">Community Driven</span>
              </div>
              <div className="bg-gray-800 p-8 rounded-2xl flex flex-col items-center text-center justify-center aspect-square translate-y-8">
                <Star size={48} className="text-yellow-400 mb-4" />
                <span className="font-medium">Merit Based</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">Start Learning Today</h2>
        <Link to="/register" className="inline-block bg-indigo-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl hover:shadow-indigo-200">
          Join DisciPro for Free
        </Link>
      </section>
    </div>
  )
}
