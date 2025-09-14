#!/usr/bin/env node

/**
 * Optimized Build Script for Production Deployment
 * This script ensures the build is optimized for production
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting optimized production build...');

// Set production environment variables
process.env.NODE_ENV = 'production';
process.env.GENERATE_SOURCEMAP = 'false';
process.env.REACT_APP_ENV = 'production';

// Clean previous build
console.log('🧹 Cleaning previous build...');
try {
  if (fs.existsSync('build')) {
    execSync('rm -rf build', { stdio: 'inherit' });
  }
} catch (error) {
  console.log('Build directory already clean');
}

// Install dependencies
console.log('📦 Installing dependencies...');
execSync('npm ci --only=production', { stdio: 'inherit' });

// Run build
console.log('🔨 Building application...');
execSync('npm run build', { stdio: 'inherit' });

// Verify build
console.log('✅ Verifying build...');
const buildPath = path.join(__dirname, '..', 'build');
if (!fs.existsSync(buildPath)) {
  console.error('❌ Build failed - build directory not found');
  process.exit(1);
}

const indexPath = path.join(buildPath, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('❌ Build failed - index.html not found');
  process.exit(1);
}

// Get build size
const buildSize = execSync('du -sh build', { encoding: 'utf8' });
console.log(`📊 Build size: ${buildSize.trim()}`);

console.log('🎉 Production build completed successfully!');
console.log('📁 Build directory: ./build');
console.log('🌐 Ready for deployment to Render');
