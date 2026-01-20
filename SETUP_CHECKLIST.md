# Firestore Setup Checklist

Use this checklist to track your progress setting up Firestore for My Wall.

## ☑️ Setup Checklist

### Prerequisites
- [ ] Node.js installed (v16+)
- [ ] Firebase account created
- [ ] Project dependencies installed (`npm install`)

### Firebase Console Setup
- [ ] Opened [Firebase Console](https://console.firebase.google.com/project/omoope-e814f)
- [ ] Enabled **Firestore Database** (Production mode)
- [ ] Enabled **Authentication** → Email/Password provider
- [ ] Enabled **Authentication** → Google provider
- [ ] Added `localhost` to Authorized domains (Authentication → Settings)

### Cloudinary Setup (File Storage)
- [ ] Created [Cloudinary account](https://cloudinary.com/users/register/free) (free tier)
- [ ] Got **Cloud Name** from [Cloudinary Dashboard](https://console.cloudinary.com/)
- [ ] Created **Upload Preset** (Settings → Upload → Add upload preset)
  - Set Signing Mode to **Unsigned**
  - Named it `my-wall-uploads` (or your preferred name)
- [ ] Added credentials to `.env.local` file (see CLOUDINARY_SETUP.md)

### Security Rules Deployment
- [ ] Installed Firebase CLI (`npm install -g firebase-tools`)
- [ ] Logged in to Firebase (`npm run firebase:login`)
- [ ] Deployed Firestore rules (`npm run firebase:deploy`)
- [ ] Verified rules in Firebase Console → Firestore Database → Rules

### Optional: Firestore Indexes
- [ ] Created composite index for posts (userId + createdAt)
  - Or wait for auto-creation on first query

### Optional: Gemini AI Setup
- [ ] Created `.env.local` file
- [ ] Added `VITE_GEMINI_API_KEY=your_key_here`
- [ ] Got API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Testing
- [ ] Started dev server (`npm run dev`)
- [ ] Opened http://localhost:3000
- [ ] Successfully signed up with email/password
- [ ] Successfully signed in with Google
- [ ] Created a text-only post
- [ ] Created a post with an image
- [ ] Viewed posts in the feed
- [ ] Deleted a post
- [ ] Verified posts appear in Firebase Console → Firestore Database → Data
- [ ] Verified uploaded files in Firebase Console → Storage

### Verification
- [ ] No console errors in browser (F12)
- [ ] Posts persist after page refresh
- [ ] Only my posts are visible (not other users' posts)
- [ ] Files are stored in `uploads/{userId}/` folder

## 🎉 Setup Complete!

Once all items are checked, your Firestore database is fully configured and ready for production use!

## 📊 Monitor Your App

After setup, regularly check:
- **Firestore Usage**: Console → Firestore Database → Usage
- **Storage Usage**: Console → Storage → Usage
- **Authentication**: Console → Authentication → Users
- **Errors**: Console → Firestore Database → Logs

## 🔗 Quick Links

- [Firebase Console](https://console.firebase.google.com/project/omoope-e814f)
- [Quick Start Guide](./QUICKSTART.md)
- [Full Setup Guide](./FIRESTORE_SETUP.md)
- [README](./README.md)

---

**Need Help?** See the troubleshooting sections in QUICKSTART.md or FIRESTORE_SETUP.md
