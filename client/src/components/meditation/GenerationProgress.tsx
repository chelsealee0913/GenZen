import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface GenerationProgressProps {
  isVisible: boolean;
  progress: number;
  stage: string;
}

const stages = [
  { id: 'analyzing', label: 'Analyzing your preferences', icon: 'fas fa-brain' },
  { id: 'generating', label: 'Crafting your meditation script', icon: 'fas fa-pen-fancy' },
  { id: 'synthesizing', label: 'Creating voice narration', icon: 'fas fa-microphone' },
  { id: 'preparing', label: 'Preparing your experience', icon: 'fas fa-sparkles' },
];

export function GenerationProgress({ isVisible, progress, stage }: GenerationProgressProps) {
  if (!isVisible) return null;

  const currentStage = stages.find(s => s.id === stage) || stages[0];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <i className={`${currentStage.icon} text-white text-xl`}></i>
          </div>
          
          <h3 className="text-xl font-medium mb-2">Creating Your Meditation</h3>
          <p className="text-muted-foreground mb-6">{currentStage.label}</p>
          
          <Progress value={progress} className="mb-4" />
          
          <div className="text-sm text-muted-foreground">
            {Math.round(progress)}% complete
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
