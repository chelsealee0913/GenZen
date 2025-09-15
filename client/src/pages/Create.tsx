import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { TypeSelector } from "@/components/meditation/TypeSelector";
import { PersonalizationForm } from "@/components/meditation/PersonalizationForm";
import { GenerationProgress } from "@/components/meditation/GenerationProgress";
import { MeditationPlayer } from "@/components/meditation/MeditationPlayer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Meditation } from "@shared/schema";

export default function Create() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState('analyzing');
  const [generatedMeditation, setGeneratedMeditation] = useState<Meditation | null>(null);
  const { firebaseUser } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Check for type parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = urlParams.get('type');
    if (typeParam) {
      setSelectedType(typeParam);
    }
  }, []);

  const handleGenerateMeditation = async (settings: any) => {
    if (!firebaseUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create meditations",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationStage('analyzing');

    try {
      // Simulate progress stages
      const stages = [
        { stage: 'analyzing', duration: 1000 },
        { stage: 'generating', duration: 3000 },
        { stage: 'synthesizing', duration: 2000 },
        { stage: 'preparing', duration: 1000 },
      ];

      let currentProgress = 0;
      const progressIncrement = 100 / stages.length;

      for (const { stage, duration } of stages) {
        setGenerationStage(stage);
        
        // Animate progress for this stage
        const startProgress = currentProgress;
        const endProgress = currentProgress + progressIncrement;
        const stepSize = (endProgress - startProgress) / (duration / 100);
        
        for (let i = 0; i < duration / 100; i++) {
          await new Promise(resolve => setTimeout(resolve, 100));
          currentProgress = Math.min(endProgress, startProgress + (stepSize * (i + 1)));
          setGenerationProgress(currentProgress);
        }
      }

      // Generate the actual meditation
      const token = await firebaseUser.getIdToken();
      const response = await fetch('/api/meditation/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: selectedType,
          duration: settings.duration,
          settings: {
            voice: settings.voice,
            background: settings.background,
            visual: settings.visual,
          },
          customization: settings.customization,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate meditation');
      }

      const meditation = await response.json();
      setGeneratedMeditation(meditation);
      
      toast({
        title: "Meditation created!",
        description: "Your personalized meditation is ready to play",
      });

    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClosePlayer = () => {
    setGeneratedMeditation(null);
    // Navigate to library to see the saved meditation
    setLocation('/library');
  };

  if (generatedMeditation) {
    return (
      <MeditationPlayer 
        meditation={generatedMeditation} 
        onClose={handleClosePlayer}
      />
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <GenerationProgress 
        isVisible={isGenerating}
        progress={generationProgress}
        stage={generationStage}
      />

      {!selectedType ? (
        <TypeSelector 
          selectedType={selectedType}
          onTypeSelect={setSelectedType}
        />
      ) : (
        <PersonalizationForm
          selectedType={selectedType}
          onGenerate={handleGenerateMeditation}
          loading={isGenerating}
        />
      )}

      {selectedType && (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <button
              onClick={() => setSelectedType(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-back-to-types"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to meditation types
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
