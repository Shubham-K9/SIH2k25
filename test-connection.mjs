// Test connection to backend using built-in fetch

async function testConnection() {
  try {
    console.log('Testing backend connection...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test search endpoint
    const searchResponse = await fetch('http://localhost:5000/api/codes/search?q=back');
    const searchData = await searchResponse.json();
    console.log('✅ Search test:', searchData);
    
    console.log('\n🎉 Backend is working! You can now refresh your frontend.');
    
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    console.log('\n🔧 Try running: cd BackEnd && node server-simple.js');
    console.log('Or check if port 5000 is available: netstat -ano | findstr :5000');
  }
}

testConnection();
