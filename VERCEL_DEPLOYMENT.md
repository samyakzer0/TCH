# Vercel Deployment Setup Guide

## Issue: SQLite doesn't work on Vercel
Vercel's serverless functions are stateless and don't support SQLite file databases. You need to use a cloud database.

## Smart Database Architecture
Your app now uses a **database wrapper** that automatically detects the environment:
- **Local development**: Uses SQLite (fast, no setup needed)
- **Production on Vercel**: Uses PostgreSQL (cloud-based, scalable)

This means you can develop locally with SQLite and deploy to Vercel with PostgreSQL without changing any code!

## Solution Options:

## **Option 1: Vercel Postgres (Recommended for Production)**
*Integrated with Vercel Dashboard - Requires Vercel Pro Plan ($20/month)*

### Step 1: Set up Vercel Postgres
1. Go to your Vercel Dashboard
2. Navigate to your project
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose a name (e.g., `tch-database`)
7. Select a region close to your users
8. Click **Create**

### Step 2: Get Database Connection String
1. After creation, go to the **Settings** tab of your database
2. Copy the `POSTGRES_URL` connection string
3. Environment variables are automatically added to your project

### Step 3: The imports are already updated
All API routes now use the database wrapper that supports both SQLite (local) and Postgres (production).

### Step 4: Deploy
```bash
git add .
git commit -m "Add Vercel Postgres support"
git push
```

---

## **Option 2: Supabase Postgres (Free Alternative)**
*External service with generous free tier - Up to 500MB database, 2GB bandwidth*

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login
3. Click **New Project**
4. Choose organization and name your project
5. Set a strong database password
6. Select a region close to your users
7. Click **Create new project**

### Step 2: Get Connection String
1. In Supabase dashboard, go to **Settings** > **Database**
2. Scroll down to **Connection string**
3. Copy the **URI** format connection string
4. Replace `[YOUR-PASSWORD]` with your actual password

### Step 3: Add Environment Variables in Vercel
1. In your Vercel project dashboard, go to **Settings**
2. Go to **Environment Variables**
3. Add these variables:
   ```
   POSTGRES_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Step 4: Deploy
```bash
git add .
git commit -m "Add Supabase Postgres support"
git push
```

## Environment Variables Needed:
```
POSTGRES_URL=postgresql://...
POSTGRES_PRISMA_URL=postgresql://...
POSTGRES_URL_NON_POOLING=postgresql://...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Database Schema will be auto-created:
- menu_items
- orders  
- order_items
- feedback
- admin_users

The database will be automatically initialized with sample data on first run.

## Testing:
1. Deploy to Vercel
2. Check function logs for any errors
3. Test API endpoints manually
4. Test the ordering system

## Common Issues:
1. **Connection timeout**: Increase timeout in vercel.json
2. **SSL errors**: Ensure `?sslmode=require` in connection string
3. **Migration errors**: Database will auto-create tables on first run

Let me know if you need help with any of these steps!
