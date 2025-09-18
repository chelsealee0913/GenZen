'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'
import MeditationGenerator from '@/components/MeditationGenerator'
import MeditationPlayer from '@/components/MeditationPlayer'
import CommunityLibrary from '@/components/CommunityLibrary'
import TypeSelector from '@/components/TypeSelector'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'signup' | 'create' | 'player' | 'community' | 'library'>('home')
  const [currentMeditation, setCurrentMeditation] = useState(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
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
        setCurrentView('home')
      }
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setCurrentView('home')
  }

  const handleMeditationComplete = (meditation: any) => {
    setCurrentMeditation(meditation)
    setCurrentView('player')
  }

  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
    setCurrentView('create')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  // Login View
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-light text-center mb-8">Welcome Back</h2>
          
          <form onSubmit={(e) => handleAuth(e, false)} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-medium"
            >
              Sign In
            </button>
          </form>
          
          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => setCurrentView('signup')}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Sign Up
            </button>
          </p>
          
          <button
            onClick={() => setCurrentView('home')}
            className="w-full mt-4 text-gray-500 hover:text-gray-700 transition"
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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-light text-center mb-8">Create Account</h2>
          
          <form onSubmit={(e) => handleAuth(e, true)} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
              minLength={6}
            />
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-medium"
            >
              Sign Up
            </button>
          </form>
          
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => setCurrentView('login')}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Sign In
            </button>
          </p>
          
          <button
            onClick={() => setCurrentView('home')}
            className="w-full mt-4 text-gray-500 hover:text-gray-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // Create View
  if (currentView === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 
              onClick={() => setCurrentView('home')}
              className="text-2xl font-light cursor-pointer"
            >
              GenZen
            </h1>
            <button
              onClick={() => setCurrentView('home')}
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Back to Home
            </button>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto p-6">
          {selectedType ? (
            <MeditationGenerator 
              onComplete={handleMeditationComplete}
              initialType={selectedType}
            />
          ) : (
            <TypeSelector onTypeSelect={handleTypeSelect} />
          )}
        </div>
      </div>
    )
  }

  // Player View
  if (currentView === 'player' && currentMeditation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 
              onClick={() => setCurrentView('home')}
              className="text-2xl font-light cursor-pointer"
            >
              GenZen
            </h1>
            <button
              onClick={() => setCurrentView('home')}
              className="text-gray-600 hover:text-gray-900 transition"
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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 
              onClick={() => setCurrentView('home')}
              className="text-2xl font-light cursor-pointer"
            >
              GenZen
            </h1>
            <button
              onClick={() => setCurrentView('home')}
              className="text-gray-600 hover:text-gray-900 transition"
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

  // Home View (Default)
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="text-white text-2xl font-light">GenZen</div>
          
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-white/80 text-sm hidden md:block">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-white/10 backdrop-blur text-white rounded-lg hover:bg-white/20 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className="px-6 py-2 bg-white/10 backdrop-blur text-white rounded-lg hover:bg-white/20 transition font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - Matching Replit */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')" 
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight">
            Find Your Inner Peace
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
            AI-powered personalized meditations crafted just for you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => user ? setCurrentView('create') : setCurrentView('signup')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg font-medium rounded-lg transition"
            >
              Start Meditating
            </button>
            <button
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 text-lg font-medium rounded-lg hover:bg-white/20 transition"
              onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Meditation Types Section */}
      <section id="journey" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light mb-4">Choose Your Journey</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Select the type of meditation that resonates with your current needs
            </p>
          </div>
          
          <TypeSelector onTypeSelect={handleTypeSelect} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light mb-4">Why Choose GenZen?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience the power of AI-personalized meditation designed just for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-medium mb-3">AI-Powered Personalization</h3>
              <p className="text-gray-600">Every meditation is uniquely crafted based on your goals, mood, and preferences using advanced AI technology.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🎤</span>
              </div>
              <h3 className="text-xl font-medium mb-3">Natural Voice Synthesis</h3>
              <p className="text-gray-600">High-quality text-to-speech creates soothing, natural-sounding guidance that feels personal and calming.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-medium mb-3">Immersive Environments</h3>
              <p className="text-gray-600">Beautiful visuals and ambient sounds create the perfect atmosphere for your meditation practice.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">⏰</span>
              </div>
              <h3 className="text-xl font-medium mb-3">Flexible Duration</h3>
              <p className="text-gray-600">From quick 5-minute sessions to deep 60-minute journeys, meditate according to your schedule.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-medium mb-3">Community Sharing</h3>
              <p className="text-gray-600">Discover and share meaningful meditations with a supportive community of mindful practitioners.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-medium mb-3">Progress Tracking</h3>
              <p className="text-gray-600">Monitor your meditation journey with insights about your practice patterns and personal growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light mb-4">Community Meditations</h2>
            <p className="text-gray-600 text-lg">Discover meditations shared by our community</p>
          </div>
          <CommunityLibrary />
        </div>
      </section>
    </div>
  )
}