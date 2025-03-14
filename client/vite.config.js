import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// Project configuration for the Vite build tool
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, path.resolve(__dirname, '..'),'');

  // Check if environment variables are defined
  console.log('Environment variables loaded:', {
    VITE_API_BASE_URL: env.VITE_API_BASE_URL ? 'defined' : 'undefined',
    VITE_CLIENT_PORT: env.VITE_CLIENT_PORT
  });
  
  return {
    // Enable Vue.js support
    plugins: [vue()],
    resolve: {
      alias: {
        // Enable '@' to point to the src directory for cleaner imports
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // Set Port for the Vite server
      port: parseInt(env.VITE_CLIENT_PORT) || 3000,
      proxy: {
        // Proxy API requests to backend
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
  };
});