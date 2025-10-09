#!/usr/bin/env node

/**
 * Backend Startup Script
 * Helps start the backend server with proper configuration
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting CodeVeda Backend Server...\n');

// Check if BackEnd directory exists
const backendDir = path.join(__dirname, 'BackEnd');
if (!fs.existsSync(backendDir)) {
  console.error('❌ BackEnd directory not found!');
  console.error('Please ensure the BackEnd folder is in the project root.');
  process.exit(1);
}

// Check if package.json exists
const packageJsonPath = path.join(backendDir, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ BackEnd/package.json not found!');
  console.error('Please ensure the backend is properly set up.');
  process.exit(1);
}

// Check if .env file exists
const envPath = path.join(backendDir, '.env');
if (!fs.existsSync(envPath)) {
  console.warn('⚠️  BackEnd/.env file not found!');
  console.warn('Please create a .env file with the following variables:');
  console.warn(`
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
  `);
  console.warn('The server will start but may not function properly without proper configuration.\n');
}

// Start the backend server
console.log('📦 Installing dependencies...');
const install = spawn('npm', ['install'], { 
  cwd: backendDir, 
  stdio: 'inherit',
  shell: true 
});

install.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
  }

  console.log('\n🔧 Starting development server...');
  const server = spawn('npm', ['run', 'dev'], { 
    cwd: backendDir, 
    stdio: 'inherit',
    shell: true 
  });

  server.on('close', (code) => {
    if (code !== 0) {
      console.error('❌ Backend server exited with code', code);
    } else {
      console.log('✅ Backend server stopped');
    }
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping backend server...');
    server.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Stopping backend server...');
    server.kill('SIGTERM');
  });
});

install.on('error', (err) => {
  console.error('❌ Error installing dependencies:', err);
  process.exit(1);
});



