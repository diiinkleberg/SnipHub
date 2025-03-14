<template>
  <div class="snippet-container">
    <!-- Loading spinner -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading snippet...</p>
    </div>

    <!-- Error message -->
    <div v-else-if="error" class="alert alert-error">
      <i class="bi bi-exclamation-triangle"></i>
      {{ error }}
    </div>

    <!-- Not found message -->
    <div v-else-if="!snippet" class="alert alert-warning">
      <i class="bi bi-question-circle"></i>
      Snippet not found.
    </div>

    <!-- Snippet details content -->
    <div v-else class="snippet-detail">
      <!-- Header section with title and actions -->
      <div class="snippet-header">
        <h1 class="snippet-title">{{ snippet.title }}</h1>

        <!-- Action buttons section -->
        <div class="action-buttons">
          <!-- Favorite Button for authenticated users -->
          <FavoriteButton
            v-if="isAuthenticated"
            :snippet-id="snippet._id"
            class="favorite-action" />

          <!-- Edit/Delete buttons for snippet owner -->
          <template v-if="isOwner">
            <router-link :to="`/edit/${snippet._id}`" class="btn btn-edit">
              <i class="bi bi-pencil"></i> Edit
            </router-link>
            <button @click="confirmDelete" class="btn btn-delete">
              <i class="bi bi-trash"></i> Delete
            </button>
          </template>
        </div>
      </div>

      <!-- Metadata panel -->
      <div class="metadata-panel">
        <div class="metadata-item">
          <span class="metadata-label">Language:</span>
          <span class="metadata-value">{{
            snippet.programmingLanguage || snippet.language
          }}</span>
        </div>

        <div class="metadata-item">
          <span class="metadata-label">Created by:</span>
          <span class="metadata-value">{{
            snippet.user?.username || 'Unknown'
          }}</span>
        </div>

        <div class="metadata-item">
          <span class="metadata-label">Created:</span>
          <span class="metadata-value">{{
            formatDate(snippet.createdAt)
          }}</span>
        </div>

        <div
          v-if="snippet.updatedAt !== snippet.createdAt"
          class="metadata-item">
          <span class="metadata-label">Updated:</span>
          <span class="metadata-value">{{
            formatDate(snippet.updatedAt)
          }}</span>
        </div>
      </div>

      <!-- Description section -->
      <div v-if="snippet.description" class="description-section">
        <h4>Description</h4>
        <p>{{ snippet.description }}</p>
      </div>

      <!-- Code display section -->
      <div class="code-card">
        <div class="code-header">
          <span>Code</span>
          <button @click="copyCode" class="btn-copy">
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>
        <div class="code-body">
          <!-- Highlight.js Syntax highlighting -->
          <highlightjs
            :language="snippet.programmingLanguage || snippet.language"
            :code="snippet.code"
            :autodetect="!(snippet.programmingLanguage || snippet.language)" />
        </div>
      </div>

      <!-- Navigation button -->
      <div class="nav-buttons">
        <router-link to="/" class="btn btn-back">
          <i class="bi bi-arrow-left"></i> Back to Snippets
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import FavoriteButton from '@/components/snippets/FavoriteButton.vue';

