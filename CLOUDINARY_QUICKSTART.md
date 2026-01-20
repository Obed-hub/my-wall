# 🚀 Quick Start with Cloudinary

## What You Need to Do

Since Firebase Storage requires billing, we've integrated **Cloudinary** instead - it's **100% free** for your use case!

---

## ✅ Step-by-Step Setup (5 minutes)

### 1️⃣ Create Cloudinary Account

1. Go to: https://cloudinary.com/users/register/free
2. Sign up (no credit card needed!)
3. Verify your email

### 2️⃣ Get Your Cloud Name

1. After login, you'll see your **Dashboard**
2. Copy your **Cloud name** (looks like: `dxxxxxx`)

### 3️⃣ Create Upload Preset

1. Click **Settings** (gear icon) → **Upload** tab
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure:
   - **Preset name**: `my-wall-uploads`
   - **Signing Mode**: Select **Unsigned**
   - **Folder**: `my-wall` (optional)
5. Click **Save**

### 4️⃣ Configure Your App

Create a `.env.local` file in your project root:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=my-wall-uploads
```

**Replace `your_cloud_name_here`** with your actual Cloud Name from step 2!

### 5️⃣ Run Your App

```bash
npm run dev
```

That's it! 🎉

---

## 🧪 Test It

1. Open http://localhost:3000
2. Sign in
3. Create a post with an image
4. Check your [Cloudinary Media Library](https://console.cloudinary.com/console/media_library) - your image should be there!

---

## 📊 Free Tier Limits

You get **25 GB storage** and **25 GB bandwidth/month** - more than enough for a personal app!

---

## ❓ Troubleshooting

**Error: "Cloudinary not configured"**
- Make sure `.env.local` exists in your project root
- Check that you've added both `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET`
- Restart your dev server after creating `.env.local`

**Upload fails**
- Verify your upload preset is set to **Unsigned** mode
- Check the browser console (F12) for detailed errors

---

## 🔗 Useful Links

- [Cloudinary Dashboard](https://console.cloudinary.com/)
- [Media Library](https://console.cloudinary.com/console/media_library)
- [Upload Settings](https://console.cloudinary.com/settings/upload)

Need more help? See the detailed guide: `CLOUDINARY_SETUP.md`
