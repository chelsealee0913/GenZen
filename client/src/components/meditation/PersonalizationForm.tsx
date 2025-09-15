import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PersonalizationSettings {
  voice: 'male' | 'female';
  duration: number;
  background: string;
  visual: string;
  customization?: {
    goals?: string;
    timeline?: string;
    category?: string;
    currentSituation?: string;
  };
}

interface PersonalizationFormProps {
  selectedType: string;
  onGenerate: (settings: PersonalizationSettings) => void;
  loading?: boolean;
}

const backgroundSounds = [
  { value: 'ocean_waves', label: 'Ocean Waves' },
  { value: 'forest_sounds', label: 'Forest Sounds' },
  { value: 'rain', label: 'Rain' },
  { value: 'white_noise', label: 'White Noise' },
  { value: 'ambient_music', label: 'Ambient Music' },
  { value: 'silence', label: 'Silence' },
];

const visualEnvironments = [
  { value: 'beach', src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop' },
  { value: 'mountains', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop' },
  { value: 'forest', src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop' },
];

const durations = [5, 10, 15, 20, 30];

export function PersonalizationForm({ selectedType, onGenerate, loading }: PersonalizationFormProps) {
  const [settings, setSettings] = useState<PersonalizationSettings>({
    voice: 'female',
    duration: 10,
    background: 'ocean_waves',
    visual: 'beach',
    customization: {},
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(settings);
  };

  const updateCustomization = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      customization: {
        ...prev.customization,
        [field]: value,
      },
    }));
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light mb-4">Personalize Your Experience</h2>
          <p className="text-muted-foreground text-lg">
            Customize every aspect of your meditation to match your preferences
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Voice Selection */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Voice Preference</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={settings.voice === 'male' ? 'default' : 'outline'}
                      className="p-4 h-auto justify-start"
                      onClick={() => setSettings(prev => ({ ...prev, voice: 'male' }))}
                      data-testid="button-voice-male"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-user text-primary"></i>
                          <span>Male Voice</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">Deep, calming tone</div>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      variant={settings.voice === 'female' ? 'default' : 'outline'}
                      className="p-4 h-auto justify-start"
                      onClick={() => setSettings(prev => ({ ...prev, voice: 'female' }))}
                      data-testid="button-voice-female"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-user text-primary"></i>
                          <span>Female Voice</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">Gentle, soothing tone</div>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Duration Selection */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Duration</Label>
                  <div className="flex flex-wrap gap-2">
                    {durations.map((duration) => (
                      <Button
                        key={duration}
                        type="button"
                        variant={settings.duration === duration ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSettings(prev => ({ ...prev, duration }))}
                        data-testid={`button-duration-${duration}`}
                      >
                        {duration} min
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Background Sound */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Background Sound</Label>
                  <Select 
                    value={settings.background} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, background: value }))}
                  >
                    <SelectTrigger data-testid="select-background-sound">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {backgroundSounds.map((sound) => (
                        <SelectItem key={sound.value} value={sound.value}>
                          {sound.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Visual Environment */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Visual Environment</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {visualEnvironments.map((env) => (
                      <button
                        key={env.value}
                        type="button"
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                          settings.visual === env.value 
                            ? 'border-primary' 
                            : 'border-border hover:border-primary'
                        }`}
                        onClick={() => setSettings(prev => ({ ...prev, visual: env.value }))}
                        data-testid={`button-visual-${env.value}`}
                      >
                        <img 
                          src={env.src} 
                          alt={env.value} 
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Custom Goals (for Manifestation type) */}
              {selectedType === 'manifestation' && (
                <div className="p-6 bg-secondary/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Manifestation Goals</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="goals">What do you want to manifest?</Label>
                      <Textarea
                        id="goals"
                        rows={3}
                        placeholder="Describe your goals and aspirations..."
                        value={settings.customization?.goals || ''}
                        onChange={(e) => updateCustomization('goals', e.target.value)}
                        data-testid="textarea-goals"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="timeline">Timeline</Label>
                        <Input
                          id="timeline"
                          placeholder="e.g., 6 months"
                          value={settings.customization?.timeline || ''}
                          onChange={(e) => updateCustomization('timeline', e.target.value)}
                          data-testid="input-timeline"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          value={settings.customization?.category || ''} 
                          onValueChange={(value) => updateCustomization('category', value)}
                        >
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="personal">Personal</SelectItem>
                            <SelectItem value="financial">Financial</SelectItem>
                            <SelectItem value="career">Career</SelectItem>
                            <SelectItem value="relationships">Relationships</SelectItem>
                            <SelectItem value="health">Health</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={loading}
                  className="px-8"
                  data-testid="button-generate-meditation"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Generating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-wand-magic-sparkles mr-2"></i>
                      Generate My Meditation
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
