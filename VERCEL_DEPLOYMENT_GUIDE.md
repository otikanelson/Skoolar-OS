# Vercel Deployment Guide - EduCore OS

## Quick Deployment Steps

### 1. Prepare Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - EduCore OS with multi-tenant login"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/educore-os.git
git branch -M main
git push -u origin main
```

### 2. Deploy Frontend to Vercel

#### Option A: Via Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `educore-os/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app/api
   VITE_APP_NAME=EduCore OS
   ```

6. Click "Deploy"

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy frontend
cd educore-os/frontend
vercel --prod
```

### 3. Deploy Backend to Vercel

#### Option A: Via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import the SAME GitHub repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `educore-os/backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   ```
   JWT_SECRET=your-super-secret-jwt-key-change-this
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

6. Click "Deploy"

#### Option B: Via Vercel CLI
```bash
# Deploy backend
cd educore-os/backend
vercel --prod
```

### 4. Update Frontend Environment Variables

After backend is deployed:
1. Go to your frontend project on Vercel
2. Settings → Environment Variables
3. Update `VITE_API_URL` to your backend URL:
   ```
   VITE_API_URL=https://educore-backend.vercel.app/api
   ```
4. Redeploy frontend

### 5. Configure CORS

Update backend to allow your frontend domain:
- In `educore-os/backend/src/main.ts`, update CORS origin to your frontend URL
- Commit and push changes
- Vercel will auto-deploy

## Project Structure for Vercel

```
educore-os/
├── frontend/
│   ├── dist/                 # Build output
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json          # Frontend config
│   └── .env.production
├── backend/
│   ├── dist/                # Build output
│   ├── src/
│   ├── api/
│   │   └── index.ts         # Serverless entry
│   ├── package.json
│   ├── tsconfig.json
│   ├── vercel.json          # Backend config
│   └── .env.example
├── vercel.json              # Root config (optional)
└── .gitignore
```

## Environment Variables

### Frontend (.env.production)
```env
VITE_API_URL=https://educore-backend.vercel.app/api
VITE_APP_NAME=EduCore OS
```

### Backend (.env on Vercel)
```env
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
NODE_ENV=production
FRONTEND_URL=https://educore-frontend.vercel.app
PORT=3000
```

## Important Notes

### 1. Separate Deployments
- Frontend and Backend are deployed as **separate Vercel projects**
- This is the recommended approach for better scalability
- Each has its own domain

### 2. API Routes
- Frontend: `https://educore-frontend.vercel.app`
- Backend: `https://educore-backend.vercel.app/api`

### 3. CORS Configuration
Make sure backend allows frontend domain:
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
});
```

### 4. Build Commands
- **Frontend**: `npm run build` (Vite)
- **Backend**: `npm run build` (NestJS)

### 5. Custom Domains (Optional)
After deployment, you can add custom domains:
- Frontend: `app.educore.ng`
- Backend: `api.educore.ng`

## Troubleshooting

### Build Fails
```bash
# Check build locally first
cd educore-os/frontend
npm install
npm run build

cd ../backend
npm install
npm run build
```

### CORS Errors
- Verify `FRONTEND_URL` in backend environment variables
- Check CORS configuration in `main.ts`
- Ensure credentials are enabled

### 404 on Routes
- Frontend: Check `vercel.json` has rewrites for SPA
- Backend: Verify API routes are prefixed with `/api`

### Environment Variables Not Working
- Vercel requires rebuild after env var changes
- Frontend: Must prefix with `VITE_`
- Backend: No prefix needed

## Post-Deployment Checklist

- [ ] Frontend deployed successfully
- [ ] Backend deployed successfully
- [ ] Environment variables configured
- [ ] CORS working (test from frontend)
- [ ] All routes accessible
- [ ] Login flow works
- [ ] API calls successful
- [ ] Images loading correctly
- [ ] Animations working
- [ ] Mobile responsive

## Useful Commands

```bash
# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]

# Redeploy
vercel --prod

# Remove deployment
vercel rm [deployment-name]
```

## Alternative: Single Monorepo Deployment

If you want to deploy as a single project:

1. Use root `vercel.json` configuration
2. Vercel will build both frontend and backend
3. Routes will be:
   - `/` → Frontend
   - `/api/*` → Backend

This is simpler but less flexible for scaling.

## Production URLs

After deployment, you'll have:
- **Frontend**: `https://educore-os-frontend.vercel.app`
- **Backend**: `https://educore-os-backend.vercel.app`

Update these in your environment variables!

## Security Reminders

1. ✅ Change JWT_SECRET in production
2. ✅ Use strong, random secrets (32+ characters)
3. ✅ Never commit `.env` files
4. ✅ Use Vercel's environment variables
5. ✅ Enable HTTPS only (Vercel does this automatically)
6. ✅ Configure proper CORS origins

## Next Steps After Deployment

1. Test all login flows
2. Verify API connectivity
3. Check mobile responsiveness
4. Test animations and images
5. Monitor Vercel analytics
6. Set up custom domains (optional)
7. Configure database (when ready)
8. Set up monitoring/logging

## Support

- Vercel Docs: https://vercel.com/docs
- NestJS Deployment: https://docs.nestjs.com/deployment
- Vite Deployment: https://vitejs.dev/guide/static-deploy.html

---

**Ready to deploy!** 🚀

Just push to GitHub and follow the steps above.
