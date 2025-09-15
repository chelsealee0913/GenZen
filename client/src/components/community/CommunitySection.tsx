import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommunityMeditation } from "@shared/schema";
import { useMeditation } from "@/contexts/MeditationContext";
import { useQuery } from "@tanstack/react-query";

interface CommunityMeditationCardProps {
  meditation: CommunityMeditation;
  onPlay: (meditation: CommunityMeditation) => void;
}

function CommunityMeditationCard({ meditation, onPlay }: CommunityMeditationCardProps) {
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
      manifestation: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=300&fit=crop',
      relaxation: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=300&h=300&fit=crop',
      sleep: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&h=300&fit=crop',
      visualization: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
      affirmations: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=300&fit=crop',
      mindfulness: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=300&h=300&fit=crop',
    };
    return images[meditation.type as keyof typeof images] || images.relaxation;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={getBackgroundImage()} 
          alt={meditation.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div className="absolute bottom-3 left-3 text-white">
          <div className="text-sm opacity-90">{meditation.duration} min</div>
        </div>
        
        <div className="absolute top-3 right-3 flex items-center space-x-1 text-white">
          <i className="fas fa-star text-yellow-400"></i>
          <span className="text-sm">{meditation.rating.toFixed(1)}</span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <Badge className={getTypeColor(meditation.type)}>
          {meditation.type.charAt(0).toUpperCase() + meditation.type.slice(1)}
        </Badge>
        
        <h3 className="font-medium mt-2 mb-1" data-testid={`text-title-${meditation.id}`}>
          {meditation.title}
        </h3>
        
        {meditation.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {meditation.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span data-testid={`text-play-count-${meditation.id}`}>
            {meditation.playCount.toLocaleString()} plays
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPlay(meditation)}
            className="text-primary hover:text-primary/80"
            data-testid={`button-play-${meditation.id}`}
          >
            <i className="fas fa-play-circle text-lg"></i>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function CommunitySection() {
  const { data: communityMeditations = [], isLoading: isLoadingCommunity } = useQuery({
    queryKey: ['/api/community/meditations'],
    queryFn: async () => {
      const response = await fetch('/api/community/meditations');
      if (!response.ok) throw new Error('Failed to fetch community meditations');
      return response.json() as Promise<CommunityMeditation[]>;
    },
  });

  const { data: popularMeditations = [], isLoading: isLoadingPopular } = useQuery({
    queryKey: ['/api/community/popular'],
    queryFn: async () => {
      const response = await fetch('/api/community/popular');
      if (!response.ok) throw new Error('Failed to fetch popular meditations');
      return response.json() as Promise<CommunityMeditation[]>;
    },
  });

  const handlePlayCommunityMeditation = async (meditation: CommunityMeditation) => {
    try {
      // Track play count for community meditation
      await fetch(`/api/community/meditation/${meditation.id}/play`, {
        method: 'POST',
      });
      
      // Create a mock meditation object for the player
      // In a real implementation, you'd fetch the full meditation data
      const mockMeditation = {
        id: meditation.id,
        userId: '',
        type: meditation.type,
        title: meditation.title,
        description: meditation.description || '',
        duration: meditation.duration,
        script: 'This is a community shared meditation. The full script would be loaded here.',
        audioUrl: null,
        settings: { voice: 'female', background: 'ocean_waves', visual: 'beach' },
        customization: null,
        createdAt: meditation.createdAt,
        playCount: meditation.playCount,
        isShared: true,
        isFavorite: false,
      };
      
      // You would implement playing community meditations here
      console.log('Playing community meditation:', mockMeditation);
    } catch (error) {
      console.error('Failed to play community meditation:', error);
    }
  };

  const renderMeditationGrid = (meditations: CommunityMeditation[], isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-muted rounded-lg mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      );
    }

    if (meditations.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-users text-muted-foreground text-xl"></i>
          </div>
          <h3 className="text-xl font-medium mb-2">No Community Meditations</h3>
          <p className="text-muted-foreground">
            Be the first to share a meditation with the community!
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {meditations.map((meditation) => (
          <CommunityMeditationCard
            key={meditation.id}
            meditation={meditation}
            onPlay={handlePlayCommunityMeditation}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light mb-4">Community Meditations</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover and enjoy meditations shared by our mindful community
          </p>
        </div>

        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent">
            {renderMeditationGrid(communityMeditations, isLoadingCommunity)}
          </TabsContent>
          
          <TabsContent value="popular">
            {renderMeditationGrid(popularMeditations, isLoadingPopular)}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
