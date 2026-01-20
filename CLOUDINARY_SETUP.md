# Cloudinary Setup Guide

## 🎯 Why Cloudinary?

Cloudinary offers a generous **free tier** without requiring billing information:
- ✅ **25 GB** storage
- ✅ **25 GB** bandwidth/month
- ✅ **Image optimization** built-in
- ✅ **Video support**
- ✅ **No credit card required**

---

## 📝 Step 1: Create Cloudinary Account

1. Go to [Cloudinary Sign Up](https://cloudinary.com/users/register/free)
2. Fill in your details:
   - Email
   - Password
   - Choose "Developer" as your role
3. Click **Create Account**
4. Verify your email

---

## 🔑 Step 2: Get Your Credentials

1. After logging in, go to your [Dashboard](https://console.cloudinary.com/)
2. You'll see your credentials:
   - **Cloud Name** (e.g., `dxxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (keep this private!)

3. For **unsigned uploads** (recommended for client-side), you need an **Upload Preset**:
   - Go to **Settings** → **Upload** tab
   - Scroll to **Upload presets**
   - Click **Add upload preset**
   - Set:
     - **Preset name**: `my-wall-uploads` (or any name you like)
     - **Signing Mode**: **Unsigned**
     - **Folder**: `my-wall` (optional, organizes your uploads)
   - Click **Save**

---

## 🔧 Step 3: Configure Your App

Create or update your `.env.local` file in the project root:

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=my-wall-uploads

# Optional: Gemini AI
VITE_GEMINI_API_KEY=your_gemini_key_here
```

**Replace:**
- `your_cloud_name_here` with your actual Cloud Name
- `my-wall-uploads` with your upload preset name (if different)

---

## 📦 Step 4: Install Dependencies

Run this command in your terminal:

```bash
npm install cloudinary-core
```

---

## ✅ Step 5: Test Your Setup

After completing the setup:

1. Start your dev server: `npm run dev`
2. Sign in to your app
3. Try uploading an image
4. Check your [Cloudinary Media Library](https://console.cloudinary.com/console/media_library) to see the uploaded file!

---

## 🎨 Cloudinary Features You Get

- **Automatic image optimization** (WebP, compression)
- **Responsive images** (different sizes for different devices)
- **Video transcoding**
- **Transformations** (resize, crop, filters)
- **CDN delivery** (fast worldwide)

---

## 📊 Monitor Usage

Check your usage at: [Cloudinary Console](https://console.cloudinary.com/)

**Free Tier Limits:**
- Storage: 25 GB
- Bandwidth: 25 GB/month
- Transformations: 25 credits/month

For a personal app, you'll likely never exceed these limits!

---

## 🔗 Useful Links

- [Cloudinary Dashboard](https://console.cloudinary.com/)
- [Media Library](https://console.cloudinary.com/console/media_library)
- [Upload Presets](https://console.cloudinary.com/settings/upload)
- [Documentation](https://cloudinary.com/documentation)

---

**Need Help?** Check the browser console (F12) for detailed error messages.
