# Pre-Deployment Checklist

## ✅ Files Created for Vercel Deployment

### Configuration Files
- [x] `vercel.json` (root)
- [x] `educore-os/frontend/vercel.json`
- [x] `educore-os/backend/vercel.json`
- [x] `.gitignore`
- [x] `README.md`
- [x] `VERCEL_DEPLOYMENT_GUIDE.md`
- [x] `deploy.sh`

### Environment Files
- [x] `educore-os/frontend/.env.example`
- [x] `educore-os/frontend/.env.production`
- [x] `educore-os/backend/.env.example`
- [x] `educore-os/backend/.env` (already exists)

### Backend Serverless
- [x] `educore-os/backend/api/index.ts`

## 📋 Before Pushing to GitHub

### 1. Review Code
- [ ] Check all pages load correctly locally
- [ ] Test login flows (portal-first and direct)
- [ ] Verify animations work
- [ ] Check mobile responsiveness
- [ ] Test API endpoints

### 2. Environment Variables
- [ ] Remove any sensitive data from code
- [ ] Verify `.env` is in `.gitignore`
- [ ] Create `.env.example` files (done)

### 3. Build Test
```bash
# Test frontend build
cd educore-os/frontend
npm run build

# Test backend build
cd ../backend
npm run build
```

### 4. Git Setup
```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Check what will be committed
git status

# Commit
git commit -m "Initial commit - EduCore OS"
```

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
# Create repository on GitHub first
# Then:
git remote add origin https://github.com/YOUR_USERNAME/educore-os.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Frontend
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import GitHub repository
4. Configure:
   - **Project Name**: `educore-frontend`
   - **Framework**: Vite
   - **Root Directory**: `educore-os/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   ```
   VITE_API_URL=https://educore-backend.vercel.app/api
   VITE_APP_NAME=EduCore OS
   ```
6. Deploy

### Step 3: Deploy Backend
1. Click "Add New Project" again
2. Import SAME GitHub repository
3. Configure:
   - **Project Name**: `educore-backend`
   - **Framework**: Other
   - **Root Directory**: `educore-os/backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables:
   ```
   JWT_SECRET=your-super-secret-jwt-key-change-this-32-chars-min
   NODE_ENV=production
   FRONTEND_URL=https://educore-frontend.vercel.app
   PORT=3000
   ```
5. Deploy

### Step 4: Update Frontend API URL
1. Go to frontend project on Vercel
2. Settings → Environment Variables
3. Update `VITE_API_URL` with actual backend URL
4. Redeploy frontend

### Step 5: Test Deployment
- [ ] Visit frontend URL
- [ ] Test portal connection
- [ ] Test user login
- [ ] Test direct login
- [ ] Verify API calls work
- [ ] Check all pages load
- [ ] Test on mobile

## 🔍 Post-Deployment Verification

### Frontend Checks
- [ ] Landing page loads
- [ ] Background image displays
- [ ] Animations work smoothly
- [ ] Portal connection page works
- [ ] User login page works
- [ ] Direct login page works
- [ ] All dashboard pages accessible
- [ ] Navigation works
- [ ] Mobile responsive

### Backend Checks
- [ ] API responds at `/api`
- [ ] Login endpoint works: `POST /api/auth/login`
- [ ] Profile endpoint works: `GET /api/auth/profile`
- [ ] CORS configured correctly
- [ ] JWT tokens generated
- [ ] Demo users work

### Integration Checks
- [ ] Frontend can call backend API
- [ ] Login flow completes successfully
- [ ] JWT tokens stored correctly
- [ ] Protected routes work
- [ ] No CORS errors in console

## 🐛 Common Issues & Solutions

### Build Fails
**Problem**: Build fails on Vercel
**Solution**: 
- Check build works locally first
- Verify all dependencies in package.json
- Check Node version compatibility

### CORS Errors
**Problem**: API calls blocked by CORS
**Solution**:
- Verify `FRONTEND_URL` in backend env vars
- Check CORS config in `main.ts`
- Ensure credentials enabled

### 404 on Routes
**Problem**: Page refresh gives 404
**Solution**:
- Check `vercel.json` has SPA rewrites
- Verify routes in App.jsx

### Images Not Loading
**Problem**: Background image doesn't show
**Solution**:
- Check image path in assets folder
- Verify import statement
- Check build includes assets

### Environment Variables Not Working
**Problem**: API URL undefined
**Solution**:
- Prefix frontend vars with `VITE_`
- Redeploy after adding env vars
- Check spelling of variable names

## 📊 Deployment URLs

After deployment, update these:

**Frontend**: `https://educore-frontend.vercel.app`
**Backend**: `https://educore-backend.vercel.app`

Update in:
- Frontend `.env.production`
- Backend CORS configuration
- Documentation

## 🎉 Success Criteria

Deployment is successful when:
- ✅ Both frontend and backend deployed
- ✅ No build errors
- ✅ All pages accessible
- ✅ Login flow works end-to-end
- ✅ API calls successful
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Animations smooth
- ✅ Images loading

## 📝 Notes

- Vercel provides automatic HTTPS
- Deployments are automatic on git push
- Preview deployments for branches
- Production deployment on main branch
- Free tier includes:
  - 100GB bandwidth
  - Unlimited requests
  - Automatic SSL
  - Global CDN

## 🔐 Security Reminders

- [ ] JWT_SECRET is strong (32+ characters)
- [ ] No secrets in code
- [ ] CORS properly configured
- [ ] HTTPS only (automatic on Vercel)
- [ ] Environment variables set correctly

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Check deployment logs in Vercel dashboard

---

**Ready to deploy!** Follow the steps above and you'll be live in minutes! 🚀
