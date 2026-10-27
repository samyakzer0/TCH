# ☕ The Chai House - Supabase & Google Authentication Guide

This guide explains how to connect your Supabase database and enable Google Authentication for The Chai House (TCH).

---

## ⚡ Quick Architecture Overview

- **Database Layer**: Supabase PostgreSQL (`menu_items`, `orders`, `order_items`, `feedback`, `special_offers`, `admin_users`) with automatic SQLite fallback if credentials are not yet added.
- **Authentication**: Supabase Auth with Google OAuth 2.0 + traditional email/password credentials fallback.
- **Migration**: Automated migration script (`scripts/migrate-to-supabase.js`) to migrate all existing data from SQLite (`data/tch.db`) to Supabase with one command.

---

## 📋 Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New Project**, select an organization, name it (e.g. `thechai-house`), and choose a region close to your users.
3. Save your database password securely.

---

## 🗄️ Step 2: Apply Database Schema

1. In your Supabase Dashboard, open **SQL Editor** from the left sidebar.
2. Click **New query**.
3. Copy the entire contents of [`supabase/schema.sql`](file:///d:/thechai/supabase/schema.sql) and paste into the editor.
4. Click **Run**.
5. All tables (`menu_items`, `orders`, `order_items`, `feedback`, `special_offers`, `admin_users`), Row Level Security (RLS) policies, indexes, and initial seed data will be created!

---

## 🔑 Step 3: Configure Environment Variables

1. In your Supabase Dashboard, go to **Project Settings** (gear icon) ➔ **API**.
2. Copy:
   - **Project URL**
   - **anon / public key**
   - **service_role key** (under Project API keys - click *Reveal*)
3. Open [`.env.local`](file:///d:/thechai/.env.local) in your project root and paste:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

   ADMIN_EMAIL=admin@thechai.house
   ADMIN_PASSWORD=admin123
   NEXT_PUBLIC_ADMIN_EMAIL=admin@thechai.house
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

---

## 🚀 Step 4: Migrate Existing SQLite Data to Supabase (Optional)

If you have existing orders, menu items, or feedback in `data/tch.db`, run:
```bash
node scripts/migrate-to-supabase.js
```
This transfers and links all records to Supabase automatically!

---

## 🌐 Step 5: Enable Google Authentication

### 5.1 Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services** ➔ **OAuth consent screen**:
   - User Type: **External**
   - Fill in App Name ("The Chai House"), user support email, and developer contact email.
   - Save and continue.
4. Navigate to **APIs & Services** ➔ **Credentials**:
   - Click **Create Credentials** ➔ **OAuth client ID**.
   - Application type: **Web application**.
   - Name: `The Chai House Auth`.
   - Under **Authorized redirect URIs**, add:
     ```
     https://<your-supabase-project-id>.supabase.co/auth/v1/callback
     ```
     *(You can find this callback URL in your Supabase Dashboard under Authentication ➔ Providers ➔ Google)*
   - Click **Create**.
   - Copy the **Client ID** and **Client Secret**.

### 5.2 Configure Supabase Google Provider
1. In your Supabase Dashboard, navigate to **Authentication** ➔ **Providers**.
2. Find **Google** and toggle it **Enabled**.
3. Paste:
   - **Client ID** (from Google Cloud)
   - **Client Secret** (from Google Cloud)
4. Click **Save**.

### 5.3 Configure Redirect URLs in Supabase
1. In your Supabase Dashboard, go to **Authentication** ➔ **URL Configuration**.
2. Set **Site URL** to: `http://localhost:3000` (or your production domain).
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/**`
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3001/**` (if running on port 3001)
4. Click **Save**.

---

## 🧪 Testing Everything

1. Start your dev server:
   ```bash
   npm run dev
   ```
2. Open `http://localhost:3000/admin`:
   - Click **Continue with Google** to authenticate with your Google account.
   - Alternatively, sign in using default email credentials (`admin@thechai.house` / `admin123`).
3. Place an order at `http://localhost:3000/order`:
   - If signed in with Google, your name and email are pre-filled automatically!
   - Submitted orders go straight to Supabase and show up live in the Admin Dashboard!
