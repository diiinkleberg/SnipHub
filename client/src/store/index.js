import { createStore } from 'vuex';
import axios from 'axios';

// Simple API configuration
const API_URL = '/api'; // Uses Vite's proxy

// Create a basic API client
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

// Main store setup
export default createStore({
  // State
  state() {
    return {
      // User info
      user: null,
      isAuthenticated: false,
      authLoading: false,
      authError: null,

      // Snippets list and current snippet
      snippets: [],
      currentSnippet: null,
      snippetsLoading: false,
      snippetsError: null,

      // User's favorite snippets
      favorites: [],
      favoritesLoading: false,
      favoritesError: null,
    };
  },

  // Getters
  getters: {
    // User getters
    isAuthenticated: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
    authError: (state) => state.authError,

    // Snippet getters
    allSnippets: (state) => state.snippets,
    currentSnippet: (state) => state.currentSnippet,
    snippetsLoading: (state) => state.snippetsLoading,

    // Favorites getters
    userFavorites: (state) => state.favorites,
    isFavorite: (state) => (snippetId) => {
      return state.favorites.some((snippet) => snippet._id === snippetId);
    },
  },

  // Mutations
  mutations: {
    // Auth mutations
    SET_AUTH_LOADING(state, loading) {
      state.authLoading = loading;
    },
    SET_AUTH_ERROR(state, error) {
      state.authError = error;
    },
    SET_USER(state, user) {
      state.user = user;
      state.isAuthenticated = !!user; // true if user exists
    },

    // Snippet mutations
    SET_SNIPPETS_LOADING(state, loading) {
      state.snippetsLoading = loading;
    },
    SET_SNIPPETS_ERROR(state, error) {
      state.snippetsError = error;
    },
    SET_SNIPPETS(state, snippets) {
      state.snippets = snippets;
    },
    SET_CURRENT_SNIPPET(state, snippet) {
      state.currentSnippet = snippet;
    },
    ADD_SNIPPET(state, snippet) {
      state.snippets.unshift(snippet); // Add new snippet at the beginning
    },
    UPDATE_SNIPPET(state, updatedSnippet) {
      // Find and update snippet in the list
      const index = state.snippets.findIndex(
        (s) => s._id === updatedSnippet._id
      );
      if (index !== -1) {
        state.snippets.splice(index, 1, updatedSnippet);
      }

      // Update current snippet if it's the same one
      if (
        state.currentSnippet &&
        state.currentSnippet._id === updatedSnippet._id
      ) {
        state.currentSnippet = updatedSnippet;
      }
    },
    REMOVE_SNIPPET(state, id) {
      // Remove from list
      state.snippets = state.snippets.filter((snippet) => snippet._id !== id);

      // Clear current snippet if deleted
      if (state.currentSnippet && state.currentSnippet._id === id) {
        state.currentSnippet = null;
      }
    },

    // Favorites mutations
    SET_FAVORITES_LOADING(state, loading) {
      state.favoritesLoading = loading;
    },
    SET_FAVORITES_ERROR(state, error) {
      state.favoritesError = error;
    },
    SET_FAVORITES(state, favorites) {
      state.favorites = favorites;
    },
    ADD_FAVORITE(state, snippet) {
      state.favorites.push(snippet);
    },
    REMOVE_FAVORITE(state, snippetId) {
      state.favorites = state.favorites.filter(
        (snippet) => snippet._id !== snippetId
      );
    },
  },

  // Actions  - commit mutations and handle async operations
  actions: {
    // Auth actions

    // Sign up a new user
    async register({ commit, dispatch }, userData) {
      // Start loading
      commit('SET_AUTH_LOADING', true);
      commit('SET_AUTH_ERROR', null);

      try {
        // Send registration request
        const response = await api.post('/auth/register', userData);
        const { token } = response.data;

        // Save login token
        localStorage.setItem('token', token);

        // Get user data
        await dispatch('loadUser');

        return true; // Success
      } catch (error) {
        // Handle error
        const message = error.response?.data?.message || 'Registration failed';
        commit('SET_AUTH_ERROR', message);
        return false;
      } finally {
        // Stop loading
        commit('SET_AUTH_LOADING', false);
      }
    },

    // Log in existing user
    async login({ commit, dispatch }, credentials) {
      // Start loading
      commit('SET_AUTH_LOADING', true);
      commit('SET_AUTH_ERROR', null);

      try {
        // Send login request
        const response = await api.post('/auth/login', credentials);
        const { token } = response.data;

        // Save login token
        localStorage.setItem('token', token);

        // Get user data
        await dispatch('loadUser');

        return true;
      } catch (error) {
        // Handle error
        const message = error.response?.data?.message || 'Login failed';
        commit('SET_AUTH_ERROR', message);
        return false; // Failed
      } finally {
        // Stop loading
        commit('SET_AUTH_LOADING', false);
      }
    },

    // Get current user data
    async loadUser({ commit }) {
      commit('SET_AUTH_LOADING', true);

      try {
        // Get user profile
        const response = await api.get('/auth/me');
        commit('SET_USER', response.data);
      } catch (error) {
        // Handle error - clear user data
        console.error('Failed to load user', error);
        commit('SET_USER', null);
        localStorage.removeItem('token');
      } finally {
        commit('SET_AUTH_LOADING', false);
      }
    },

    // Log out user
    logout({ commit }) {
      // Remove token and user data
      localStorage.removeItem('token');
      commit('SET_USER', null);
    },

    // Snippet actions

    // Get list of snippets
    async fetchSnippets({ commit }, filters = {}) {
      commit('SET_SNIPPETS_LOADING', true);

      try {
        // Create URL parameters
        const params = new URLSearchParams();

        // Add filters to URL if provided
        if (filters.language || filters.programmingLanguage) {
          params.append(
            'language',
            filters.programmingLanguage || filters.language
          );
        }
        if (filters.search) params.append('search', filters.search);
        if (filters.userId) params.append('userId', filters.userId);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);

        // Build URL with parameters
        const queryStr = params.toString() ? `?${params.toString()}` : '';

        // Get snippets from API
        const response = await api.get(`/snippets${queryStr}`);
        commit('SET_SNIPPETS', response.data);
      } catch (error) {
        console.error('Error fetching snippets:', error);
        commit('SET_SNIPPETS_ERROR', 'Failed to load snippets');
      } finally {
        commit('SET_SNIPPETS_LOADING', false);
      }
    },

    // Get a single snippet by ID
    async fetchSnippet({ commit }, id) {
      commit('SET_SNIPPETS_LOADING', true);

      try {
        // Get snippet details
        const response = await api.get(`/snippets/${id}`);
        commit('SET_CURRENT_SNIPPET', response.data);
      } catch (error) {
        console.error('Error fetching snippet:', error);
        commit('SET_SNIPPETS_ERROR', 'Failed to load snippet');
        commit('SET_CURRENT_SNIPPET', null);
      } finally {
        commit('SET_SNIPPETS_LOADING', false);
      }
    },

    // Create a new snippet
    async createSnippet({ commit }, snippetData) {
      commit('SET_SNIPPETS_LOADING', true);

      try {
        // Handle language field inconsistency
        if (snippetData.language && !snippetData.programmingLanguage) {
          snippetData.programmingLanguage = snippetData.language;
          delete snippetData.language;
        }

        // Send create request
        const response = await api.post('/snippets', snippetData);
        commit('ADD_SNIPPET', response.data);
        return response.data;
      } catch (error) {
        console.error('Error creating snippet:', error);
        commit('SET_SNIPPETS_ERROR', 'Failed to create snippet');
        throw error;
      } finally {
        commit('SET_SNIPPETS_LOADING', false);
      }
    },

    // Update an existing snippet
    async updateSnippet({ commit }, { id, snippetData }) {
      commit('SET_SNIPPETS_LOADING', true);

      try {
        // Handle language field inconsistency
        if (snippetData.language && !snippetData.programmingLanguage) {
          snippetData.programmingLanguage = snippetData.language;
          delete snippetData.language;
        }

        // Send update request
        const response = await api.put(`/snippets/${id}`, snippetData);
        commit('UPDATE_SNIPPET', response.data);
        return response.data;
      } catch (error) {
        console.error('Error updating snippet:', error);
        commit('SET_SNIPPETS_ERROR', 'Failed to update snippet');
        throw error;
      } finally {
        commit('SET_SNIPPETS_LOADING', false);
      }
    },

    // Delete a snippet
    async deleteSnippet({ commit }, id) {
      commit('SET_SNIPPETS_LOADING', true);

      try {
        // Send delete request
        await api.delete(`/snippets/${id}`);
        commit('REMOVE_SNIPPET', id);
        return true;
      } catch (error) {
        console.error('Error deleting snippet:', error);
        commit('SET_SNIPPETS_ERROR', 'Failed to delete snippet');
        return false;
      } finally {
        commit('SET_SNIPPETS_LOADING', false);
      }
    },

    // Get all snippets by a specific user
    async fetchUserSnippets({ commit }, userId) {
      commit('SET_SNIPPETS_LOADING', true);

      try {
        const response = await api.get(`/users/${userId}/snippets`);
        commit('SET_SNIPPETS', response.data);
      } catch (error) {
        console.error('Error fetching user snippets:', error);
        commit('SET_SNIPPETS_ERROR', 'Failed to load user snippets');
      } finally {
        commit('SET_SNIPPETS_LOADING', false);
      }
    },

    // Fetch user's favorite snippets
    async fetchFavorites({ commit }) {
      try {
        commit('SET_FAVORITES_LOADING', true);
        commit('SET_FAVORITES_ERROR', null);

        const response = await api.get('/users/favorites');
        commit('SET_FAVORITES', response.data);

        return response.data;
      } catch (error) {
        console.error('Favorites error:', error.response || error);
        const message =
          error.response?.data?.message || 'Failed to fetch favorites';
        commit('SET_FAVORITES_ERROR', message);
        throw error; // Re-throw so component can handle it
      } finally {
        commit('SET_FAVORITES_LOADING', false);
      }
    },

    // In the addToFavorites action
    async addToFavorites({ commit }, snippetId) {
      try {
        const response = await api.post(`/users/favorites/${snippetId}`);

        // Get the complete snippet object to add to favorites
        const snippetResponse = await api.get(`/snippets/${snippetId}`);
        commit('ADD_FAVORITE', snippetResponse.data);

        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to add to favorites';
      }
    },

    // In the removeFromFavorites action
    async removeFromFavorites({ commit }, snippetId) {
      try {
        await api.delete(`/users/favorites/${snippetId}`);
        commit('REMOVE_FAVORITE', snippetId);
      } catch (error) {
        throw (
          error.response?.data?.message || 'Failed to remove from favorites'
        );
      }
    },
  },
});
