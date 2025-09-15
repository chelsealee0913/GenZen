import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertMeditationSchema, insertCommunityMeditationSchema, insertMeditationRatingSchema } from "@shared/schema";
import { generateMeditationScript } from "./services/openai";
import { verifyFirebaseToken } from "./services/firebase";

// Middleware to verify Firebase token
async function authenticateUser(req: any, res: any, next: any) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    const firebaseUser = await verifyFirebaseToken(token);
    
    let user = await storage.getUserByFirebaseUid(firebaseUser.uid);
    if (!user) {
      // Create user if doesn't exist
      user = await storage.createUser({
        email: firebaseUser.email!,
        name: firebaseUser.name || firebaseUser.email!,
        authProvider: 'firebase',
        firebaseUid: firebaseUser.uid,
        preferences: {},
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.get('/api/auth/user', authenticateUser, async (req: any, res) => {
    res.json(req.user);
  });

  app.put('/api/auth/preferences', authenticateUser, async (req: any, res) => {
    try {
      const user = await storage.updateUserPreferences(req.user.id, req.body.preferences);
      res.json(user);
    } catch (error) {
      console.error('Update preferences error:', error);
      res.status(500).json({ error: 'Failed to update preferences' });
    }
  });

  // Meditation generation
  app.post('/api/meditation/generate', authenticateUser, async (req: any, res) => {
    try {
      const { type, duration, customization, settings } = req.body;
      
      if (!type || !duration) {
        return res.status(400).json({ error: 'Type and duration are required' });
      }

      // Generate meditation script using OpenAI
      const script = await generateMeditationScript({
        type,
        duration,
        customization: customization || {},
        userPreferences: req.user.preferences,
      });

      // Create meditation record
      const meditation = await storage.createMeditation({
        userId: req.user.id,
        type,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Meditation`,
        description: customization?.goals || `A personalized ${type} meditation`,
        duration,
        script,
        settings: settings || {
          voice: 'female',
          background: 'ocean_waves',
          visual: 'beach',
        },
        customization,
      });

      res.json(meditation);
    } catch (error) {
      console.error('Generate meditation error:', error);
      res.status(500).json({ error: 'Failed to generate meditation' });
    }
  });

  // Library management
  app.get('/api/library/meditations', authenticateUser, async (req: any, res) => {
    try {
      const meditations = await storage.getUserMeditations(req.user.id);
      res.json(meditations);
    } catch (error) {
      console.error('Get meditations error:', error);
      res.status(500).json({ error: 'Failed to get meditations' });
    }
  });

  app.get('/api/library/meditation/:id', authenticateUser, async (req: any, res) => {
    try {
      const meditation = await storage.getMeditation(req.params.id);
      if (!meditation) {
        return res.status(404).json({ error: 'Meditation not found' });
      }
      
      // Check if user owns the meditation
      if (meditation.userId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      res.json(meditation);
    } catch (error) {
      console.error('Get meditation error:', error);
      res.status(500).json({ error: 'Failed to get meditation' });
    }
  });

  app.post('/api/library/meditation/:id/play', authenticateUser, async (req: any, res) => {
    try {
      const meditation = await storage.getMeditation(req.params.id);
      if (!meditation) {
        return res.status(404).json({ error: 'Meditation not found' });
      }
      
      if (meditation.userId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      await storage.incrementPlayCount(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Play meditation error:', error);
      res.status(500).json({ error: 'Failed to track play' });
    }
  });

  app.put('/api/library/meditation/:id/favorite', authenticateUser, async (req: any, res) => {
    try {
      const { isFavorite } = req.body;
      const meditation = await storage.getMeditation(req.params.id);
      
      if (!meditation) {
        return res.status(404).json({ error: 'Meditation not found' });
      }
      
      if (meditation.userId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      const updatedMeditation = await storage.toggleFavorite(req.params.id, isFavorite);
      res.json(updatedMeditation);
    } catch (error) {
      console.error('Toggle favorite error:', error);
      res.status(500).json({ error: 'Failed to toggle favorite' });
    }
  });

  app.delete('/api/library/meditation/:id', authenticateUser, async (req: any, res) => {
    try {
      const meditation = await storage.getMeditation(req.params.id);
      if (!meditation) {
        return res.status(404).json({ error: 'Meditation not found' });
      }
      
      if (meditation.userId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      await storage.deleteMeditation(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Delete meditation error:', error);
      res.status(500).json({ error: 'Failed to delete meditation' });
    }
  });

  // Community features
  app.get('/api/community/meditations', async (req, res) => {
    try {
      const meditations = await storage.getCommunityMeditations();
      res.json(meditations);
    } catch (error) {
      console.error('Get community meditations error:', error);
      res.status(500).json({ error: 'Failed to get community meditations' });
    }
  });

  app.get('/api/community/popular', async (req, res) => {
    try {
      const meditations = await storage.getPopularMeditations();
      res.json(meditations);
    } catch (error) {
      console.error('Get popular meditations error:', error);
      res.status(500).json({ error: 'Failed to get popular meditations' });
    }
  });

  app.post('/api/community/share/:id', authenticateUser, async (req: any, res) => {
    try {
      const meditation = await storage.getMeditation(req.params.id);
      if (!meditation) {
        return res.status(404).json({ error: 'Meditation not found' });
      }
      
      if (meditation.userId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      const { title, description } = req.body;
      
      const sharedMeditation = await storage.shareMeditation({
        originalMeditationId: req.params.id,
        title: title || meditation.title,
        description: description || meditation.description,
        type: meditation.type,
        duration: meditation.duration,
      });
      
      res.json(sharedMeditation);
    } catch (error) {
      console.error('Share meditation error:', error);
      res.status(500).json({ error: 'Failed to share meditation' });
    }
  });

  app.post('/api/community/rate/:id', authenticateUser, async (req: any, res) => {
    try {
      const { rating } = req.body;
      
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }
      
      await storage.rateMeditation({
        userId: req.user.id,
        communityMeditationId: req.params.id,
        rating,
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error('Rate meditation error:', error);
      res.status(500).json({ error: 'Failed to rate meditation' });
    }
  });

  app.post('/api/community/meditation/:id/play', async (req, res) => {
    try {
      // For community meditations, we need to increment the play count
      await storage.incrementPlayCount(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Play community meditation error:', error);
      res.status(500).json({ error: 'Failed to track play' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
