import { Card, CardContent } from "@/components/ui/card";

interface MeditationType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  duration: string;
}

const meditationTypes: MeditationType[] = [
  {
    id: 'manifestation',
    name: 'Manifestation',
    description: 'Goal-specific statements and visualization',
    icon: 'fas fa-star',
    color: 'bg-gradient-to-r from-indigo-800 to-indigo-400',
    duration: '5-30 minutes'
  },
  {
    id: 'relaxation',
    name: 'Relaxation',
    description: 'Stress relief and deep calming techniques',
    icon: 'fas fa-leaf',
    color: 'bg-gradient-to-r from-cyan-800 to-cyan-400',
    duration: '5-30 minutes'
  },
  {
    id: 'sleep',
    name: 'Sleep',
    description: 'Bedtime stories and sleep-inducing practices',
    icon: 'fas fa-moon',
    color: 'bg-gradient-to-r from-purple-800 to-purple-400',
    duration: '10-60 minutes'
  },
  {
    id: 'visualization',
    name: 'Visualization',
    description: 'Guided imagery and mental rehearsal',
    icon: 'fas fa-eye',
    color: 'bg-gradient-to-r from-green-800 to-green-400',
    duration: '10-25 minutes'
  },
  {
    id: 'affirmations',
    name: 'Affirmations',
    description: 'Positive self-talk and confidence building',
    icon: 'fas fa-heart',
    color: 'bg-gradient-to-r from-orange-500 to-yellow-400',
    duration: '5-20 minutes'
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    description: 'Present moment awareness and breathing',
    icon: 'fas fa-spa',
    color: 'bg-gradient-to-r from-red-500 to-pink-400',
    duration: '5-30 minutes'
  }
];

interface TypeSelectorProps {
  selectedType: string | null;
  onTypeSelect: (type: string) => void;
}

export function TypeSelector({ selectedType, onTypeSelect }: TypeSelectorProps) {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light mb-4">Choose Your Journey</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Select the type of meditation that resonates with your current needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {meditationTypes.map((type) => (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                selectedType === type.id 
                  ? 'ring-2 ring-primary bg-primary/10' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => onTypeSelect(type.id)}
              data-testid={`card-meditation-type-${type.id}`}
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-full ${type.color} flex items-center justify-center mb-4`}>
                  <i className={`${type.icon} text-white`}></i>
                </div>
                <h3 className="text-xl font-medium mb-2">{type.name}</h3>
                <p className="text-muted-foreground mb-4">{type.description}</p>
                <div className="text-sm text-primary font-medium">{type.duration}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
