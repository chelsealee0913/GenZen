import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Meditation } from "@shared/schema";
import { useMeditation } from "@/contexts/MeditationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface MeditationCardProps {
  meditation: Meditation;
  onPlay?: (meditation: Meditation) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export function MeditationCard({ meditation, onPlay, onDelete, showActions = true }: MeditationCardProps) {
  const [isFavorite, setIsFavorite] = useState(meditation.isFavorite);
  const [loading, setLoading] = useState(false);
  const { playMeditation } = useMeditation();
  const { firebaseUser } = useAuth();
  const { toast } = useToast();

  const getTypeColor = (type: string) => {
    const colors = {
      manifestation: 'bg-purple-500/20 text-purple-400',
      relaxation: 'bg-blue-500/20 text-blue-400',
      sleep: 'bg-indigo-500/20 text-indigo-400',
      visualization: 'bg-emerald-500/20 text-emerald-400',
      affirmations: 'bg-amber-500/20 text-amber-400',
      mindfulness: 'bg-rose-500/20 text-rose-400',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-400';
  };

  const getBackgroundImage = () => {
    const images = {
      beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=225&fit=crop',
      mountains: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop',
      forest: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=225&fit=crop',
    };
    return images[meditation.settings?.visual as keyof typeof images] || images.beach;
  };

  const handlePlay = () => {
    if (onPlay) {
      onPlay(meditation);
    } else {
      playMeditation(meditation);
    }
  };

  const handleToggleFavorite = async () => {
    if (!firebaseUser) return;

    setLoading(true);
    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/library/meditation/${meditation.id}/favorite`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isFavorite: !isFavorite }),
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
        toast({
          title: isFavorite ? "Removed from favorites" : "Added to favorites",
          description: meditation.title,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!firebaseUser || !onDelete) return;

    if (!confirm('Are you sure you want to delete this meditation?')) return;

    setLoading(true);
    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/library/meditation/${meditation.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onDelete(meditation.id);
        toast({
          title: "Meditation deleted",
          description: meditation.title,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete meditation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Thumbnail */}
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={getBackgroundImage()} 
          alt={meditation.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div className="absolute bottom-3 left-3 text-white">
          <div className="text-sm opacity-90" data-testid={`text-duration-${meditation.id}`}>
            {meditation.duration} minutes
          </div>
        </div>
        
        {showActions && (
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 text-white hover:bg-white/20 ${loading ? 'opacity-50' : ''}`}
            onClick={handleToggleFavorite}
            disabled={loading}
            data-testid={`button-favorite-${meditation.id}`}
          >
            <i className={`fas fa-heart ${isFavorite ? 'text-red-500' : ''}`}></i>
          </Button>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Badge className={getTypeColor(meditation.type)} data-testid={`badge-type-${meditation.id}`}>
            {meditation.type.charAt(0).toUpperCase() + meditation.type.slice(1)}
          </Badge>
          <span className="text-xs text-muted-foreground" data-testid={`text-date-${meditation.id}`}>
            {formatDate(meditation.createdAt)}
          </span>
        </div>
        
        <h3 className="font-medium mb-2" data-testid={`text-title-${meditation.id}`}>
          {meditation.title}
        </h3>
        
        {meditation.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2" data-testid={`text-description-${meditation.id}`}>
            {meditation.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <i className="fas fa-play"></i>
            <span data-testid={`text-play-count-${meditation.id}`}>
              {meditation.playCount} plays
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {showActions && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={loading}
                className="text-muted-foreground hover:text-destructive"
                data-testid={`button-delete-${meditation.id}`}
              >
                <i className="fas fa-trash text-sm"></i>
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePlay}
              className="text-primary hover:text-primary/80"
              data-testid={`button-play-${meditation.id}`}
            >
              <i className="fas fa-play-circle text-xl"></i>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
