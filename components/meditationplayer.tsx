import { useState, useRef, useEffect } from 'react'

interface MeditationPlayerProps {
  meditation: {
    id?: string
    script: string
    audioUrl?: string
    duration: number
    type: string
  }
}

export default function MeditationPlayer({ meditation }: MeditationPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', updateProgress)
      audioRef.current.addEventListener('ended', () => setIsPlaying(false))
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress)
        audioRef.current.removeEventListener('ended', () => setIsPlaying(false))
      }
    }
  }, [])

  const updateProgress = () => {
    if (audioRef.current) {
      const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100
      setProgress(percent)
    }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">
          {meditation.type.charAt(0).toUpperCase() + meditation.type.slice(1)} Meditation
        </h2>
        
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <p className="text-gray-700">{meditation.script}</p>
        </div>

        <div className="space-y-4">
          {meditation.audioUrl && (
            <audio ref={audioRef} src={meditation.audioUrl} />
          )}
          
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={togglePlay}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>

          <p className="text-center text-gray-600">
            Duration: {meditation.duration} minutes
          </p>
        </div>
      </div>
    </div>
  )
}