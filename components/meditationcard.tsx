interface MeditationCardProps {
  meditation: {
    id: string
    title?: string
    type: string
    duration: number
    created_at: string
  }
}

export default function MeditationCard({ meditation }: MeditationCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <h3 className="text-lg font-semibold mb-2">
        {meditation.title || `${meditation.type} Meditation`}
      </h3>
      <p className="text-gray-600 mb-2">
        Duration: {meditation.duration} minutes
      </p>
      <p className="text-gray-500 text-sm">
        {new Date(meditation.created_at).toLocaleDateString()}
      </p>
    </div>
  )
}