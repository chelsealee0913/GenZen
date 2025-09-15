import {
  users,
  meditations,
  communityMeditations,
  meditationRatings,
  type User,
  type InsertUser,
  type Meditation,
  type InsertMeditation,
  type CommunityMeditation,
  type InsertCommunityMeditation,
  type MeditationRating,
  type InsertMeditationRating,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPreferences(userId: string, preferences: any): Promise<User>;

  // Meditation operations
  getMeditation(id: string): Promise<Meditation | undefined>;
  getUserMeditations(userId: string): Promise<Meditation[]>;
  createMeditation(meditation: InsertMeditation): Promise<Meditation>;
  updateMeditation(id: string, updates: Partial<Meditation>): Promise<Meditation>;
  deleteMeditation(id: string): Promise<void>;
  incrementPlayCount(id: string): Promise<void>;
  toggleFavorite(id: string, isFavorite: boolean): Promise<Meditation>;

  // Community operations
  getCommunityMeditations(): Promise<CommunityMeditation[]>;
  getPopularMeditations(): Promise<CommunityMeditation[]>;
  shareMeditation(meditation: InsertCommunityMeditation): Promise<CommunityMeditation>;
  rateMeditation(rating: InsertMeditationRating): Promise<void>;
  getUserRating(userId: string, communityMeditationId: string): Promise<MeditationRating | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserPreferences(userId: string, preferences: any): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ preferences })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getMeditation(id: string): Promise<Meditation | undefined> {
    const [meditation] = await db.select().from(meditations).where(eq(meditations.id, id));
    return meditation || undefined;
  }

  async getUserMeditations(userId: string): Promise<Meditation[]> {
    return await db
      .select()
      .from(meditations)
      .where(eq(meditations.userId, userId))
      .orderBy(desc(meditations.createdAt));
  }

  async createMeditation(meditation: InsertMeditation): Promise<Meditation> {
    const [newMeditation] = await db.insert(meditations).values(meditation).returning();
    
    // Increment user meditation count
    await db
      .update(users)
      .set({ meditationCount: sql`${users.meditationCount} + 1` })
      .where(eq(users.id, meditation.userId));
    
    return newMeditation;
  }

  async updateMeditation(id: string, updates: Partial<Meditation>): Promise<Meditation> {
    const [meditation] = await db
      .update(meditations)
      .set(updates)
      .where(eq(meditations.id, id))
      .returning();
    return meditation;
  }

  async deleteMeditation(id: string): Promise<void> {
    const [meditation] = await db.select().from(meditations).where(eq(meditations.id, id));
    if (meditation) {
      await db.delete(meditations).where(eq(meditations.id, id));
      
      // Decrement user meditation count
      await db
        .update(users)
        .set({ meditationCount: sql`${users.meditationCount} - 1` })
        .where(eq(users.id, meditation.userId));
    }
  }

  async incrementPlayCount(id: string): Promise<void> {
    await db
      .update(meditations)
      .set({ playCount: sql`${meditations.playCount} + 1` })
      .where(eq(meditations.id, id));
  }

  async toggleFavorite(id: string, isFavorite: boolean): Promise<Meditation> {
    const [meditation] = await db
      .update(meditations)
      .set({ isFavorite })
      .where(eq(meditations.id, id))
      .returning();
    return meditation;
  }

  async getCommunityMeditations(): Promise<CommunityMeditation[]> {
    return await db
      .select()
      .from(communityMeditations)
      .orderBy(desc(communityMeditations.createdAt))
      .limit(20);
  }

  async getPopularMeditations(): Promise<CommunityMeditation[]> {
    return await db
      .select()
      .from(communityMeditations)
      .orderBy(desc(communityMeditations.playCount))
      .limit(10);
  }

  async shareMeditation(communityMeditation: InsertCommunityMeditation): Promise<CommunityMeditation> {
    const [sharedMeditation] = await db.insert(communityMeditations).values(communityMeditation).returning();
    
    // Mark original meditation as shared
    await db
      .update(meditations)
      .set({ isShared: true })
      .where(eq(meditations.id, communityMeditation.originalMeditationId));
    
    return sharedMeditation;
  }

  async rateMeditation(rating: InsertMeditationRating): Promise<void> {
    // Check if user already rated this meditation
    const existingRating = await this.getUserRating(rating.userId, rating.communityMeditationId);
    
    if (existingRating) {
      // Update existing rating
      await db
        .update(meditationRatings)
        .set({ rating: rating.rating })
        .where(eq(meditationRatings.id, existingRating.id));
    } else {
      // Create new rating
      await db.insert(meditationRatings).values(rating);
      
      // Increment rating count
      await db
        .update(communityMeditations)
        .set({ ratingCount: sql`${communityMeditations.ratingCount} + 1` })
        .where(eq(communityMeditations.id, rating.communityMeditationId));
    }
    
    // Recalculate average rating
    const ratings = await db
      .select()
      .from(meditationRatings)
      .where(eq(meditationRatings.communityMeditationId, rating.communityMeditationId));
    
    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    
    await db
      .update(communityMeditations)
      .set({ rating: Math.round(averageRating * 10) / 10 })
      .where(eq(communityMeditations.id, rating.communityMeditationId));
  }

  async getUserRating(userId: string, communityMeditationId: string): Promise<MeditationRating | undefined> {
    const [rating] = await db
      .select()
      .from(meditationRatings)
      .where(
        and(
          eq(meditationRatings.userId, userId),
          eq(meditationRatings.communityMeditationId, communityMeditationId)
        )
      );
    return rating || undefined;
  }
}

export const storage = new DatabaseStorage();
