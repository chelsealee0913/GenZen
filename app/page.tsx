import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'
import MeditationGenerator from '@/components/MeditationGenerator'
import MeditationPlayer from '@/components/MeditationPlayer'
import CommunityLibrary from '@/components/CommunityLibrary'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [currentView, setCurrentView] = useState<'home' | 'create' | 'player' | 'community'>('home')
  const [currentMeditation, setCurrentMeditation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  
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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('Check your email for confirmation!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-2">GenZen</h1>
          <p className="text-gray-600 text-center mb-6">AI-Powered Meditation</p>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
          
          <p className="text-center mt-4 text-sm text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-1 text-purple-600 hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 
            onClick={() => setCurrentView('home')}
            className="text-2xl font-bold text-purple-600 cursor-pointer"
          >
            GenZen
          </h1>
          <div className="flex gap-4 items-center">
            <span className="text-gray-600">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-800"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4">
        {currentView === 'home' && (
          <div className="py-12">
            <h2 className="text-4xl font-bold text-center mb-8">Welcome to GenZen</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <button
                onClick={() => setCurrentView('create')}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-2">Create Meditation</h3>
                <p className="text-gray-600">Generate a personalized meditation experience</p>
              </button>
              
              <button
                onClick={() => setCurrentView('community')}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-2">Community Library</h3>
                <p className="text-gray-600">Explore meditations shared by others</p>
              </button>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">My Library</h3>
                <p className="text-gray-600">Coming soon...</p>
              </div>
            </div>
          </div>
        )}

        {currentView === 'create' && (
          <MeditationGenerator onComplete={handleMeditationComplete} />
        )}

        {currentView === 'player' && currentMeditation && (
          <MeditationPlayer meditation={currentMeditation} />
        )}

        {currentView === 'community' && (
          <CommunityLibrary />
        )}
      </main>
    </div>
  )
}