# Deployment Guide for Erino Lead Management System

## Deploy to Render.com

### Option 1: Using render.yaml (Recommended)

1. **Push your code to GitHub** with the `render.yaml` file
2. **Connect your GitHub repo** to Render
3. **Render will automatically detect** the `render.yaml` and create both services

### Option 2: Manual Setup

#### Frontend Deployment

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/build`
   - **Environment:** Static Site
   - **Environment Variables:**
     - `REACT_APP_API_URL`: `https://your-backend-url.onrender.com/api`

#### Backend Deployment

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Environment:** Node
   - **Environment Variables:**
     - `NODE_ENV`: `production`
     - `PORT`: `10000` (or leave empty for auto-assignment)
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Generate a secure secret
     - `JWT_EXPIRE`: `7d`
     - `FRONTEND_URL`: `https://your-frontend-url.onrender.com`

### Environment Variables Setup

#### Backend (.env for production)
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lead_management?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_here
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-url.onrender.com
```

#### Frontend (Environment Variables in Render)
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

### Common Issues and Solutions

1. **"Publish directory ./dist does not exist" Error:**
   - **Problem:** Render is looking for `./dist` but React builds to `./build`
   - **Solution:** Set Publish Directory to `frontend/build` (not `./dist`)
   - **Check:** Make sure the build command is `cd frontend && npm install && npm run build`

2. **"Publish directory npm run build does not exist" Error:**
   - **Problem:** Render is using the build command as publish directory
   - **Solution:** Set Publish Directory to `frontend/build` (not the build command)
   - **Check:** Make sure the build command is `cd frontend && npm install && npm run build`

3. **"Could not find a required file. Name: index.html" Error:**
   - **Problem:** Build command not running from correct directory
   - **Solution:** Use `cd frontend && npm install && npm run build` as build command
   - **Check:** Ensure `frontend/public/index.html` exists in your repo

4. **Build Command Error:**
   - Make sure the build command includes `cd frontend &&`
   - Ensure all dependencies are installed
   - Check that `frontend/package.json` has the build script

5. **Environment Variables:**
   - Double-check all environment variable names
   - Make sure MongoDB URI is correct
   - Ensure CORS is configured for production URLs

6. **Static Site Configuration:**
   - Set Publish Directory to `frontend/build`
   - Add rewrite rules for React Router
   - Make sure the build actually creates the `build` folder

### Testing Deployment

1. **Check backend health:** `https://your-backend-url.onrender.com/api/health`
2. **Test frontend:** Visit your frontend URL
3. **Test authentication:** Try logging in
4. **Test CRUD operations:** Create, read, update, delete leads

### Security Notes

- Never commit `.env` files to Git
- Use strong JWT secrets in production
- Configure CORS properly for production domains
- Use HTTPS in production (Render provides this automatically)
