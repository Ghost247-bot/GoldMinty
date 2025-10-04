# 🚀 Quick Netlify Deployment

## Your GitHub Repository
**URL**: https://github.com/Ghost247-bot/goldmint-mirror

## Netlify Deployment Steps

### 1. Go to Netlify
Visit: https://netlify.com

### 2. Connect GitHub
- Click "New site from Git"
- Choose "GitHub"
- Select "goldmint-mirror" repository

### 3. Build Settings (Auto-detected)
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18

### 4. Environment Variables
Add these in Netlify dashboard:
```
VITE_SUPABASE_URL=https://evhnpcssaivmiywecpck.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2aG5wY3NzYWl2bWl5d2VjcGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODk4MzAsImV4cCI6MjA3NDY2NTgzMH0.m7aEantCX9xTREZmIMNKUNv6rXJxKb-tEfyDKAreyvM
```

### 5. Deploy!
Click "Deploy site" and wait for build to complete.

## 🎯 What You Get
- ✅ Custom frozen account notifications
- ✅ Multi-language support (6 languages)
- ✅ Complete admin dashboard
- ✅ User management system
- ✅ Portfolio management tools
- ✅ Automatic deployments on Git push

## 🔧 After Deployment
1. Apply database migration in Supabase
2. Test the custom notification system
3. Configure admin users
4. Set up your custom domain (optional)

**Your app will be live at**: `https://your-site-name.netlify.app`
