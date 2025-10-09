#!/usr/bin/env node

/**
 * Backend Setup Script
 * Helps set up the backend with proper configuration
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Setting up Backend...\n');

const backendDir = path.join(__dirname, 'BackEnd');

// Check if BackEnd directory exists
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

// Create .env file if it doesn't exist
const envPath = path.join(backendDir, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here_${Math.random().toString(36).substring(2, 15)}

# CORS Configuration
FRONTEND_URL=http://localhost:5173
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created');
  console.log('⚠️  Please update the Supabase configuration in BackEnd/.env');
} else {
  console.log('✅ .env file already exists');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { 
    cwd: backendDir, 
    stdio: 'inherit' 
  });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Check if database setup is needed
console.log('\n🗄️  Checking database setup...');
const setupDbPath = path.join(backendDir, 'setup-database.js');
if (fs.existsSync(setupDbPath)) {
  console.log('📊 Database setup script found');
  console.log('⚠️  You may need to run: cd BackEnd && npm run setup-db');
}

console.log('\n🚀 Backend setup complete!');
console.log('\nNext steps:');
console.log('1. Update BackEnd/.env with your Supabase credentials');
console.log('2. Run: cd BackEnd && npm run dev');
console.log('3. Check: http://localhost:5000/api/health');
console.log('4. Refresh your frontend page');

console.log('\n🔍 If you still get errors:');
console.log('- Check the backend console for error messages');
console.log('- Verify Supabase credentials are correct');
console.log('- Make sure port 5000 is not used by another service');
console.log('- Check firewall settings');
