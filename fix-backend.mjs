#!/usr/bin/env node

/**
 * Backend Fix Script (ES Module Version)
 * Comprehensive fix for backend connection issues
 */

import fs from 'fs';
import path from 'path';
import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Fixing Backend Connection Issues...\n');

const backendDir = path.join(__dirname, 'BackEnd');

// Step 1: Check if BackEnd directory exists
if (!fs.existsSync(backendDir)) {
  console.error('❌ BackEnd directory not found!');
  console.error('Please ensure the BackEnd folder is in the project root.');
  process.exit(1);
}

// Step 2: Create a minimal working .env file
console.log('📝 Creating minimal .env file...');
const envPath = path.join(backendDir, '.env');
const minimalEnvContent = `# Minimal configuration for testing
PORT=5000
NODE_ENV=development
JWT_SECRET=test_jwt_secret_${Math.random().toString(36).substring(2, 15)}

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Supabase Configuration (replace with your actual values)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
`;

fs.writeFileSync(envPath, minimalEnvContent);
console.log('✅ .env file created with minimal configuration');

// Step 3: Create a simplified server.js for testing
console.log('🔧 Creating simplified server for testing...');
const simplifiedServerContent = `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Mock codes endpoint for testing
app.get('/api/codes/search', (req, res) => {
  const { q } = req.query;
  
  // Mock data for testing
  const mockResults = [
    {
      id: '1',
      namaste_code: 'NAMASTE001',
      namaste_label: 'Back Pain',
      namaste_description: 'Pain in the back region',
      icd11_code: 'ME84.0',
      icd11_label: 'Back pain',
      icd11_description: 'Pain in the back',
      category: 'Musculoskeletal',
      ayush_system: 'Ayurveda',
      confidence_score: 0.95,
      is_active: true
    },
    {
      id: '2',
      namaste_code: 'NAMASTE002',
      namaste_label: 'Headache',
      namaste_description: 'Pain in the head',
      icd11_code: 'ME84.1',
      icd11_label: 'Headache',
      icd11_description: 'Pain in the head',
      category: 'Neurological',
      ayush_system: 'Ayurveda',
      confidence_score: 0.90,
      is_active: true
    },
    {
      id: '3',
      namaste_code: 'NAMASTE003',
      namaste_label: 'Diabetes',
      namaste_description: 'High blood sugar levels',
      icd11_code: '5A10',
      icd11_label: 'Type 1 diabetes mellitus',
      icd11_description: 'Type 1 diabetes mellitus',
      category: 'Endocrine',
      ayush_system: 'Ayurveda',
      confidence_score: 0.88,
      is_active: true
    },
    {
      id: '4',
      namaste_code: 'NAMASTE004',
      namaste_label: 'Hypertension',
      namaste_description: 'High blood pressure',
      icd11_code: 'BA00',
      icd11_label: 'Essential hypertension',
      icd11_description: 'Essential hypertension',
      category: 'Cardiovascular',
      ayush_system: 'Ayurveda',
      confidence_score: 0.92,
      is_active: true
    },
    {
      id: '5',
      namaste_code: 'NAMASTE005',
      namaste_label: 'Knee Pain',
      namaste_description: 'Pain in the knee joint',
      icd11_code: 'ME84.2',
      icd11_label: 'Knee pain',
      icd11_description: 'Pain in the knee',
      category: 'Musculoskeletal',
      ayush_system: 'Ayurveda',
      confidence_score: 0.87,
      is_active: true
    },
    {
      id: '6',
      namaste_code: 'NAMASTE006',
      namaste_label: 'Fever',
      namaste_description: 'Elevated body temperature',
      icd11_code: 'MD11',
      icd11_label: 'Fever',
      icd11_description: 'Elevated body temperature',
      category: 'General',
      ayush_system: 'Ayurveda',
      confidence_score: 0.85,
      is_active: true
    }
  ].filter(item => 
    !q || 
    item.namaste_label.toLowerCase().includes(q.toLowerCase()) ||
    item.namaste_code.toLowerCase().includes(q.toLowerCase()) ||
    item.icd11_label.toLowerCase().includes(q.toLowerCase())
  );

  res.json({
    message: 'Search completed successfully',
    results: mockResults,
    count: mockResults.length,
    query: { search: q, limit: 10 }
  });
});

// Mock categories endpoint
app.get('/api/codes/categories', (req, res) => {
  res.json({
    message: 'Categories retrieved successfully',
    data: ['Musculoskeletal', 'Neurological', 'Endocrine', 'Cardiovascular', 'General']
  });
});

// Mock AYUSH systems endpoint
app.get('/api/codes/ayush-systems', (req, res) => {
  res.json({
    message: 'AYUSH systems retrieved successfully',
    data: ['Ayurveda', 'Yoga', 'Naturopathy', 'Homeopathy', 'Siddha', 'Unani']
  });
});

// Start server
app.listen(PORT, () => {
  console.log(\`🚀 Simplified Backend Server running on port \${PORT}\`);
  console.log(\`📊 Environment: \${process.env.NODE_ENV || 'development'}\`);
  console.log(\`🏥 Health check: http://localhost:\${PORT}/api/health\`);
  console.log(\`🔍 Test search: http://localhost:\${PORT}/api/codes/search?q=back\`);
});

export default app;
`;

const simplifiedServerPath = path.join(backendDir, 'server-simple.js');
fs.writeFileSync(simplifiedServerPath, simplifiedServerContent);
console.log('✅ Simplified server created');

// Step 4: Update package.json to include the simplified server
console.log('📦 Updating package.json...');
const packageJsonPath = path.join(backendDir, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

packageJson.scripts = {
  ...packageJson.scripts,
  'dev:simple': 'node server-simple.js',
  'start:simple': 'node server-simple.js'
};

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('✅ Package.json updated');

// Step 5: Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { 
    cwd: backendDir, 
    stdio: 'inherit' 
  });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  console.log('Trying with --force...');
  try {
    execSync('npm install --force', { 
      cwd: backendDir, 
      stdio: 'inherit' 
    });
    console.log('✅ Dependencies installed with --force');
  } catch (forceError) {
    console.error('❌ Still failed to install dependencies');
    console.log('Please run manually: cd BackEnd && npm install');
  }
}

console.log('\n🎉 Backend fix complete!');
console.log('\n📋 Next steps:');
console.log('1. Test the simplified backend:');
console.log('   cd BackEnd && npm run dev:simple');
console.log('2. Check if it works: http://localhost:5000/api/health');
console.log('3. Test search: http://localhost:5000/api/codes/search?q=back');
console.log('4. Refresh your frontend page');

console.log('\n🔍 If the simplified backend works:');
console.log('- The issue was with the original server configuration');
console.log('- You can now configure the full backend with Supabase');
console.log('- Or continue using the simplified version for testing');

console.log('\n🚨 If it still doesn\'t work:');
console.log('- Check if port 5000 is available: lsof -i :5000');
console.log('- Try a different port by changing PORT in .env');
console.log('- Check firewall settings');
console.log('- Make sure Node.js is installed: node --version');
