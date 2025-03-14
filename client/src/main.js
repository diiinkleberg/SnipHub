import { createApp } from 'vue';
import App from './App.vue';

import router from './router';
import store from './store';

// Import highlight.js styles
import 'highlight.js/styles/atom-one-dark-reasonable.css';

// Import highlighting for all languages
import 'highlight.js/lib/common';
import hljsVuePlugin from '@highlightjs/vue-plugin';

// Import Bootstrap CSS and JS for UI components and layout
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Initialize Vue app
const app = createApp(App);

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err);
  console.info('Error Info:', info);
};

// Register Vue plugins
app.use(router); // Vue Router for page navigation
app.use(store); // Vuex for state management
app.use(hljsVuePlugin); // Highlight.js for syntax highlighting

// Checks for a user token in local storage
if (localStorage.getItem('token')) {
  store.dispatch('loadUser');
}

// Mount the app to the DOM
app.mount('#app');
