import { createContext, useContext, useState, useRef } from "react";
import { Meditation } from "@shared/schema";

interface MeditationState {
  currentMeditation: Meditation | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  audioRef: HTMLAudioElement | null;
}

interface MeditationContextType extends MeditationState {
  playMeditation: (meditation: Meditation) => Promise<void>;
  pauseMeditation: () => void;
  resumeMeditation: () => void;
  stopMeditation: () => void;
  seekTo: (time: number) => void;
}

const MeditationContext = createContext<MeditationContextType | undefined>(undefined);

export function MeditationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MeditationState>({
    currentMeditation: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    audioRef: null,
  });

  const audioRef = useRef<HTMLAudioElement>(null);

  const playMeditation = async (meditation: Meditation) => {
    try {
      // Generate TTS audio if not already available
      if (!meditation.audioUrl && meditation.script) {
        const { generateSpeech } = await import("@/services/tts");
        const audioUrl = await generateSpeech(meditation.script, {
          voice: meditation.settings?.voice || 'female',
          rate: 0.9,
          pitch: 1.0,
        });
        meditation.audioUrl = audioUrl;
      }

      setState(prev => ({
        ...prev,
        currentMeditation: meditation,
        isPlaying: true,
        audioRef: audioRef.current,
      }));

      // Track play count
      await fetch(`/api/library/meditation/${meditation.id}/play`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await import("firebase/auth").then(m => m.getAuth().currentUser?.getIdToken())}`,
        },
      });
    } catch (error) {
      console.error('Failed to play meditation:', error);
    }
  };

  const pauseMeditation = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  const resumeMeditation = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true }));
    }
  };

  const stopMeditation = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setState(prev => ({
      ...prev,
      currentMeditation: null,
      isPlaying: false,
      currentTime: 0,
    }));
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState(prev => ({ ...prev, currentTime: time }));
    }
  };

  return (
    <MeditationContext.Provider value={{
      ...state,
      playMeditation,
      pauseMeditation,
      resumeMeditation,
      stopMeditation,
      seekTo,
    }}>
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => {
          const audio = e.target as HTMLAudioElement;
          setState(prev => ({ ...prev, currentTime: audio.currentTime }));
        }}
        onLoadedMetadata={(e) => {
          const audio = e.target as HTMLAudioElement;
          setState(prev => ({ ...prev, duration: audio.duration }));
        }}
        onPlay={() => setState(prev => ({ ...prev, isPlaying: true }))}
        onPause={() => setState(prev => ({ ...prev, isPlaying: false }))}
        onEnded={() => setState(prev => ({ ...prev, isPlaying: false }))}
      />
    </MeditationContext.Provider>
  );
}

export function useMeditation() {
  const context = useContext(MeditationContext);
  if (context === undefined) {
    throw new Error('useMeditation must be used within a MeditationProvider');
  }
  return context;
}
