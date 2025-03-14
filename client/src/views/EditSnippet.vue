<template>
  <div class="edit-snippet">
    <!-- Loading state -->
    <div v-if="isLoading && !snippet" class="loading-container">
      <div class="spinner"></div>
      <p>Loading snippet...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="message error">
      <i class="bi bi-exclamation-triangle"></i>
      {{ error }}
    </div>

    <!-- Not found state -->
    <div v-else-if="!snippet" class="message warning">
      <i class="bi bi-question-circle"></i>
      Snippet not found or you don't have permission to edit it.
    </div>

    <!-- Edit form -->
    <div v-else class="form-wrapper">
      <h1 class="page-title">Edit Snippet</h1>

      <form @submit.prevent="handleSubmit">
        <!-- Title field -->
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" v-model="snippetData.title" required />
        </div>

        <!-- Description field -->
        <div class="form-group">
          <label for="description">Description (optional)</label>
          <textarea
            id="description"
            v-model="snippetData.description"
            rows="3"></textarea>
        </div>

        <!-- Language selection -->
        <div class="form-group">
          <label for="programmingLanguage">Language</label>
          <select
            id="programmingLanguage"
            v-model="snippetData.programmingLanguage"
            required>
            <option value="" disabled>Select a language</option>
            <option v-for="lang in languages" :key="lang" :value="lang">
              {{ lang }}
            </option>
          </select>
        </div>

        <!-- Code editor -->
        <div class="form-group">
          <label for="code">Code</label>
          <div class="code-editor-container">
            <div class="code-actions">
              <button
                type="button"
                class="btn clipboard-btn"
                @click="pasteFromClipboard"
                title="Paste from clipboard">
                <i class="bi bi-clipboard"></i> Paste
              </button>
            </div>
            <textarea
              class="code-editor"
              id="code"
              v-model="snippetData.code"
              rows="10"
              required></textarea>
          </div>
        </div>

        <!-- Form buttons -->
        <div class="button-group">
          <button type="submit" class="btn primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
          </button>

          <router-link :to="`/snippets/${snippetId}`" class="btn secondary">
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'EditSnippet',
  setup() {
    // Store and router setup
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    // Get snippet ID from route parameters
    const snippetId = ref(route.params.id);

    // Form data
    const snippetData = ref({
      title: '',
      description: '',
      programmingLanguage: '',
      code: '',
    });

    // UI state
    const isSubmitting = ref(false);

    // Available programming languages
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
      'other',
    ]);

    // Get data from store
    const snippet = computed(() => store.getters.currentSnippet);
    const isLoading = computed(() => store.state.snippetsLoading);
    const error = computed(() => store.state.snippetsError);
    const currentUser = computed(() => store.getters.currentUser);

    // Check if user can edit this snippet
    const isOwner = computed(() => {
      if (!currentUser.value || !snippet.value || !snippet.value.user) {
        return false;
      }

      const userId = currentUser.value._id;
      const snippetUserId = snippet.value.user._id || snippet.value.user;

      return userId === snippetUserId;
    });

    // Fetch snippet data
    const loadSnippet = async () => {
      await store.dispatch('fetchSnippet', snippetId.value);
    };

    // Paste code from clipboard
    const pasteFromClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          snippetData.value.code = text;
        }
      } catch (error) {
        console.error('Failed to read clipboard contents:', error);
        alert(
          'Could not access clipboard. Please check your browser permissions.'
        );
      }
    };

    // Fill form with snippet data
    const populateForm = () => {
      if (snippet.value) {
        snippetData.value = {
          title: snippet.value.title,
          description: snippet.value.description || '',
          programmingLanguage:
            snippet.value.programmingLanguage || snippet.value.language,
          code: snippet.value.code,
        };
      }
    };

    // Form submission
    const handleSubmit = async () => {
      // Security check
      if (!isOwner.value) {
        return;
      }

      isSubmitting.value = true;

      try {
        // Update snippet
        await store.dispatch('updateSnippet', {
          id: snippetId.value,
          snippetData: snippetData.value,
        });

        // Redirect to snippet page
        router.push(`/snippets/${snippetId.value}`);
      } catch (error) {
        console.error('Failed to update snippet:', error);
      } finally {
        isSubmitting.value = false;
      }
    };

    // Load snippet when component mounts
    onMounted(() => {
      loadSnippet();
    });

    // Watch for snippet data changes
    watch(
      snippet,
      () => {
        if (snippet.value) {
          populateForm();
        }
      },
      { immediate: true }
    );

    // Redirect if not the owner
    watch(isOwner, (newValue) => {
      if (!isLoading.value && snippet.value && !newValue) {
        router.push('/');
      }
    });

    return {
      snippetId,
      snippetData,
      languages,
      snippet,
      isLoading,
      isSubmitting,
      error,
      isOwner,
      handleSubmit,
      pasteFromClipboard,
    };
  },
};
</script>

<style scoped>
.edit-snippet {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
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

/* Message styles */
.message {
  padding: 1rem;
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error {
  background-color: #fdeaea;
  border-left: 4px solid #dc3545;
  color: #dc3545;
}

.warning {
  background-color: #fff8e6;
  border-left: 4px solid #ffc107;
  color: #856404;
}

/* Form styling */
.form-wrapper {
  background-color: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
}

.page-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--text-dark);
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.95rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(74, 107, 255, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

/* Code editor styling */
.code-editor {
  font-family: 'Fira Code', Consolas, Monaco, 'Andale Mono', monospace;
  font-size: 0.9rem;
  tab-size: 2;
  line-height: 1.5;
  background-color: #f8f9fa;
  min-height: 250px;
}

/* Button styles */
.button-group {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.6rem 1.25rem;
  border-radius: var(--radius);
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.primary {
  background-color: var(--primary);
  color: white;
}

.primary:hover:not(:disabled) {
  background-color: #3b5adb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.secondary {
  background-color: #f1f3f5;
  color: var(--text);
  text-decoration: none;
}

.secondary:hover {
  background-color: #e9ecef;
  color: var(--text-dark);
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .button-group {
    flex-direction: column;
  }

  .button-group .btn {
    width: 100%;
    margin-bottom: 0.5rem;
    text-align: center;
  }
}
</style>
