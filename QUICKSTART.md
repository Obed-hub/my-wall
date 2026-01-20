# Quick Start Guide - My Wall Firestore Setup

## 🚀 Quick Setup (5 minutes)

### Step 1: Enable Firestore & Storage

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select project: **omoope-e814f**
3. Enable **Firestore Database**:
   - Click "Build" → "Firestore Database" → "Create database"
   - Choose **Production mode**
   - Select location (e.g., `us-central1`)
   - Click "Enable"

4. Enable **Storage**:
   - Click "Build" → "Storage" → "Get started"
   - Choose **Production mode**
   - Use same location as Firestore
   - Click "Done"

5. Enable **Authentication**:
   - Click "Build" → "Authentication" → "Get started"
   - Enable **Email/Password** provider
   - Enable **Google** provider (enter support email)

### Step 2: Deploy Security Rules

Open your terminal in the project directory and run:

```bash
# Install Firebase CLI globally (if not already installed)
npm install -g firebase-tools

# Login to Firebase
npm run firebase:login

# Deploy the security rules
npm run firebase:deploy
```

That's it! Your Firestore database is now configured and ready to use.

### Step 3: Test Your App

```bash
# Start the dev server (if not already running)
npm run dev
```

Open http://localhost:3000 and:
1. ✅ Sign up with email or Google
2. ✅ Create a post
3. ✅ View your posts
4. ✅ Delete a post

## 📊 View Your Data

Go to [Firebase Console](https://console.firebase.google.com/) → Firestore Database → Data

You'll see your `posts` collection with all your wall posts!

## ❓ Troubleshooting

**Error: "Missing or insufficient permissions"**
- Make sure you deployed the rules: `npm run firebase:deploy`
- Ensure you're logged in to the app

**Error: "Firebase: Error (auth/unauthorized-domain)"**
- Go to Firebase Console → Authentication → Settings → Authorized domains
- Add `localhost`

**Posts not showing up?**
- Check browser console for errors (F12)
- Verify you're logged in
- Check Firestore Database in Firebase Console

## 📚 Full Documentation

See `FIRESTORE_SETUP.md` for detailed documentation.

---

**Your Firebase Project**: omoope-e814f  
**Console**: https://console.firebase.google.com/project/omoope-e814f
