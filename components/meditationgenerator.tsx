import { useState } from 'react'

interface MeditationGeneratorProps {
  onComplete: (meditation: any) => void
}

export default function MeditationGenerator({ onComplete }: MeditationGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'relaxation',
    duration: 10,
    voice: 'female',
    background: 'ocean_waves',
    goals: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/meditation/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to generate meditation')
      
      const data = await response.json()
      onComplete(data)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to generate meditation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6">Create Your Meditation</h2>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="relaxation">Relaxation</option>
            <option value="sleep">Sleep</option>
            <option value="focus">Focus</option>
            <option value="manifestation">Manifestation</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
          <select
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Voice</label>
          <select
            value={formData.voice}
            onChange={(e) => setFormData({...formData, voice: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Background Sound</label>
          <select
            value={formData.background}
            onChange={(e) => setFormData({...formData, background: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="ocean_waves">Ocean Waves</option>
            <option value="forest">Forest</option>
            <option value="rain">Rain</option>
            <option value="silence">Silence</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Goals (Optional)</label>
          <textarea
            value={formData.goals}
            onChange={(e) => setFormData({...formData, goals: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
            placeholder="What would you like to focus on?"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:bg-purple-400"
        >
          {loading ? 'Generating...' : 'Generate Meditation'}
        </button>
      </form>
    </div>
  )
}