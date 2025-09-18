'use client'

interface TypeSelectorProps {
  onTypeSelect: (type: string) => void
}

const meditationTypes = [
  {
    id: 'relaxation',
    title: 'Relaxation',
    description: 'Release stress and find calm',
    icon: '😌',
    gradient: 'from-blue-400 to-blue-600'
  },
  {
    id: 'sleep',
    title: 'Sleep',
    description: 'Drift into peaceful slumber',
    icon: '😴',
    gradient: 'from-purple-400 to-purple-600'
  },
  {
    id: 'focus',
    title: 'Focus',
    description: 'Enhance concentration and clarity',
    icon: '🎯',
    gradient: 'from-orange-400 to-orange-600'
  },
  {
    id: 'anxiety',
    title: 'Anxiety Relief',
    description: 'Calm your mind and ease worries',
    icon: '🌸',
    gradient: 'from-pink-400 to-pink-600'
  },
  {
    id: 'manifestation',
    title: 'Manifestation',
    description: 'Visualize and achieve your goals',
    icon: '✨',
    gradient: 'from-yellow-400 to-yellow-600'
  },
  {
    id: 'gratitude',
    title: 'Gratitude',
    description: 'Cultivate appreciation and joy',
    icon: '🙏',
    gradient: 'from-green-400 to-green-600'
  }
]

export default function TypeSelector({ onTypeSelect }: TypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {meditationTypes.map((type) => (
        <button
          key={type.id}
          onClick={() => onTypeSelect(type.id)}
          className="group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white border border-gray-200"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
          <div className="relative z-10">
            <div className="text-4xl mb-3">{type.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
            <p className="text-gray-600">{type.description}</p>
          </div>
        </button>
      ))}
    </div>
  )
}