import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, duration, voice, background, goals } = body

    // For now, return mock data - replace with OpenAI integration later
    const mockScript = `Welcome to your ${duration}-minute ${type} meditation. 
    Find a comfortable position and close your eyes. 
    Take a deep breath in... and slowly exhale. 
    ${goals ? `Today we'll focus on: ${goals}` : 'Let\'s begin your journey to relaxation.'}
    Continue breathing naturally...`

    const mockAudio = 'data:audio/mp3;base64,mock-audio-data'

    // Save to Supabase
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('meditations')
      .insert({
        user_id: user.id,
        type,
        duration,
        script: mockScript,
        audio_url: mockAudio,
        settings: { voice, background },
        is_public: false
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      id: data.id,
      script: mockScript,
      audioUrl: mockAudio,
      duration,
      type
    })
  } catch (error) {
    console.error('Error generating meditation:', error)
    return NextResponse.json(
      { error: 'Failed to generate meditation' },
      { status: 500 }
    )
  }
}