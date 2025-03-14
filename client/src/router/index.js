import { createRouter, createWebHistory } from 'vue-router';

// Import all views with lazy loading
const Home = () => import('../views/Home.vue');
const Login = () => import('../views/Login.vue');
const Register = () => import('../views/Register.vue');
const SnippetDetail = () => import('../views/SnippetDetail.vue');
const CreateSnippet = () => import('../views/CreateSnippet.vue');
const EditSnippet = () => import('../views/EditSnippet.vue');
const Profile = () => import('../views/Profile.vue');
const NotFound = () => import('../views/NotFound.vue');
const Favorites = () => import('../views/Favorites.vue');

// Checks if user is logged in
const isLoggedIn = () => {
  return localStorage.getItem('token') ? true : false;
};

// List of all app routes
const routes = [
  // Home page - everyone can access
  {
    path: '/',
    name: 'Home',
    component: Home,
  },

  // Login page - only for guests
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true },
  },

  // Register page - only for guests
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guestOnly: true },
  },

  // Snippet details page - everyone can access
  {
    path: '/snippets/:id',
    name: 'SnippetDetail',
    component: SnippetDetail,
  },

  // Create snippet page - only for logged in users
  {
    path: '/create',
    name: 'CreateSnippet',
    component: CreateSnippet,
    meta: { requiresAuth: true },
  },

  // Edit snippet page - only for logged in users
  {
    path: '/edit/:id',
    name: 'EditSnippet',
    component: EditSnippet,
    meta: { requiresAuth: true },
  },

  // User profile page - only for logged in users
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },

  // Favorites page - only for logged in users
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
    meta: {
      requiresAuth: true,
    },
  },

  // 404 page for any routes that don't exist
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

// Create the router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Check user permissions before showing each page
router.beforeEach((to, from, next) => {
  // Check if user is logged in
  const userIsLoggedIn = isLoggedIn();

  // Handle protected pages (pages that require login)
  if (to.meta.requiresAuth && !userIsLoggedIn) {
    // Redirect to login page if trying to access a protected page
    next({ name: 'Login' });
  }
  // Handle guest-only pages
  else if (to.meta.guestOnly && userIsLoggedIn) {
    // Redirects to home page if trying to access a guest-only page
    next({ name: 'Home' });
  }
  // Continue to the requested page if no restrictions apply
  else {
    next();
  }
});

export default router;
