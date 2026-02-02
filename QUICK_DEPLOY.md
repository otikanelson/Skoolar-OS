# 🚀 Quick Deploy to Vercel - 5 Minutes

## Step 1: Push to GitHub (2 minutes)

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Deploy EduCore OS"

# Add your GitHub repo (create it first on GitHub)
git remote add origin https://github.com/YOUR_USERNAME/educore-os.git

# Push
git branch -M main
git push -u origin main
```

## Step 2: Deploy Frontend (1 minute)

1. Go to **[vercel.com](https://vercel.com)** → Login
2. Click **"Add New Project"**
3. Import your GitHub repo
4. Settings:
   - Root Directory: `educore-os/frontend`
   - Framework: **Vite**
   - Build: `npm run build`
   - Output: `dist`
5. Click **"Deploy"**

## Step 3: Deploy Backend (1 minute)

1. Click **"Add New Project"** again
2. Import SAME repo
3. Settings:
   - Root Directory: `educore-os/backend`
   - Framework: **Other**
   - Build: `npm run build`
   - Output: `dist`
4. Add Environment Variable:
   ```
   JWT_SECRET=educore-secret-key-2024-change-in-production-32chars
   ```
5. Click **"Deploy"**

## Step 4: Connect Frontend to Backend (1 minute)

1. Copy your backend URL (e.g., `https://educore-backend.vercel.app`)
2. Go to frontend project → **Settings** → **Environment Variables**
3. Add:
   ```
   VITE_API_URL=https://educore-backend.vercel.app/api
   ```
4. Go to **Deployments** → Click **"Redeploy"**

## ✅ Done!

Your app is live at:
- **Frontend**: `https://educore-frontend.vercel.app`
- **Backend**: `https://educore-backend.vercel.app`

## Test It

1. Visit your frontend URL
2. Click "School Login"
3. Enter portal: `fieldgreen`
4. Login with: `admin@fieldgreen.edu` / `password123`

---

**That's it!** 🎉 Your app is deployed!

### Troubleshooting

**Build fails?**
- Check build works locally: `npm run build`
- Check Node version matches

**CORS errors?**
- Add `FRONTEND_URL` to backend env vars
- Value: your frontend URL

**404 on refresh?**
- Vercel.json should have rewrites (already configured)

### Custom Domain (Optional)

1. Go to project → **Settings** → **Domains**
2. Add your domain
3. Update DNS records as shown
4. Done!

---

Need detailed help? See **VERCEL_DEPLOYMENT_GUIDE.md**
