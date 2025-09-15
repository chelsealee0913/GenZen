import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { TypeSelector } from "@/components/meditation/TypeSelector";
import { CommunitySection } from "@/components/community/CommunitySection";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')" 
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight">
            Find Your Inner Peace
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
            AI-powered personalized meditations crafted just for you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-medium"
                data-testid="button-start-meditating"
              >
                Start Meditating
              </Button>
            </Link>
            <Button 
              variant="secondary"
              size="lg"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white px-8 py-4 text-lg font-medium hover:bg-white/20"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Meditation Types Section */}
      <TypeSelector 
        selectedType={null} 
        onTypeSelect={(type) => {
          // Navigate to create page with selected type
          window.location.href = `/create?type=${type}`;
        }} 
      />

      {/* Features Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light mb-4">Why Choose GenZen?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the power of AI-personalized meditation designed just for you. Enjoy a seamless, immersive journey with our unique features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-brain text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-medium mb-3">AI-Powered Personalization</h3>
              <p className="text-muted-foreground">Every meditation is uniquely crafted based on your goals, mood, and preferences using advanced AI technology.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-microphone text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-medium mb-3">Natural Voice Synthesis</h3>
              <p className="text-muted-foreground">High-quality text-to-speech creates soothing, natural-sounding guidance that feels personal and calming.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-palette text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-medium mb-3">Immersive Environments</h3>
              <p className="text-muted-foreground">Beautiful visuals and ambient sounds create the perfect atmosphere for your meditation practice.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clock text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-medium mb-3">Flexible Duration</h3>
              <p className="text-muted-foreground">From quick 5-minute sessions to deep 60-minute journeys, meditate according to your schedule.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-medium mb-3">Community Sharing</h3>
              <p className="text-muted-foreground">Discover and share meaningful meditations with a supportive community of mindful practitioners.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-line text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-medium mb-3">Progress Tracking</h3>
              <p className="text-muted-foreground">Monitor your meditation journey with insights about your practice patterns and personal growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Preview */}
      <CommunitySection />
    </div>
  );
}
