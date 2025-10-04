# 🚀 Deployment Guide - goldmint to Netlify

## ✅ GitHub Setup Complete
Your code has been successfully pushed to GitHub:
- **Repository**: https://github.com/Ghost247-bot/goldmint-mirror
- **Latest Commit**: Custom frozen account notification system + Netlify config

## 🌐 Netlify Deployment Steps

### Step 1: Connect to Netlify
1. Go to [Netlify](https://netlify.com) and sign in
2. Click **"New site from Git"**
3. Choose **"GitHub"** as your Git provider
4. Authorize Netlify to access your GitHub account

### Step 2: Select Your Repository
1. Find and select **"goldmint-mirror"** from your repositories
2. Click **"Deploy site"**

### Step 3: Configure Build Settings
Netlify should automatically detect the settings from `netlify.toml`, but verify:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18

### Step 4: Environment Variables (Important!)
You'll need to add your Supabase environment variables:

1. Go to **Site settings** → **Environment variables**
2. Add these variables:
   ```
   VITE_SUPABASE_URL=https://evhnpcssaivmiywecpck.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2aG5wY3NzYWl2bWl5d2VjcGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODk4MzAsImV4cCI6MjA3NDY2NTgzMH0.m7aEantCX9xTREZmIMNKUNv6rXJxKb-tEfyDKAreyvM
   ```

### Step 5: Deploy
1. Click **"Deploy site"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Your site will be available at a Netlify URL like: `https://amazing-name-123456.netlify.app`

## 🔧 Post-Deployment Setup

### Database Migration
1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/evhnpcssaivmiywecpck
2. Navigate to **SQL Editor**
3. Run the custom freeze notification migration:

```sql
-- Add custom notification fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS custom_freeze_title TEXT,
ADD COLUMN IF NOT EXISTS custom_freeze_message TEXT,
ADD COLUMN IF NOT EXISTS custom_freeze_contact_info TEXT,
ADD COLUMN IF NOT EXISTS custom_freeze_show_contact BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS custom_freeze_show_reason BOOLEAN DEFAULT true;

-- Create function to update custom freeze notification content
CREATE OR REPLACE FUNCTION public.update_custom_freeze_notification(
  target_user_id UUID,
  custom_title TEXT DEFAULT NULL,
  custom_message TEXT DEFAULT NULL,
  custom_contact_info TEXT DEFAULT NULL,
  show_contact BOOLEAN DEFAULT true,
  show_reason BOOLEAN DEFAULT true
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can update custom freeze notifications';
  END IF;
  
  -- Update the custom notification fields
  UPDATE public.profiles 
  SET 
    custom_freeze_title = custom_title,
    custom_freeze_message = custom_message,
    custom_freeze_contact_info = custom_contact_info,
    custom_freeze_show_contact = show_contact,
    custom_freeze_show_reason = show_reason
  WHERE user_id = target_user_id;
  
  RETURN FOUND;
END;
$$;
```

## 🎯 Features Available After Deployment

### ✅ Custom Frozen Account Notifications
- **Admin Dashboard**: Customize notification content per user
- **Custom Titles**: Change "Account Frozen" to any custom title
- **Custom Messages**: Write personalized notification text
- **Custom Contact Info**: Provide specific support instructions
- **Toggle Controls**: Show/hide reason and contact info independently

### ✅ Multi-language Support
- English, Spanish, French, German, Italian, Chinese
- Automatic language detection
- Admin-controlled language switching

### ✅ Complete Admin System
- User management with freeze/unfreeze capabilities
- Custom notification management
- Portfolio management tools
- Transaction tracking
- AI insights management

## 🔄 Automatic Deployments

Once connected, Netlify will automatically deploy your site whenever you push changes to the `master` branch on GitHub.

## 📱 Custom Domain (Optional)

1. Go to **Domain settings** in Netlify
2. Add your custom domain
3. Configure DNS settings as instructed
4. Enable HTTPS (automatic with Netlify)

## 🛠️ Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify Node.js version is 18
- Check build logs in Netlify dashboard

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check Supabase project is active
- Ensure RLS policies are properly configured

### 403 Errors
- Apply the database migration
- Check user roles are properly assigned
- Verify RLS policies are not too restrictive

## 📊 Monitoring

- **Netlify Analytics**: Built-in traffic monitoring
- **Supabase Dashboard**: Database and auth monitoring
- **GitHub**: Code version control and collaboration

Your goldmint application is now ready for production deployment! 🎉
