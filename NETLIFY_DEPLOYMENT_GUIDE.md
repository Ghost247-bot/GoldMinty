# Netlify Deployment Guide

This guide will help you deploy your GoldMint application to Netlify.

## Prerequisites

- A Netlify account
- Your GitHub repository connected to Netlify
- Supabase project with database set up

## Step 1: Environment Variables Setup

### Required Environment Variables

You need to set up the following environment variables in your Netlify dashboard:

1. **Supabase Configuration:**
   ```
   VITE_SUPABASE_URL=https://evhnpcssaivmiywecpck.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2aG5wY3NzYWl2bWl5d2VjcGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODk4MzAsImV4cCI6MjA3NDY2NTgzMH0.m7aEantCX9xTREZmIMNKUNv6rXJxKb-tEfyDKAreyvM
   ```

2. **Square Payment Configuration (Optional):**
   ```
   VITE_SQUARE_APPLICATION_ID=your_square_application_id
   VITE_SQUARE_LOCATION_ID=your_square_location_id
   VITE_SQUARE_ENVIRONMENT=sandbox
   ```

### How to Set Environment Variables in Netlify:

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Click **Add variable**
5. Add each variable with its corresponding value

## Step 2: Build Configuration

The project is already configured with the following settings in `netlify.toml`:

- **Build Command**: `npm ci && npm run build`
- **Publish Directory**: `dist`
- **Node.js Version**: 18
- **SPA Redirects**: Configured for React Router
- **Security Headers**: Configured for production
- **Asset Caching**: Optimized for static assets

## Step 3: Database Setup

### Supabase Database

Make sure your Supabase database is properly set up with all migrations:

1. **Run Migrations**: Ensure all database migrations are applied
2. **RLS Policies**: Verify Row Level Security policies are in place
3. **Functions**: Confirm all database functions are created

### Required Database Tables:
- `profiles` - User profiles with account freeze functionality
- `user_roles` - User role management
- `orders` - Order management system
- `products` - Product catalog
- `user_transactions` - Transaction history
- And other supporting tables

## Step 4: Deployment Process

### Automatic Deployment (Recommended)

1. **Connect Repository**: Connect your GitHub repository to Netlify
2. **Configure Build Settings**: Netlify will automatically detect the `netlify.toml` configuration
3. **Set Environment Variables**: Add the required environment variables
4. **Deploy**: Netlify will automatically build and deploy on every push to the main branch

### Manual Deployment

If you prefer manual deployment:

1. **Build Locally**: Run `npm run build` to create the `dist` folder
2. **Upload to Netlify**: Drag and drop the `dist` folder to Netlify
3. **Configure**: Set up environment variables and redirects

## Step 5: Post-Deployment Configuration

### Domain Configuration

1. **Custom Domain**: Set up your custom domain in Netlify
2. **SSL Certificate**: Netlify provides free SSL certificates
3. **DNS Configuration**: Update your DNS records to point to Netlify

### Performance Optimization

The following optimizations are already configured:

- **Asset Caching**: Static assets are cached for 1 year
- **Gzip Compression**: Enabled by default
- **CDN**: Netlify's global CDN is automatically used
- **Build Optimization**: Vite build optimizations are enabled

## Step 6: Monitoring and Maintenance

### Build Monitoring

- **Build Logs**: Monitor build logs in Netlify dashboard
- **Deploy Status**: Check deployment status and any errors
- **Performance**: Monitor site performance and Core Web Vitals

### Database Monitoring

- **Supabase Dashboard**: Monitor database performance and usage
- **Error Logs**: Check Supabase logs for any database errors
- **Backup**: Ensure regular database backups are configured

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check environment variables are set correctly
   - Verify all dependencies are in package.json
   - Check build logs for specific errors

2. **Runtime Errors**:
   - Verify Supabase connection and credentials
   - Check browser console for client-side errors
   - Ensure all environment variables are accessible

3. **Database Connection Issues**:
   - Verify Supabase URL and API key
   - Check RLS policies are not blocking requests
   - Ensure database migrations are applied

### Support

- **Netlify Documentation**: https://docs.netlify.com/
- **Supabase Documentation**: https://supabase.com/docs
- **Vite Documentation**: https://vitejs.dev/guide/

## Security Considerations

- **Environment Variables**: Never commit sensitive keys to version control
- **RLS Policies**: Ensure proper Row Level Security is configured
- **HTTPS**: Always use HTTPS in production
- **CORS**: Configure CORS settings in Supabase if needed

## Performance Tips

- **Image Optimization**: Use optimized images and lazy loading
- **Code Splitting**: Implement code splitting for better performance
- **Caching**: Leverage browser caching and CDN caching
- **Monitoring**: Use Netlify Analytics for performance insights
