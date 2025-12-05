import { getFirestore } from '../config/firebase';
import { v4 as uuidv4 } from 'uuid';
import { logger } from './logger';
import {
  UserProfile,
  Roadmap,
  RoadmapStage,
  Opportunity,
  ChatHistory,
  ChatMessage,
  Language,
} from '../types';

// Collection paths
const COLLECTIONS = {
  users: 'users',
  profile: 'profile',
  roadmaps: 'roadmaps',
  history: 'history',
  opportunities: 'opportunities',
};

class FirestoreService {
  // ==================== User Profile ====================

  /**
   * Create or update user profile
   */
  async upsertUserProfile(
    uid: string,
    data: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>
  ): Promise<UserProfile> {
    const db = getFirestore();
    const profileRef = db
      .collection(COLLECTIONS.users)
      .doc(uid)
      .collection(COLLECTIONS.profile)
      .doc('main');

    const existing = await profileRef.get();
    const now = new Date();

    if (existing.exists) {
      // Update existing profile
      await profileRef.update({
        ...data,
        updatedAt: now,
      });
      const updated = await profileRef.get();
      return { uid, ...updated.data() } as UserProfile;
    } else {
      // Create new profile
      const newProfile: Omit<UserProfile, 'uid'> = {
        name: data.name || '',
        email: data.email || '',
        languagePreference: data.languagePreference || 'en',
        createdAt: now,
        updatedAt: now,
        careerGoals: data.careerGoals || [],
        completedStages: data.completedStages || [],
      };
      await profileRef.set(newProfile);
      return { uid, ...newProfile };
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const db = getFirestore();
    const profileRef = db
      .collection(COLLECTIONS.users)
      .doc(uid)
      .collection(COLLECTIONS.profile)
      .doc('main');

    const doc = await profileRef.get();
    if (!doc.exists) {
      return null;
    }
    return { uid, ...doc.data() } as UserProfile;
  }

  // ==================== Roadmaps ====================

  /**
   * Save a roadmap for a user
   */
  async saveRoadmap(
    uid: string,
    careerGoal: string,
    stages: RoadmapStage[]
  ): Promise<Roadmap> {
    const db = getFirestore();
    const roadmapId = uuidv4();
    const now = new Date();

    const roadmap: Roadmap = {
      id: roadmapId,
      userId: uid,
      careerGoal,
      stages,
      createdAt: now,
      updatedAt: now,
    };

    await db
      .collection(COLLECTIONS.users)
      .doc(uid)
      .collection(COLLECTIONS.roadmaps)
      .doc(roadmapId)
      .set(roadmap);

    logger.info(`Saved roadmap ${roadmapId} for user ${uid}`);
    return roadmap;
  }

  /**
   * Get all roadmaps for a user
   */
  async getUserRoadmaps(uid: string): Promise<Roadmap[]> {
    const db = getFirestore();
    const snapshot = await db
      .collection(COLLECTIONS.users)
      .doc(uid)
      .collection(COLLECTIONS.roadmaps)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => doc.data() as Roadmap);
  }

  /**
   * Get a specific roadmap
   */
  async getRoadmap(uid: string, roadmapId: string): Promise<Roadmap | null> {
    const db = getFirestore();
    const doc = await db
      .collection(COLLECTIONS.users)
      .doc(uid)
      .collection(COLLECTIONS.roadmaps)
      .doc(roadmapId)
      .get();

    if (!doc.exists) {
      return null;
    }
    return doc.data() as Roadmap;
  }

  /**
   * Delete a roadmap
   */
  async deleteRoadmap(uid: string, roadmapId: string): Promise<void> {
    const db = getFirestore();
    await db
      .collection(COLLECTIONS.users)
      .doc(uid)
      .collection(COLLECTIONS.roadmaps)
      .doc(roadmapId)
      .delete();

    logger.info(`Deleted roadmap ${roadmapId} for user ${uid}`);
  }

  // ==================== Chat History ====================

