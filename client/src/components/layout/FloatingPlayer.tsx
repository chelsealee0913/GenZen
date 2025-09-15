import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMeditation } from "@/contexts/MeditationContext";

export function FloatingPlayer() {
  const { 
    currentMeditation, 
    isPlaying, 
    currentTime, 
    duration,
    pauseMeditation,
    resumeMeditation,
    stopMeditation 
  } = useMeditation();

  if (!currentMeditation) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBackgroundImage = () => {
    const images = {
      beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&h=100&fit=crop',
      mountains: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop',
      forest: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop',
    };
    return images[currentMeditation.settings?.visual as keyof typeof images] || images.beach;
  };

  return (
    <div className="fixed bottom-20 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-[calc(100%-2rem)] md:max-w-md">
      <div className="bg-background/95 backdrop-blur-lg rounded-lg border border-border shadow-lg p-4">
        <div className="flex items-center space-x-4">
          {/* Thumbnail */}
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={getBackgroundImage()} 
              alt="Currently playing" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate" data-testid="text-current-title">
              {currentMeditation.title}
            </div>
            <div className="text-xs text-muted-foreground" data-testid="text-current-details">
              {currentMeditation.type.charAt(0).toUpperCase() + currentMeditation.type.slice(1)} • {currentMeditation.duration} min
            </div>
            
            {/* Progress bar */}
            <div className="mt-2">
              <Progress value={progress} className="h-1" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span data-testid="text-current-time">{formatTime(currentTime)}</span>
                <span data-testid="text-total-duration">{formatTime(duration)}</span>
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={isPlaying ? pauseMeditation : resumeMeditation}
              className="w-8 h-8"
              data-testid="button-floating-play-pause"
            >
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-sm`}></i>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={stopMeditation}
              className="w-8 h-8"
              data-testid="button-floating-close"
            >
              <i className="fas fa-times text-sm"></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
