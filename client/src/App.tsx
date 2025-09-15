import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { MeditationProvider } from "@/contexts/MeditationContext";
import { Header } from "@/components/layout/Header";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { FloatingPlayer } from "@/components/layout/FloatingPlayer";

import Home from "@/pages/Home";
import Create from "@/pages/Create";
import Library from "@/pages/Library";
import Community from "@/pages/Community";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <>
      <Header />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/create" component={Create} />
          <Route path="/library" component={Library} />
          <Route path="/community" component={Community} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <MobileNavigation />
      <FloatingPlayer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <MeditationProvider>
            <Toaster />
            <Router />
          </MeditationProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
