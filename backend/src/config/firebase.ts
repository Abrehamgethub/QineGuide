import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';
import { config } from './index';
import { logger } from '../services/logger';

let firebaseApp: admin.app.App | null = null;

export const initializeFirebase = (): admin.app.App => {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    let credential: admin.credential.Credential;

    if (config.firebase.serviceAccountBase64) {
      // Decode base64 service account for Cloud Run
      const serviceAccountJson = Buffer.from(
        config.firebase.serviceAccountBase64,
        'base64'
      ).toString('utf-8');
      const serviceAccount = JSON.parse(serviceAccountJson);
      credential = admin.credential.cert(serviceAccount);
      logger.info('Firebase initialized with base64 service account');
    } else if (config.firebase.serviceAccountPath) {
      // Use file path for local development
      const absolutePath = path.resolve(process.cwd(), config.firebase.serviceAccountPath);
      const serviceAccountJson = fs.readFileSync(absolutePath, 'utf-8');
      const serviceAccount = JSON.parse(serviceAccountJson);
      credential = admin.credential.cert(serviceAccount);
      logger.info('Firebase initialized with service account file:', absolutePath);
    } else {
      // Use default credentials (for GCP environments)
      credential = admin.credential.applicationDefault();
      logger.info('Firebase initialized with default credentials');
    }

    firebaseApp = admin.initializeApp({
      credential,
      projectId: config.firebase.projectId,
    });

    logger.info('Firebase Admin SDK initialized successfully');
    return firebaseApp;
  } catch (error) {
    logger.error('Failed to initialize Firebase:', error);
    throw error;
  }
};

export const getFirestore = (): admin.firestore.Firestore => {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return admin.firestore();
};

export const getAuth = (): admin.auth.Auth => {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return admin.auth();
};

export default {
  initializeFirebase,
  getFirestore,
  getAuth,
};
