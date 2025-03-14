<template>
  <div class="home-container">
    <div class="header-section">
      <h1 class="page-title">Code Snippets</h1>
      <p class="user-info">
        <i class="bi bi-person-circle"></i> {{ username }} |
        <i class="bi bi-calendar3"></i> {{ formattedDate }}
      </p>
    </div>

    <!-- Language Filter -->
    <div class="filter-card">
      <div class="filter-content">
        <div class="filter-header">
          <i class="bi bi-funnel-fill"></i>
          <span>Filter by Language</span>
        </div>
        <div class="filter-control">
          <select
            class="language-select"
            v-model="selectedLanguage"
            @change="handleSearch">
            <option value="">All Languages</option>
            <option v-for="lang in languages" :key="lang" :value="lang">
              {{ lang }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading snippets...</p>
    </div>

    <!-- Error Message -->
    <div v-else-if="error" class="alert error-alert">
      <i class="bi bi-exclamation-triangle"></i>
      <span>{{ error }}</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="snippets.length === 0" class="empty-state">
      <i class="bi bi-code-slash"></i>
      <p>No snippets found.</p>
      <div class="empty-state-action">
        <template v-if="isAuthenticated">
          <router-link to="/create" class="btn create-btn">
            <i class="bi bi-plus-circle"></i> Create your first snippet!
          </router-link>
        </template>
        <template v-else>
          <router-link to="/login" class="btn login-btn">
            <i class="bi bi-box-arrow-in-right"></i> Login
          </router-link>
          <span class="mx-2">to create snippets.</span>
        </template>
      </div>
    </div>

    <!-- Snippets Grid -->
    <div v-else class="snippets-grid">
      <div v-for="snippet in snippets" :key="snippet._id" class="snippet-item">
        <SnippetCard :snippet="snippet" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import SnippetCard from '@/components/snippets/SnippetCard.vue';

export default {
  components: {
    SnippetCard,
  },
  setup() {
    // Core setup
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    // User and date info
    const currentUser = computed(() => store.getters.currentUser);
    const username = computed(() =>
      currentUser.value ? currentUser.value.username : 'Guest'
    );

    const now = new Date();
    const currentDate = computed(() => {
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      return now.toLocaleString(undefined, options);
    });

    // Format date for display
    const formattedDate = computed(() => {
      if (!currentDate.value) return '';
      return currentDate.value.split(',')[0];
    });

    // Filter state
    const selectedLanguage = ref('');
    const languages = ref([
      'javascript',
      'typescript',
      'python',
      'java',
      'csharp',
      'c',
      'cpp',
      'go',
      'rust',
      'swift',
      'kotlin',
      'php',
      'ruby',
      'html',
      'css',
      'scss',
      'sql',
      'postgresql',
      'mysql',
      'mongodb',
      'bash',
      'powershell',
      'yaml',
      'json',
      'xml',
      'markdown',
      'r',
      'matlab',
      'perl',
      'scala',
      'haskell',
      'lua',
      'dart',
      'objectivec',
      'vba',
      'assembly',
      'elixir',
      'clojure',
      'groovy',
      'other'
    ]);

    // App state from store
    const snippets = computed(() => store.getters.allSnippets);
    const isLoading = computed(() => store.state.snippetsLoading);
    const error = computed(() => store.state.snippetsError);
    const isAuthenticated = computed(() => store.getters.isAuthenticated);

    // Initialize language filter from URL
    if (route.query.language) {
      selectedLanguage.value = route.query.language;
    }

    // Handle search/filter changes
    const handleSearch = () => {
      const filters = {};

      // Collect filters from query and selected language
      if (route.query.search) filters.search = route.query.search;
      if (selectedLanguage.value) filters.language = selectedLanguage.value;

      // Update URL with filters
      router.push({
        path: '/',
        query: {
          ...route.query,
          language: selectedLanguage.value || undefined,
        },
      });

      // Fetch filtered snippets
      store.dispatch('fetchSnippets', filters);
    };

    // Watch for URL query changes
    watch(
      () => route.query,
      (newQuery) => {
        // Update language filter if URL changed
        if (newQuery.language !== selectedLanguage.value) {
          selectedLanguage.value = newQuery.language || '';
        }

        // Build filters from query
        const filters = {};
        if (newQuery.search) filters.search = newQuery.search;
        if (newQuery.language) filters.language = newQuery.language;

        // Fetch snippets with new filters
        store.dispatch('fetchSnippets', filters);
      }
    );

    // Load snippets when page loads
    onMounted(() => {
      handleSearch();
    });

    // Expose data to template
    return {
      username,
      formattedDate,
      selectedLanguage,
      languages,
      snippets,
      isLoading,
      error,
      isAuthenticated,
      handleSearch,
    };
  },
};
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

/* Header styling */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border);
}

.page-title {
  font-size: 1.8rem;
  color: var(--text-dark);
  margin: 0;
}

.user-info {
  color: var(--text-light);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.user-info i {
  font-size: 1rem;
}

/* Filter card styling */
.filter-card {
  background-color: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 1.5rem;
}

.filter-content {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--text-dark);
}

.filter-control {
  width: 250px;
}

.language-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background-color: white;
  font-size: 0.95rem;
}

.language-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(74, 107, 255, 0.1);
}

/* Loading state */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(74, 107, 255, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Alerts */
.alert {
  padding: 1rem;
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

.error-alert {
  background-color: #fdeaea;
  border-left: 4px solid #dc3545;
  color: #dc3545;
}

.error-alert i {
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background-color: #f8f9fa;
  border-radius: var(--radius);
}

.empty-state i {
  font-size: 3rem;
  color: var(--text-light);
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.2rem;
  color: var(--text);
  margin-bottom: 1.5rem;
}

.empty-state-action {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-size: 0.95rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.create-btn {
  background-color: var(--primary);
  color: white;
}

.create-btn:hover {
  background-color: #3b5adb;
  transform: translateY(-1px);
}

.login-btn {
  background-color: var(--primary);
  color: white;
}

.login-btn:hover {
  background-color: #3b5adb;
  transform: translateY(-1px);
}

/* Snippets grid */
.snippets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.snippet-item {
  min-height: 100%;
  transition: transform 0.2s;
}

.snippet-item:hover {
  transform: translateY(-3px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .user-info {
    margin-top: 0.5rem;
  }

  .filter-content {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-header {
    margin-bottom: 0.75rem;
  }

  .filter-control {
    width: 100%;
  }

  .snippets-grid {
    grid-template-columns: 1fr;
  }
}
</style>
