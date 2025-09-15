import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MeditationCard } from "./MeditationCard";
import { Meditation } from "@shared/schema";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

export function MeditationLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const { firebaseUser } = useAuth();

  const { data: meditations = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/library/meditations'],
    enabled: !!firebaseUser,
    queryFn: async () => {
      const token = await firebaseUser!.getIdToken();
      const response = await fetch('/api/library/meditations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch meditations');
      }
      
      return response.json() as Promise<Meditation[]>;
    },
  });

  const filteredMeditations = meditations
    .filter(meditation => {
      const matchesSearch = meditation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           meditation.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || meditation.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'most-played':
          return b.playCount - a.playCount;
        case 'duration-short':
          return a.duration - b.duration;
        case 'duration-long':
          return b.duration - a.duration;
        default:
          return 0;
      }
    });

  const handleDeleteMeditation = (id: string) => {
    refetch();
  };

  if (!firebaseUser) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-lock text-primary text-xl"></i>
        </div>
        <h3 className="text-xl font-medium mb-2">Sign in Required</h3>
        <p className="text-muted-foreground">Please sign in to access your meditation library.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video bg-muted rounded-lg mb-4"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-light mb-2">Your Library</h2>
            <p className="text-muted-foreground">
              {meditations.length} meditation{meditations.length !== 1 ? 's' : ''} in your collection
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Search meditations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
              data-testid="input-search-meditations"
            />
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-40" data-testid="select-filter-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="manifestation">Manifestation</SelectItem>
                <SelectItem value="relaxation">Relaxation</SelectItem>
                <SelectItem value="sleep">Sleep</SelectItem>
                <SelectItem value="visualization">Visualization</SelectItem>
                <SelectItem value="affirmations">Affirmations</SelectItem>
                <SelectItem value="mindfulness">Mindfulness</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40" data-testid="select-sort-by">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="most-played">Most Played</SelectItem>
                <SelectItem value="duration-short">Shortest First</SelectItem>
                <SelectItem value="duration-long">Longest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredMeditations.length === 0 ? (
          <div className="text-center py-16">
            {meditations.length === 0 ? (
              <>
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-plus text-primary text-xl"></i>
                </div>
                <h3 className="text-xl font-medium mb-2">No Meditations Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first personalized meditation to get started.
                </p>
                <Button>
                  <i className="fas fa-plus mr-2"></i>
                  Create Your First Meditation
                </Button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-search text-muted-foreground text-xl"></i>
                </div>
                <h3 className="text-xl font-medium mb-2">No Results Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters to find meditations.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeditations.map((meditation) => (
              <MeditationCard
                key={meditation.id}
                meditation={meditation}
                onDelete={handleDeleteMeditation}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
