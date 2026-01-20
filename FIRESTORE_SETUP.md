# Firestore Database Setup Guide for My Wall

This guide will walk you through setting up your Firestore database to store your wall posts.

## Prerequisites

You already have:
- ✅ Firebase project created (Project ID: `omoope-e814f`)
- ✅ Firebase configuration in `firebase.ts`
- ✅ Security rules defined in `firestore.rules` and `storage.rules`

## Step-by-Step Setup

### 1. Enable Firestore Database

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **omoope-e814f**
3. In the left sidebar, click on **"Build"** → **"Firestore Database"**
4. Click **"Create database"**
5. Choose a starting mode:
   - **Production mode** (Recommended) - Uses the security rules you've defined
   - **Test mode** - Allows all reads/writes (NOT recommended for production)
6. Select a Cloud Firestore location (choose one close to your users):
   - For US: `us-central1` or `us-east1`
   - For Europe: `europe-west1`
   - For Asia: `asia-southeast1`
7. Click **"Enable"**

### 2. Enable Firebase Storage

1. In the Firebase Console, go to **"Build"** → **"Storage"**
2. Click **"Get started"**
3. Choose **"Production mode"** (uses your security rules)
4. Select the same location as your Firestore database
5. Click **"Done"**

### 3. Enable Authentication

1. In the Firebase Console, go to **"Build"** → **"Authentication"**
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Enable the following providers:
   - **Email/Password**: Click on it → Toggle "Enable" → Save
   - **Google**: Click on it → Toggle "Enable" → Enter your project support email → Save

### 4. Deploy Security Rules

You have two options to deploy your security rules:

#### Option A: Using Firebase CLI (Recommended)

1. Install Firebase CLI if you haven't already:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project (if not already done):
   ```bash
   firebase init
   ```
   - Select **Firestore** and **Storage**
   - Use existing project: **omoope-e814f**
   - Use `firestore.rules` for Firestore rules
   - Use `storage.rules` for Storage rules
   - Skip Firestore indexes for now

4. Deploy the rules:
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```

#### Option B: Manual Upload via Console

**For Firestore Rules:**
1. Go to Firebase Console → Firestore Database → Rules tab
2. Copy the contents of `firestore.rules` and paste it
3. Click **"Publish"**

**For Storage Rules:**
1. Go to Firebase Console → Storage → Rules tab
2. Copy the contents of `storage.rules` and paste it
3. Click **"Publish"**

### 5. Create Firestore Indexes (Optional but Recommended)

For better query performance, create a composite index:

1. Go to Firebase Console → Firestore Database → Indexes tab
2. Click **"Create Index"**
3. Configure:
   - **Collection ID**: `posts`
   - **Fields to index**:
     - Field: `userId`, Order: Ascending
     - Field: `createdAt`, Order: Descending
   - **Query scope**: Collection
4. Click **"Create"**

Alternatively, the index will be auto-created when you first run a query that needs it.

### 6. Verify Your Setup

After completing the above steps, test your app:

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Try to:
   - ✅ Sign up with email/password or Google
   - ✅ Create a post with text
   - ✅ Create a post with an image
   - ✅ View your posts
   - ✅ Delete a post

### 7. Monitor Your Database

You can view your data in real-time:

1. Go to Firebase Console → Firestore Database → Data tab
2. You should see a `posts` collection appear after creating your first post
3. Click on a document to see its fields:
   - `userId`: User's UID
   - `content`: Post text content
   - `mediaType`: Type of media (TEXT, IMAGE, VIDEO, etc.)
   - `mediaUrl`: URL to uploaded file (if any)
   - `fileName`: Original file name (if any)
   - `createdAt`: Timestamp
   - `aiEnhanced`: Boolean flag

## Troubleshooting

### Issue: "Missing or insufficient permissions"

**Solution**: Make sure you've deployed the security rules and that you're logged in.

### Issue: "Firebase: Error (auth/unauthorized-domain)"

**Solution**: 
1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. Add `localhost` and your production domain

### Issue: Posts not appearing

**Solution**:
1. Check browser console for errors
2. Verify you're logged in
3. Check Firestore rules are deployed
4. Ensure the `posts` collection exists in Firestore

### Issue: File upload fails

**Solution**:
1. Verify Storage is enabled
2. Check storage rules are deployed
3. Ensure you're logged in
4. Check browser console for specific error messages

## Security Rules Explained

### Firestore Rules (`firestore.rules`)

```javascript
match /posts/{postId} {
  // Users can only read their own posts
  allow read: if request.auth != null && resource.data.userId == request.auth.uid;
  
  // Users can only create posts with their own userId
  allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
  
  // Users can only update/delete their own posts
  allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
}
```

### Storage Rules (`storage.rules`)

```javascript
match /uploads/{userId}/{allPaths=**} {
  // Users can only access files in their own folder
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

## Data Structure

### Posts Collection

Each document in the `posts` collection has this structure:

```typescript
{
  id: string;              // Auto-generated document ID
  userId: string;          // User's UID from Firebase Auth
  content: string;         // Text content of the post
  mediaType: MediaType;    // TEXT, IMAGE, VIDEO, AUDIO, DOCUMENT, OTHER
  mediaUrl: string | null; // URL to uploaded file (null if text-only)
  fileName: string | null; // Original filename (null if text-only)
  createdAt: number;       // Timestamp in milliseconds
  aiEnhanced: boolean;     // Whether AI was used to enhance the text
}
```

## Next Steps

Once your Firestore is configured:

1. ✅ Test all functionality (create, read, delete posts)
2. 📊 Monitor usage in Firebase Console
3. 🔒 Review security rules periodically
4. 📈 Set up billing alerts in Google Cloud Console
5. 🚀 Deploy your app to production

## Useful Links

- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Storage Documentation](https://firebase.google.com/docs/storage)
- [Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)

---

**Need Help?** Check the browser console for detailed error messages, or review the Firebase Console logs.
