# TenaAI Deployment Guide

This guide covers deploying TenaAI to Google Cloud Platform (GCP).

## Prerequisites

1. **Google Cloud Account** with billing enabled
2. **Firebase Project** created and configured
3. **gcloud CLI** installed and authenticated
4. **Firebase CLI** installed (`npm install -g firebase-tools`)
5. **Node.js 20+** installed locally

## Environment Setup

### 1. Create GCP Project & Enable APIs

```bash
# Set your project ID
export PROJECT_ID=your-project-id

# Create project (if not exists)
gcloud projects create $PROJECT_ID

# Set as active project
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  secretmanager.googleapis.com \
  firestore.googleapis.com \
  firebase.googleapis.com
```

### 2. Configure Firebase

```bash
# Login to Firebase
firebase login

# Initialize Firebase in frontend directory
cd frontend
firebase init hosting

# Select your project and configure:
# - Public directory: dist
# - Single-page app: Yes
# - Overwrite index.html: No
```

### 3. Set Up Secrets

```bash
# Create Gemini API key secret
echo -n "your-gemini-api-key" | \
  gcloud secrets create gemini-api-key --data-file=-

# Create Firebase service account secret (base64 encoded)
base64 -i path/to/service-account.json | \
  gcloud secrets create firebase-service-account --data-file=-

# Grant Cloud Run access to secrets
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:$PROJECT_ID-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding firebase-service-account \
  --member="serviceAccount:$PROJECT_ID-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## Backend Deployment (Cloud Run)

### Option 1: Using gcloud builds submit

```bash
cd backend

# Build and push to Container Registry
gcloud builds submit --tag gcr.io/$PROJECT_ID/tenaai-backend

# Deploy to Cloud Run
gcloud run deploy tenaai-backend \
  --image gcr.io/$PROJECT_ID/tenaai-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,CORS_ORIGIN=https://your-project.web.app" \
  --set-secrets "GEMINI_API_KEY=gemini-api-key:latest,FIREBASE_SERVICE_ACCOUNT_BASE64=firebase-service-account:latest" \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300
```

### Option 2: Using Cloud Run YAML

```bash
# Update cloudrun-deploy.yaml with your project ID and settings
# Then apply:
gcloud run services replace infrastructure/cloudrun-deploy.yaml --region us-central1
```

### Get Backend URL

```bash
# Get the deployed URL
gcloud run services describe tenaai-backend --region us-central1 --format="value(status.url)"
```

## Frontend Deployment (Firebase Hosting)

### 1. Configure Environment

Create `.env` file in frontend directory:

```env
VITE_API_URL=https://tenaai-backend-xxxxx-uc.a.run.app/api
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 2. Build and Deploy

```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## Firestore Setup

### Security Rules

Create `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Deploy rules:

```bash
firebase deploy --only firestore:rules
```

### Indexes

For complex queries, you may need to create indexes. Firebase will prompt you with links to create them when needed.

## Firebase Authentication Setup

1. Go to Firebase Console > Authentication > Sign-in method
2. Enable **Email/Password** provider
3. Enable **Google** provider
4. Add your domain to Authorized domains

## Monitoring & Logging

### View Cloud Run Logs

```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=tenaai-backend" --limit 50
```

### Set Up Alerts

```bash
# Create an alert policy for high error rate
gcloud alpha monitoring policies create \
  --display-name="TenaAI Backend Errors" \
  --condition-filter='resource.type="cloud_run_revision" AND metric.type="run.googleapis.com/request_count" AND metric.labels.response_code_class!="2xx"' \
  --condition-threshold-value=10 \
  --condition-threshold-comparison=COMPARISON_GT
```

## Updating Deployments

### Update Backend

```bash
cd backend
gcloud builds submit --tag gcr.io/$PROJECT_ID/tenaai-backend
gcloud run deploy tenaai-backend --image gcr.io/$PROJECT_ID/tenaai-backend --region us-central1
```

### Update Frontend

```bash
cd frontend
npm run build
firebase deploy --only hosting
```

## Cost Optimization

1. **Cloud Run**: Uses scale-to-zero, you only pay when handling requests
2. **Firestore**: Use the free tier (50K reads, 20K writes per day)
3. **Firebase Hosting**: Free tier includes 10GB storage, 360MB/day transfer

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `CORS_ORIGIN` matches your Firebase Hosting URL
2. **Auth Errors**: Verify Firebase service account has correct permissions
3. **Gemini API Errors**: Check API key is valid and has quota

### Debug Mode

Set `NODE_ENV=development` temporarily to get detailed error messages.

## Security Checklist

- [ ] Service account has minimal required permissions
- [ ] Secrets stored in Secret Manager (not in code)
- [ ] Firestore rules restrict access to authenticated users
- [ ] CORS configured for specific origins
- [ ] HTTPS enforced on all endpoints
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