  /**
   * Save chat message to history
   */
  async saveChatMessage(
    uid: string,
    historyId: string,
    message: Omit<ChatMessage, 'id' | 'timestamp'>
  ): Promise<ChatMessage> {
    const db = getFirestore();
    const historyRef = db
      .collection(COLLECTIONS.users)
      .doc(uid)
      .collection(COLLECTIONS.history)
      .doc(historyId);

    const newMessage: ChatMessage = {
      id: uuidv4(),
      ...message,
      timestamp: new Date(),
    };

    const existing = await historyRef.get();
    if (existing.exists) {
      const data = existing.data() as ChatHistory;
      await historyRef.update({
        messages: [...data.messages, newMessage],
        updatedAt: new Date(),
      });
    } else {
      const newHistory: ChatHistory = {
        id: historyId,
        userId: uid,
        messages: [newMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await historyRef.set(newHistory);
    }

    return newMessage;
  }

  /**
   * Get chat history
   */
  async getChatHistory(uid: string, historyId: string): Promise<ChatHistory | null> {
    const db = getFirestore();
    const doc = await db
      .collection(COLLECTIONS.users)
      .doc(uid)
      .collection(COLLECTIONS.history)
      .doc(historyId)
      .get();

    if (!doc.exists) {
      return null;
    }
    return doc.data() as ChatHistory;
  }

  /**
   * Get all chat histories for a user
   */
  async getAllChatHistories(uid: string): Promise<ChatHistory[]> {
    const db = getFirestore();
    const snapshot = await db
      .collection(COLLECTIONS.users)
      .doc(uid)
      .collection(COLLECTIONS.history)
      .orderBy('updatedAt', 'desc')
      .limit(20)
      .get();

    return snapshot.docs.map((doc) => doc.data() as ChatHistory);
  }

  // ==================== Opportunities ====================

  /**
   * Save bookmarked opportunities for a user
   */
  async saveOpportunity(
    uid: string,
    opportunity: Omit<Opportunity, 'id' | 'createdAt'>
  ): Promise<Opportunity> {
    const db = getFirestore();
    const opportunityId = uuidv4();
    const now = new Date();

    const savedOpportunity: Opportunity = {
      id: opportunityId,
      ...opportunity,
      createdAt: now,
    };

    await db
      .collection(COLLECTIONS.users)
      .doc(uid)
      .collection(COLLECTIONS.opportunities)
      .doc(opportunityId)
      .set(savedOpportunity);

    logger.info(`Saved opportunity ${opportunityId} for user ${uid}`);
    return savedOpportunity;
  }

  /**
   * Get saved opportunities for a user
   */
  async getUserOpportunities(uid: string): Promise<Opportunity[]> {
    const db = getFirestore();
    const snapshot = await db
      .collection(COLLECTIONS.users)
      .doc(uid)
      .collection(COLLECTIONS.opportunities)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => doc.data() as Opportunity);
  }

  /**
   * Delete a saved opportunity
   */
  async deleteOpportunity(uid: string, opportunityId: string): Promise<void> {
    const db = getFirestore();
    await db
      .collection(COLLECTIONS.users)
      .doc(uid)
      .collection(COLLECTIONS.opportunities)
      .doc(opportunityId)
      .delete();

    logger.info(`Deleted opportunity ${opportunityId} for user ${uid}`);
  }

  // ==================== Language Preference ====================

  /**
   * Update user language preference
   */
  async updateLanguagePreference(uid: string, language: Language): Promise<void> {
    await this.upsertUserProfile(uid, { languagePreference: language });
    logger.info(`Updated language preference to ${language} for user ${uid}`);
  }

  // ==================== Career Goal Data ====================

  /**
   * Save career goal and roadmap data to /users/{uid}/careerGoal/data
   */
  async saveCareerGoalData(uid: string, data: {
    careerGoal: string;
    stages: RoadmapStage[];
    skillLevel: string;
    language?: Language;
    updatedAt: Date;
  }): Promise<void> {
    const db = getFirestore();
    const careerGoalRef = db
      .collection(COLLECTIONS.users)
      .doc(uid)
      .collection('careerGoal')
      .doc('data');

    await careerGoalRef.set({
      ...data,
      createdAt: new Date(),
    }, { merge: true });

    logger.info(`Saved career goal data for user ${uid}: ${data.careerGoal}`);
  }

  /**
   * Get career goal data for a user
   */
  async getCareerGoalData(uid: string): Promise<{
    careerGoal: string;
    stages: RoadmapStage[];
    skillLevel: string;
    language?: Language;
    updatedAt: Date;
  } | null> {
    const db = getFirestore();
    const doc = await db
      .collection(COLLECTIONS.users)
      .doc(uid)
      .collection('careerGoal')
      .doc('data')
      .get();

    if (!doc.exists) {
      return null;
    }

    return doc.data() as {
      careerGoal: string;
      stages: RoadmapStage[];
      skillLevel: string;
      language?: Language;
      updatedAt: Date;
    };
  }
}

// Export singleton instance
export const firestoreService = new FirestoreService();
export default firestoreService;
