'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'
import MeditationGenerator from '@/components/MeditationGenerator'
import MeditationPlayer from '@/components/MeditationPlayer'
import CommunityLibrary from '@/components/CommunityLibrary'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'signup' | 'create' | 'player' | 'community' | 'library'>('landing')
  const [currentMeditation, setCurrentMeditation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = async (e: React.FormEvent, isSignUp: boolean) => {
    e.preventDefault()
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('Check your email for confirmation!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        setCurrentView('landing')
      }
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setCurrentView('landing')
  }

  const handleMeditationComplete = (meditation: any) => {
    setCurrentMeditation(meditation)
    setCurrentView('player')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-xl text-white">Loading...</div>
      </div>
    )
  }

  // Login View
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Welcome Back</h2>
          
          <form onSubmit={(e) => handleAuth(e, false)} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              Sign In
            </button>
          </form>
          
          <p className="text-center mt-6 text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={() => setCurrentView('signup')}
              className="text-purple-400 hover:text-purple-300"
            >
              Sign Up
            </button>
          </p>
          
          <button
            onClick={() => setCurrentView('landing')}
            className="w-full mt-4 text-gray-400 hover:text-white transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // Sign Up View
  if (currentView === 'signup') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Create Account</h2>
          
          <form onSubmit={(e) => handleAuth(e, true)} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              minLength={6}
            />
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              Sign Up
            </button>
          </form>
          
          <p className="text-center mt-6 text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => setCurrentView('login')}
              className="text-purple-400 hover:text-purple-300"
            >
              Sign In
            </button>
          </p>
          
          <button
            onClick={() => setCurrentView('landing')}
            className="w-full mt-4 text-gray-400 hover:text-white transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // Meditation Creator View
  if (currentView === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <nav className="bg-black/50 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 
              onClick={() => setCurrentView('landing')}
              className="text-2xl font-bold text-white cursor-pointer flex items-center"
            >
              <span className="w-8 h-8 bg-purple-600 rounded-full mr-3"></span>
              GenZen
            </h1>
            <div className="flex items-center gap-4">
              {user && <span className="text-gray-400">{user.email}</span>}
              <button
                onClick={() => setCurrentView('landing')}
                className="text-gray-400 hover:text-white transition"
              >
                Back
              </button>
            </div>
          </div>
        </nav>
        <MeditationGenerator onComplete={handleMeditationComplete} />
      </div>
    )
  }

  // Player View
  if (currentView === 'player' && currentMeditation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <nav className="bg-black/50 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 
              onClick={() => setCurrentView('landing')}
              className="text-2xl font-bold text-white cursor-pointer flex items-center"
            >
              <span className="w-8 h-8 bg-purple-600 rounded-full mr-3"></span>
              GenZen
            </h1>
            <button
              onClick={() => setCurrentView('landing')}
              className="text-gray-400 hover:text-white transition"
            >
              Back
            </button>
          </div>
        </nav>
        <MeditationPlayer meditation={currentMeditation} />
      </div>
    )
  }

  // Community View
  if (currentView === 'community') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <nav className="bg-black/50 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 
              onClick={() => setCurrentView('landing')}
              className="text-2xl font-bold text-white cursor-pointer flex items-center"
            >
              <span className="w-8 h-8 bg-purple-600 rounded-full mr-3"></span>
              GenZen
            </h1>
            <button
              onClick={() => setCurrentView('landing')}
              className="text-gray-400 hover:text-white transition"
            >
              Back
            </button>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto p-4">
          <CommunityLibrary />
        </div>
      </div>
    )
  }

  // Landing Page (Default)
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 bg-purple-600 rounded-full"></span>
            <span className="text-2xl font-bold">GenZen</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => user ? setCurrentView('create') : setCurrentView('login')}
              className="hover:text-purple-400 transition"
            >
              Create
            </button>
            <button 
              onClick={() => user ? setCurrentView('library') : setCurrentView('login')}
              className="hover:text-purple-400 transition"
            >
              Library
            </button>
            <button 
              onClick={() => setCurrentView('community')}
              className="hover:text-purple-400 transition"
            >
              Community
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-400 hidden md:block">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition font-semibold"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div 
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070")'
        }}
      >
        <div className="text-center px-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Find Your Inner Peace
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10">
            AI-powered personalized meditations crafted just for you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => user ? setCurrentView('create') : setCurrentView('signup')}
              className="px-8 py-4 bg-purple-600 rounded-lg hover:bg-purple-700 transition text-lg font-semibold"
            >
              Start Meditating
            </button>
            <button
              onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-gray-800/80 rounded-lg hover:bg-gray-700/80 transition text-lg font-semibold backdrop-blur-sm"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Choose Your Journey Section */}
      <div id="journey" className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Choose Your Journey
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            Select the type of meditation that resonates with your current needs
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 p-8 rounded-2xl backdrop-blur-sm border border-purple-700/50">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🧘</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Relaxation</h3>
              <p className="text-gray-300">
                Release stress and tension with guided relaxation techniques designed to calm your mind and body.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 p-8 rounded-2xl backdrop-blur-sm border border-blue-700/50">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🌙</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Sleep</h3>
              <p className="text-gray-300">
                Drift into peaceful slumber with soothing meditations crafted to quiet your thoughts and prepare for rest.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/30 p-8 rounded-2xl backdrop-blur-sm border border-indigo-700/50">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Manifestation</h3>
              <p className="text-gray-300">
                Align with your goals and dreams through powerful visualization and affirmation practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Why GenZen?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-purple-400">
                  AI-Powered Personalization
                </h3>
                <p className="text-gray-300">
                  Every meditation is uniquely generated based on your specific needs, goals, and preferences. No two sessions are exactly alike.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-purple-400">
                  Professional Voice Synthesis
                </h3>
                <p className="text-gray-300">
                  Choose from multiple voice options with natural-sounding narration that guides you through your practice.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-purple-400">
                  Build Your Library
                </h3>
                <p className="text-gray-300">
                  Save your favorite meditations and access them anytime. Track your journey and watch your practice evolve.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-8 rounded-2xl border border-purple-700/30">
              <div className="aspect-video bg-gray-800/50 rounded-lg flex items-center justify-center">
                <span className="text-6xl opacity-50">🎧</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6 bg-gradient-to-t from-purple-900/20 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Begin Your Journey Today
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands discovering inner peace through personalized AI meditation
          </p>
          <button
            onClick={() => user ? setCurrentView('create') : setCurrentView('signup')}
            className="px-10 py-4 bg-purple-600 rounded-lg hover:bg-purple-700 transition text-lg font-semibold"
          >
            Get Started Free
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 GenZen. Crafted with mindfulness.</p>
        </div>
      </footer>
    </div>
  )
}