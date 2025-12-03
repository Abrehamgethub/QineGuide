import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Validation schemas
export const schemas = {
  roadmap: z.object({
    careerGoal: z.string().min(2).max(200),
    currentSkillLevel: z.string().optional(),
    preferredLanguage: z.enum(['am', 'om', 'en']).optional(),
  }),

  explain: z.object({
    concept: z.string().min(2).max(500),
    language: z.enum(['am', 'om', 'en']),
    context: z.string().max(500).optional(),
  }),

  opportunities: z.object({
    careerGoal: z.string().min(2).max(200),
    skillLevel: z.string().optional(),
    category: z.string().optional(),
  }),

  skillsEval: z.object({
    careerGoal: z.string().min(2).max(200),
    currentSkills: z.array(z.string()).min(1).max(20),
    experience: z.string().max(1000).optional(),
  }),

  saveProfile: z.object({
    name: z.string().min(1).max(100).optional(),
    languagePreference: z.enum(['am', 'om', 'en']).optional(),
    careerGoals: z.array(z.string()).max(10).optional(),
  }),

  chat: z.object({
    message: z.string().min(1).max(2000),
    language: z.enum(['am', 'om', 'en']).optional(),
    historyId: z.string().optional(),
  }),

  saveOpportunity: z.object({
    title: z.string().min(1).max(200),
    provider: z.string().min(1).max(100),
    url: z.string().url(),
    category: z.string().min(1).max(50),
    skillLevel: z.string().min(1).max(50),
    description: z.string().max(500).optional(),
  }),
};

// Generic validation middleware factory
export const validate = <T extends keyof typeof schemas>(schemaName: T) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const schema = schemas[schemaName];
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors,
        });
        return;
      }
      next(error);
    }
  };
};

export default validate;
