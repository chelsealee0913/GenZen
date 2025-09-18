'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'
import MeditationGenerator from '@/components/MeditationGenerator'
import MeditationPlayer from '@/components/MeditationPlayer'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'signup' | 'create' | 'player' | 'community' | 'library'>('home')
  const [currentMeditation, setCurrentMeditation] = useState(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'recent' | 'popular'>('recent')
  
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    )
  }

  // Login View
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-light text-white text-center mb-8">Welcome Back</h2>
          
          <form onSubmit={(e) => handleAuth(e, false)} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
              required
            />
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-medium"
            >
              Sign In
            </button>
          </form>
          
          <p className="text-center mt-6 text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={() => setCurrentView('signup')}
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Sign Up
            </button>
          </p>
          
          <button
            onClick={() => setCurrentView('home')}
            className="w-full mt-4 text-gray-500 hover:text-gray-300 transition"
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
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-light text-white text-center mb-8">Create Account</h2>
          
          <form onSubmit={(e) => handleAuth(e, true)} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
              required
            />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
              required
              minLength={6}
            />
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-medium"
            >
              Sign Up
            </button>
          </form>
          
          <p className="text-center mt-6 text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => setCurrentView('login')}
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Sign In
            </button>
          </p>
          
          <button
            onClick={() => setCurrentView('home')}
            className="w-full mt-4 text-gray-500 hover:text-gray-300 transition"
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
      <div className="min-h-screen bg-black">
        <nav className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
              <span 
                onClick={() => setCurrentView('home')}
                className="text-xl font-light text-white cursor-pointer"
              >
                GenZen
              </span>
            </div>
            <button
              onClick={() => setCurrentView('home')}
              className="text-gray-400 hover:text-white transition"
            >
              Back to Home
            </button>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto p-6">
          <MeditationGenerator 
            onComplete={handleMeditationComplete}
            initialType={selectedType}
          />
        </div>
      </div>
    )
  }

  // Player View
  if (currentView === 'player' && currentMeditation) {
    return (
      <div className="min-h-screen bg-black">
        <nav className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
              <span className="text-xl font-light text-white">GenZen</span>
            </div>
            <button
              onClick={() => setCurrentView('home')}
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

  // Home View (Default)
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">G</span>
            </div>
            <span className="text-xl font-light text-white">GenZen</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-gray-300">
            <button 
              onClick={() => user ? setCurrentView('create') : setCurrentView('login')}
              className="hover:text-white transition"
            >
              Create
            </button>
            <button 
              onClick={() => user ? setCurrentView('library') : setCurrentView('login')}
              className="hover:text-white transition"
            >
              Library
            </button>
            <button 
              onClick={() => setCurrentView('community')}
              className="hover:text-white transition"
            >
              Community
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-white text-xl">🌙</span>
            </div>
            
            {user ? (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')",
            filter: 'brightness(0.4)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight">
            Find Your Inner Peace
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 font-light">
            AI-powered personalized meditations crafted just for you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => user ? setCurrentView('create') : setCurrentView('signup')}
              className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-lg font-medium"
            >
              Start Meditating
            </button>
            <button
              className="px-8 py-4 glass-button text-white rounded-lg text-lg font-medium"
              onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Meditation Types Section */}
      <section id="journey" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">Choose Your Journey</h2>
            <p className="text-gray-400 text-lg">
              Select the type of meditation that resonates with your current needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Manifestation Card */}
            <button
              onClick={() => { setSelectedType('manifestation'); setCurrentView('create'); }}
              className="meditation-card rounded-xl p-8 text-left group"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Manifestation</h3>
              <p className="text-gray-400 text-sm mb-3">Goal-specific statements and visualization</p>
              <p className="text-purple-400 text-sm">5-30 minutes</p>
            </button>

            {/* Relaxation Card */}
            <button
              onClick={() => { setSelectedType('relaxation'); setCurrentView('create'); }}
              className="meditation-card rounded-xl p-8 text-left group"
            >
              <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl">🌊</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Relaxation</h3>
              <p className="text-gray-400 text-sm mb-3">Stress relief and deep calming techniques</p>
              <p className="text-cyan-400 text-sm">5-30 minutes</p>
            </button>

            {/* Sleep Card */}
            <button
              onClick={() => { setSelectedType('sleep'); setCurrentView('create'); }}
              className="meditation-card rounded-xl p-8 text-left group"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl">🌙</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Sleep</h3>
              <p className="text-gray-400 text-sm mb-3">Bedtime stories and sleep-inducing practices</p>
              <p className="text-purple-400 text-sm">10-60 minutes</p>
            </button>

            {/* Visualization Card */}
            <button
              onClick={() => { setSelectedType('visualization'); setCurrentView('create'); }}
              className="meditation-card rounded-xl p-8 text-left group"
            >
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl">👁️</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Visualization</h3>
              <p className="text-gray-400 text-sm mb-3">Guided imagery and mental rehearsal</p>
              <p className="text-green-400 text-sm">10-25 minutes</p>
            </button>

            {/* Affirmations Card */}
            <button
              onClick={() => { setSelectedType('affirmations'); setCurrentView('create'); }}
              className="meditation-card rounded-xl p-8 text-left group"
            >
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl">💛</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Affirmations</h3>
              <p className="text-gray-400 text-sm mb-3">Positive self-talk and confidence building</p>
              <p className="text-orange-400 text-sm">5-20 minutes</p>
            </button>

            {/* Mindfulness Card */}
            <button
              onClick={() => { setSelectedType('mindfulness'); setCurrentView('create'); }}
              className="meditation-card rounded-xl p-8 text-left group"
            >
              <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl">🧘</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Mindfulness</h3>
              <p className="text-gray-400 text-sm mb-3">Present moment awareness and breathing</p>
              <p className="text-pink-400 text-sm">5-30 minutes</p>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">Why Choose GenZen?</h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Experience the power of AI-personalized meditation designed just for you.
              Enjoy a seamless, immersive journey with our unique features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">AI-Powered Personalization</h3>
              <p className="text-gray-400">Every meditation is uniquely crafted based on your goals, mood, and preferences using advanced AI technology.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🎤</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Natural Voice Synthesis</h3>
              <p className="text-gray-400">High-quality text-to-speech creates soothing, natural-sounding guidance that feels personal and calming.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Immersive Environments</h3>
              <p className="text-gray-400">Beautiful visuals and ambient sounds create the perfect atmosphere for your meditation practice.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-orange-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">⏰</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Flexible Duration</h3>
              <p className="text-gray-400">From quick 5-minute sessions to deep 60-minute journeys, meditate according to your schedule.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-pink-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Community Sharing</h3>
              <p className="text-gray-400">Discover and share meaningful meditations with a supportive community of mindful practitioners.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Progress Tracking</h3>
              <p className="text-gray-400">Monitor your meditation journey with insights about your practice patterns and personal growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">Community Meditations</h2>
            <p className="text-gray-400 text-lg">
              Discover and enjoy meditations shared by our mindful community
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-900 rounded-lg p-1 inline-flex">
              <button
                onClick={() => setActiveTab('recent')}
                className={`px-6 py-2 rounded-md transition ${
                  activeTab === 'recent' 
                    ? 'bg-gray-700 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Recent
              </button>
              <button
                onClick={() => setActiveTab('popular')}
                className={`px-6 py-2 rounded-md transition ${
                  activeTab === 'popular' 
                    ? 'bg-gray-700 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Popular
              </button>
            </div>
          </div>

          {/* Community Content */}
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className="text-xl font-medium text-white mb-3">No Community Meditations</h3>
            <p className="text-gray-400">Be the first to share a meditation with the community!</p>
          </div>
        </div>
      </section>
    </div>
  )
}