import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import MeditationCard from './MeditationCard'

export default function CommunityLibrary() {
  const [meditations, setMeditations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchCommunityMeditations()
  }, [])

  const fetchCommunityMeditations = async () => {
    try {
      const { data } = await supabase
        .from('meditations')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20)

      if (data) setMeditations(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold mb-6">Community Meditations</h2>
      {meditations.length === 0 ? (
        <p className="text-gray-500 text-center">No community meditations yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meditations.map((meditation) => (
            <MeditationCard key={meditation.id} meditation={meditation} />
          ))}
        </div>
      )}
    </div>
  )
}