export default {
  name: 'SnippetDetail',
  components: {
    FavoriteButton,
  },
  setup() {
    // Store, route and router setup
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    // Reactive state
    const copied = ref(false);
    const snippetId = ref(route.params.id);

    // Computed properties
    const snippet = computed(() => store.getters.currentSnippet);
    const isLoading = computed(() => store.state.snippetsLoading);
    const error = computed(() => store.state.snippetsError);
    const currentUser = computed(() => store.getters.currentUser);
    const isAuthenticated = computed(() => store.getters.isAuthenticated);

    // Check if current user is snippet owner
    const isOwner = computed(() => {
      return (
        currentUser.value &&
        snippet.value &&
        snippet.value.user &&
        currentUser.value._id === snippet.value.user._id
      );
    });

    // Format date
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    // Copy code to clipboard
    const copyCode = () => {
      if (snippet.value) {
        navigator.clipboard
          .writeText(snippet.value.code)
          .then(() => {
            copied.value = true;
            setTimeout(() => {
              copied.value = false;
            }, 2000);
          })
          .catch((err) => {
            console.error('Failed to copy: ', err);
          });
      }
    };

    // Delete confirmation
    const confirmDelete = () => {
      if (
        confirm(
          'Are you sure you want to delete this snippet? This action cannot be undone.'
        )
      ) {
        deleteSnippet();
      }
    };

    // Delete the snippet
    const deleteSnippet = async () => {
      if (snippet.value) {
        const success = await store.dispatch(
          'deleteSnippet',
          snippet.value._id
        );
        if (success) {
          router.push('/');
        }
      }
    };

    // Load snippet when component mounts
    onMounted(() => {
      store.dispatch('fetchSnippet', snippetId.value);
    });

    // Return values for template
    return {
      snippet,
      isLoading,
      error,
      isOwner,
      copied,
      formatDate,
      copyCode,
      confirmDelete,
      isAuthenticated,
    };
  },
};
</script>

<style scoped>
.snippet-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

/* Loading state */
.loading-container {
  text-align: center;
  padding: 3rem 0;
}

.spinner {
  display: inline-block;
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

/* Alert messages */
.alert {
  padding: 1rem;
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
}

.alert-error {
  background-color: #f8d7da;
  color: #721c24;
  border-left: 4px solid #dc3545;
}

.alert-warning {
  background-color: #fff3cd;
  color: #856404;
  border-left: 4px solid #ffc107;
}

/* Header section */
.snippet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.snippet-title {
  margin: 0;
  font-size: 1.8rem;
  color: var(--text-dark);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-edit {
  background-color: rgba(74, 107, 255, 0.1);
  color: var(--primary);
}

.btn-edit:hover {
  background-color: var(--primary);
  color: white;
}

.btn-delete {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.btn-delete:hover {
  background-color: #dc3545;
  color: white;
}

/* Metadata section */
.metadata-panel {
  background-color: #f8f9fa;
  padding: 1rem 1.5rem;
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem 2rem;
}

.metadata-item {
  padding: 0.5rem 0;
}

.metadata-label {
  font-weight: 600;
  margin-right: 0.5rem;
  color: var(--text-dark);
}

.metadata-value {
  color: var(--text);
}

/* Description section */
.description-section {
  margin-bottom: 1.5rem;
}

.description-section h4 {
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
  color: var(--text-dark);
}

.description-section p {
  color: var(--text);
  line-height: 1.5;
  white-space: pre-line;
}

/* Code section */
.code-card {
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
  overflow: hidden;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid var(--border);
}

.btn-copy {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-copy:hover {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}

.code-body {
  position: relative;
}

/* Syntax highlighting styles */
:deep(.hljs) {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  padding: 1rem;
  max-height: 500px;
  overflow-y: auto;
}

/* Custom scrollbar */
:deep(.hljs::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

:deep(.hljs::-webkit-scrollbar-thumb) {
  background: #ccc;
  border-radius: 4px;
}

:deep(.hljs::-webkit-scrollbar-thumb:hover) {
  background: #999;
}

:deep(.hljs::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 4px;
}

/* Navigation buttons */
.nav-buttons {
  text-align: center;
  margin-top: 1.5rem;
}

.btn-back {
  background-color: #f8f9fa;
  color: var(--text);
  border: 1px solid var(--border);
}

.btn-back:hover {
  background-color: var(--text-light);
  color: white;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .snippet-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .snippet-title {
    margin-bottom: 1rem;
  }

  .action-buttons {
    width: 100%;
  }

  .btn {
    flex: 1;
    justify-content: center;
  }

  .metadata-panel {
    grid-template-columns: 1fr;
  }

  /* Add this style for the favorite button in the action buttons area */
  .favorite-action {
    margin-right: 0.5rem;
  }

  /* Make sure your action buttons section has enough spacing */
  .action-buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}
</style>
