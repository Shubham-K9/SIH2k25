#!/usr/bin/env node

/**
 * Backend Connection Test Script
 * Tests if the backend is running and accessible
 */

const http = require('http');

const BACKEND_URL = 'http://localhost:5000';
const HEALTH_ENDPOINT = '/api/health';

console.log('🔍 Testing Backend Connection...\n');

// Test 1: Check if backend is running
function testBackendHealth() {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BACKEND_URL}${HEALTH_ENDPOINT}`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({
            status: 'success',
            statusCode: res.statusCode,
            data: response
          });
        } catch (error) {
          resolve({
            status: 'error',
            statusCode: res.statusCode,
            data: data,
            error: error.message
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject({
        status: 'error',
        error: error.message,
        code: error.code
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject({
        status: 'error',
        error: 'Request timeout',
        code: 'TIMEOUT'
      });
    });
  });
}

// Test 2: Check if port 5000 is available
function testPortAvailability() {
  return new Promise((resolve) => {
    const server = http.createServer();
    
    server.listen(5000, (err) => {
      if (err) {
        resolve({
          available: false,
          error: err.message
        });
      } else {
        server.close();
        resolve({
          available: true
        });
      }
    });
    
    server.on('error', (err) => {
      resolve({
        available: false,
        error: err.message
      });
    });
  });
}

async function runTests() {
  console.log('1️⃣ Testing if port 5000 is available...');
  const portTest = await testPortAvailability();
  
  if (portTest.available) {
    console.log('✅ Port 5000 is available');
  } else {
    console.log('❌ Port 5000 is not available:', portTest.error);
    console.log('   This might mean the backend is already running or another service is using the port.\n');
  }
  
  console.log('2️⃣ Testing backend health endpoint...');
  try {
    const healthTest = await testBackendHealth();
    
    if (healthTest.status === 'success') {
      console.log('✅ Backend is running and responding');
      console.log(`   Status Code: ${healthTest.statusCode}`);
      console.log(`   Response: ${JSON.stringify(healthTest.data, null, 2)}`);
    } else {
      console.log('❌ Backend responded with error');
      console.log(`   Status Code: ${healthTest.statusCode}`);
      console.log(`   Response: ${healthTest.data}`);
    }
  } catch (error) {
    console.log('❌ Backend is not running or not accessible');
    console.log(`   Error: ${error.error}`);
    console.log(`   Code: ${error.code}`);
    
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('1. Make sure you\'re in the BackEnd directory');
    console.log('2. Run: npm install');
    console.log('3. Check if .env file exists and is configured');
    console.log('4. Run: npm run dev');
    console.log('5. Check for any error messages in the backend console');
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. If backend is not running, start it with: cd BackEnd && npm run dev');
  console.log('2. If backend is running but frontend can\'t connect, check CORS settings');
  console.log('3. If you see CORS errors, make sure FRONTEND_URL is set in .env');
  console.log('4. Try refreshing the frontend page after starting the backend');
}

runTests().catch(console.error);



