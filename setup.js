#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Lead Management System...\n');

// Create .env file for backend
const backendEnvContent = `NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lead_management
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000`;

const backendEnvPath = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(backendEnvPath)) {
  fs.writeFileSync(backendEnvPath, backendEnvContent);
  console.log('✅ Created backend/.env file');
} else {
  console.log('⚠️  backend/.env already exists');
}

// Create .env file for frontend
const frontendEnvContent = `REACT_APP_API_URL=http://localhost:5000/api`;

const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
if (!fs.existsSync(frontendEnvPath)) {
  fs.writeFileSync(frontendEnvPath, frontendEnvContent);
  console.log('✅ Created frontend/.env file');
} else {
  console.log('⚠️  frontend/.env already exists');
}

console.log('\n📦 Installing dependencies...\n');

try {
  // Install root dependencies
  console.log('Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Install backend dependencies
  console.log('\nInstalling backend dependencies...');
  execSync('npm install', { cwd: path.join(__dirname, 'backend'), stdio: 'inherit' });

  // Install frontend dependencies
  console.log('\nInstalling frontend dependencies...');
  execSync('npm install', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });

  console.log('\n🎉 Setup completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Make sure MongoDB is running on your system');
  console.log('2. Start the development servers:');
  console.log('   npm run dev');
  console.log('\n🌐 Access the application:');
  console.log('   Frontend: http://localhost:3000');
  console.log('   Backend API: http://localhost:5000');
  console.log('   Health Check: http://localhost:5000/api/health');
  console.log('\n📚 For more information, see README.md');

} catch (error) {
  console.error('\n❌ Setup failed:', error.message);
  console.log('\nPlease run the following commands manually:');
  console.log('npm install');
  console.log('cd backend && npm install');
  console.log('cd ../frontend && npm install');
  process.exit(1);
}
