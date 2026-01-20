<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# My Wall - Personal Cloud Storage

A beautiful, AI-powered personal cloud storage app built with React, Firebase, and Google Gemini AI.

View your app in AI Studio: https://ai.studio/apps/drive/1Pr9bItOycoTuCpzdNDxSyTM68MaMsAkC

## ✨ Features

- 📝 Create text posts with AI enhancement
- 🖼️ Upload and store images, videos, audio, and documents
- 🔒 Secure authentication with Email/Password and Google Sign-In
- ☁️ Cloud storage with Firebase Firestore and Storage
- 🎨 Beautiful dark/light theme
- 📱 Responsive masonry layout
- 🤖 AI-powered text enhancement with Google Gemini

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Firebase account
- Google Gemini API key

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase & Cloudinary

**Firebase (Database & Auth):**
1. Enable Firestore Database in [Firebase Console](https://console.firebase.google.com/project/omoope-e814f)
2. Enable Authentication (Email/Password and Google)
3. Deploy security rules:
   ```bash
   npm install -g firebase-tools
   npm run firebase:login
   npm run firebase:deploy
   ```

**Cloudinary (File Storage - Free!):**

See [CLOUDINARY_QUICKSTART.md](./CLOUDINARY_QUICKSTART.md) for detailed setup.

**Quick steps:**
1. Create free account at [Cloudinary](https://cloudinary.com/users/register/free)
2. Get your Cloud Name from dashboard
3. Create an unsigned upload preset named `my-wall-uploads`
4. Add to `.env.local`:
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=my-wall-uploads
   ```

### 3. Configure Gemini API (Optional)

Add to your `.env.local` file:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### 4. Run the App

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 📚 Documentation

- [Quick Start Guide](./QUICKSTART.md) - Get up and running in 5 minutes
- [Firestore Setup Guide](./FIRESTORE_SETUP.md) - Detailed database configuration
- [Firebase Console](https://console.firebase.google.com/project/omoope-e814f) - Manage your Firebase project

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run firebase:login` - Login to Firebase CLI
- `npm run firebase:deploy` - Deploy Firestore and Storage rules

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Storage**: Cloudinary (25 GB free tier)
- **Authentication**: Firebase Auth
- **AI**: Google Gemini API
- **Icons**: Font Awesome

## 📁 Project Structure

```
my-wall/
├── components/          # React components
│   ├── Auth.tsx        # Authentication UI
│   ├── CreateModal.tsx # Post creation modal
│   ├── Layout.tsx      # App layout
│   ├── PostCard.tsx    # Individual post card
│   └── WallFeed.tsx    # Main feed display
├── services/           # Business logic
│   ├── dataService.ts  # Firebase operations
│   ├── gemini.ts       # AI text enhancement
│   └── compression.ts  # Image compression
├── firebase.ts         # Firebase configuration
├── types.ts           # TypeScript types
├── firestore.rules    # Firestore security rules
├── storage.rules      # Storage security rules
└── index.html         # Entry point
```

## 🔒 Security

- User authentication required for all operations
- Users can only access their own data
- Secure file storage with user-specific folders
- Production-ready security rules

## 🐛 Troubleshooting

See the [QUICKSTART.md](./QUICKSTART.md#-troubleshooting) or [FIRESTORE_SETUP.md](./FIRESTORE_SETUP.md#troubleshooting) for common issues and solutions.

## 📝 License

MIT License - feel free to use this project for your own purposes!

---

**Firebase Project**: omoope-e814f  
**Need help?** Check the browser console (F12) for detailed error messages.
