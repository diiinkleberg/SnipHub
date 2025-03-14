require('dotenv').config({ path: '../.env' });

// Get ports from env file or use defaults
const API_PORT = process.env.API_PORT || 5000;
const CLIENT_PORT = process.env.CLIENT_PORT || 3000;

// Wait a bit to make sure servers have started
setTimeout(() => {
  console.log('\n');
  console.log('='.repeat(60));
  console.log('🚀 SnipHub is now running!');
  console.log('='.repeat(60));
  console.log('');
  console.log('📡 API Server:          http://localhost:%d/', API_PORT);
  console.log('🔍 Swagger Documentation: http://localhost:%d/api-docs', API_PORT);
  console.log('🖥️ Client Application:   http://localhost:%d/', CLIENT_PORT);
  console.log('');
  console.log('='.repeat(60));
  console.log('');
}, 2000);