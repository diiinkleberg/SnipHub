<template>
  <div class="favorites-view">
    <h1 class="page-title">
      <i class="bi bi-heart-fill" style="color: #dc3545"></i> My Favorites
    </h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading favorites...</p>
    </div>

    <!-- Error Message -->
    <div v-else-if="error" class="error-alert">
      <i class="bi bi-exclamation-triangle"></i>
      <span>{{ error }}</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="favorites.length === 0" class="empty-state">
      <i class="bi bi-heart"></i>
      <p>You don't have any favorite snippets yet.</p>
      <div class="empty-state-action">
        <router-link to="/" class="btn primary-btn">
          <i class="bi bi-search"></i> Browse Snippets
        </router-link>
      </div>
    </div>

    <!-- Favorites Grid -->
    <div v-else class="favorites-grid">
      <div v-for="snippet in favorites" :key="snippet._id" class="snippet-item">
        <SnippetCard :snippet="snippet" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import SnippetCard from '@/components/snippets/SnippetCard.vue';

export default {
  name: 'FavoritesView',
  components: {
    SnippetCard,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    // State
    const isLoading = computed(() => store.state.favoritesLoading);
    const error = computed(() => store.state.favoritesError);
    const favorites = computed(() => store.state.favorites || []);

    // Load favorites on mount
    onMounted(async () => {
      // Check if authenticated
      if (!store.getters.isAuthenticated) {
        router.push('/login');
        return;
      }

      try {
        await store.dispatch('fetchFavorites');
      } catch (err) {
        console.error('Failed to load favorites:', err);
      }
    });

    return {
      isLoading,
      error,
      favorites,
    };
  },
};
</script>

<style scoped>
.favorites-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  color: var(--text-dark);
  font-size: 1.8rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(74, 107, 255, 0.2);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #fdeaea;
  color: #dc3545;
  padding: 1rem;
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--text-light);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state-action {
  margin-top: 1.5rem;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.primary-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}

.primary-btn:hover {
  background: #3b5adb;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error-alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #fdeaea;
  color: #dc3545;
  padding: 1rem;
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
}
</style>
