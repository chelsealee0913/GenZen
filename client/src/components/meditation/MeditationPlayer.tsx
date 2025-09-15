import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useMeditation } from "@/contexts/MeditationContext";
import { Meditation } from "@shared/schema";

interface MeditationPlayerProps {
  meditation: Meditation;
  onClose?: () => void;
}

export function MeditationPlayer({ meditation, onClose }: MeditationPlayerProps) {
  const { isPlaying, currentTime, duration, playMeditation, pauseMeditation, resumeMeditation, stopMeditation, seekTo } = useMeditation();
  const [backgroundAudio, setBackgroundAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Set up background audio if specified
    if (meditation.settings?.background && meditation.settings.background !== 'silence') {
      const audio = new Audio(`/sounds/${meditation.settings.background}.mp3`);
      audio.loop = true;
      audio.volume = 0.3;
      setBackgroundAudio(audio);
      
      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, [meditation.settings?.background]);

  useEffect(() => {
    // Auto-play the meditation when component mounts
    playMeditation(meditation);
  }, [meditation, playMeditation]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseMeditation();
      backgroundAudio?.pause();
    } else {
      resumeMeditation();
      backgroundAudio?.play();
    }
  };

  const handleStop = () => {
    stopMeditation();
    backgroundAudio?.pause();
    if (backgroundAudio) {
      backgroundAudio.currentTime = 0;
    }
    onClose?.();
  };

  const handleSeek = (value: number[]) => {
    seekTo(value[0]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get background image URL
  const getBackgroundImage = () => {
    const images = {
      beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop',
      mountains: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
      forest: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop',
    };
    return images[meditation.settings?.visual as keyof typeof images] || images.beach;
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${getBackgroundImage()})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Player Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="text-white">
            <h1 className="text-2xl md:text-3xl font-light mb-2">{meditation.title}</h1>
            <p className="text-white/80">{meditation.description}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleStop}
            className="text-white hover:bg-white/20"
            data-testid="button-close-player"
          >
            <i className="fas fa-times"></i>
          </Button>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 mx-auto">
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-3xl md:text-4xl`}></i>
            </div>
            <h2 className="text-xl md:text-2xl font-medium mb-2">
              {isPlaying ? 'Now Playing' : 'Paused'}
            </h2>
            <p className="text-white/80 capitalize">{meditation.type} • {meditation.duration} minutes</p>
          </div>
        </div>

        {/* Player Controls */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-6">
            {/* Progress Bar */}
            <div className="mb-4">
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={handleSeek}
                className="mb-2"
                data-testid="slider-progress"
              />
              <div className="flex justify-between text-sm text-white/80">
                <span data-testid="text-current-time">{formatTime(currentTime)}</span>
                <span data-testid="text-duration">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => seekTo(Math.max(0, currentTime - 30))}
                data-testid="button-rewind"
              >
                <i className="fas fa-backward"></i>
              </Button>
              
              <Button
                size="lg"
                onClick={handlePlayPause}
                className="w-16 h-16 rounded-full bg-white text-black hover:bg-white/90"
                data-testid="button-play-pause"
              >
                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-xl`}></i>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => seekTo(Math.min(duration, currentTime + 30))}
                data-testid="button-forward"
              >
                <i className="fas fa-forward"></i>
              </Button>
            </div>

            {/* Background Sound Indicator */}
            {meditation.settings?.background && meditation.settings.background !== 'silence' && (
              <div className="mt-4 text-center text-sm text-white/60">
                <i className="fas fa-volume-up mr-1"></i>
                Background: {meditation.settings.background.replace('_', ' ')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
