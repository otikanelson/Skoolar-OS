#!/bin/bash

echo "🚀 EduCore OS - Quick Deployment Script"
echo "========================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Add all files
echo "📝 Adding files to git..."
git add .

# Commit
echo "💾 Committing changes..."
read -p "Enter commit message (default: 'Deploy EduCore OS'): " commit_msg
commit_msg=${commit_msg:-"Deploy EduCore OS"}
git commit -m "$commit_msg"

# Check if remote exists
if ! git remote | grep -q origin; then
    echo ""
    echo "🔗 No remote repository found."
    read -p "Enter your GitHub repository URL: " repo_url
    git remote add origin "$repo_url"
fi

# Push to GitHub
echo ""
echo "⬆️  Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://vercel.com"
echo "2. Click 'Add New Project'"
echo "3. Import your GitHub repository"
echo "4. Deploy Frontend:"
echo "   - Root Directory: educore-os/frontend"
echo "   - Framework: Vite"
echo "   - Build Command: npm run build"
echo "   - Output Directory: dist"
echo ""
echo "5. Deploy Backend (separate project):"
echo "   - Root Directory: educore-os/backend"
echo "   - Framework: Other"
echo "   - Build Command: npm run build"
echo "   - Output Directory: dist"
echo ""
echo "6. Configure environment variables (see VERCEL_DEPLOYMENT_GUIDE.md)"
echo ""
echo "🎉 Happy deploying!"
