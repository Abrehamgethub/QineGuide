import apiClient, {
  ApiResponse,
  RoadmapStage,
  Roadmap,
  Opportunity,
  UserProfile,
} from './client';

// ==================== Roadmap API ====================

export const roadmapApi = {
  /**
   * Generate a new career roadmap
   */
  generate: async (
    careerGoal: string,
    currentSkillLevel?: string,
    preferredLanguage?: string
  ): Promise<ApiResponse<{ roadmap: RoadmapStage[]; saved?: Roadmap }>> => {
    const response = await apiClient.post('/roadmap', {
      careerGoal,
      currentSkillLevel,
      preferredLanguage,
    });
    return response.data;
  },

  /**
   * Get user's saved roadmaps
   */
  getSaved: async (): Promise<ApiResponse<Roadmap[]>> => {
    const response = await apiClient.get('/roadmap');
    return response.data;
  },

  /**
   * Get a specific roadmap
   */
  getById: async (roadmapId: string): Promise<ApiResponse<Roadmap>> => {
    const response = await apiClient.get(`/roadmap/${roadmapId}`);
    return response.data;
  },

  /**
   * Delete a roadmap
   */
  delete: async (roadmapId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/roadmap/${roadmapId}`);
    return response.data;
  },
};

// ==================== Tutor/Explain API ====================

export const tutorApi = {
  /**
   * Explain a concept
   */
  explain: async (
    concept: string,
    language: 'en' | 'am' | 'om',
    context?: string
  ): Promise<ApiResponse<{ explanation: string; language: string }>> => {
    const response = await apiClient.post('/explain', {
      concept,
      language,
      context,
    });
    return response.data;
  },

  /**
   * Chat with AI tutor
   */
  chat: async (
    message: string,
    language?: 'en' | 'am' | 'om',
    historyId?: string
  ): Promise<ApiResponse<{ response: string; historyId?: string }>> => {
    const response = await apiClient.post('/explain/chat', {
      message,
      language,
      historyId,
    });
    return response.data;
  },

  /**
   * Get chat history
   */
  getHistory: async (historyId?: string): Promise<ApiResponse<unknown>> => {
    const url = historyId ? `/explain/history/${historyId}` : '/explain/history';
    const response = await apiClient.get(url);
    return response.data;
  },
};

// ==================== Opportunities API ====================

export const opportunitiesApi = {
  /**
   * Generate opportunity recommendations
   */
  generate: async (
    careerGoal: string,
    skillLevel?: string,
    category?: string
  ): Promise<ApiResponse<{ opportunities: Opportunity[]; careerGoal: string }>> => {
    const response = await apiClient.post('/opportunities', {
      careerGoal,
      skillLevel,
      category,
    });
    return response.data;
  },

  /**
   * Save/bookmark an opportunity
   */
  save: async (
    opportunity: Omit<Opportunity, 'id'>
  ): Promise<ApiResponse<Opportunity>> => {
    const response = await apiClient.post('/opportunities/save', opportunity);
    return response.data;
  },

  /**
   * Get saved opportunities
   */
  getSaved: async (): Promise<ApiResponse<Opportunity[]>> => {
    const response = await apiClient.get('/opportunities/saved');
    return response.data;
  },

  /**
   * Delete a saved opportunity
   */
  delete: async (opportunityId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/opportunities/${opportunityId}`);
    return response.data;
  },
};

// ==================== Skills Evaluation API ====================

export const skillsApi = {
  /**
   * Evaluate skills and get recommendations
   */
  evaluate: async (
    careerGoal: string,
    currentSkills: string[],
    experience?: string
  ): Promise<
    ApiResponse<{
      careerGoal: string;
      currentSkills: string[];
      assessment: string;
      skillGaps: string[];
      recommendations: string[];
    }>
  > => {
    const response = await apiClient.post('/skills-eval', {
      careerGoal,
      currentSkills,
      experience,
    });
    return response.data;
  },
};

// ==================== Profile API ====================

export const profileApi = {
  /**
   * Save/update user profile
   */
  save: async (
    profileData: Partial<Pick<UserProfile, 'name' | 'languagePreference' | 'careerGoals'>>
  ): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.post('/profile/save', profileData);
    return response.data;
  },

  /**
   * Get user profile with related data
   */
  get: async (): Promise<
    ApiResponse<{
      profile: UserProfile;
      roadmaps: Roadmap[];
      savedOpportunities: Opportunity[];
    }>
  > => {
    const response = await apiClient.get('/profile/get');
    return response.data;
  },

  /**
   * Update language preference
   */
  updateLanguage: async (
    languagePreference: 'en' | 'am' | 'om'
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.put('/profile/language', {
      languagePreference,
    });
    return response.data;
  },
};

export default {
  roadmap: roadmapApi,
  tutor: tutorApi,
  opportunities: opportunitiesApi,
  skills: skillsApi,
  profile: profileApi,
};
