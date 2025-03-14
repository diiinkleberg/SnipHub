<template>
  <div class="create-snippet">
    <div class="snippet-form-container">
      <h1 class="page-title">Create New Snippet</h1>

      <!-- Error message display -->
      <div v-if="error" class="error-message">
        <i class="bi bi-exclamation-triangle"></i>
        <span>{{ error }}</span>
      </div>

      <!-- Snippet creation form -->
      <form @submit.prevent="handleSubmit" class="snippet-form">
        <!-- Title field -->
        <div class="form-field">
          <label for="title">Title</label>
          <input
            type="text"
            id="title"
            v-model="snippetData.title"
            required
            placeholder="Enter a descriptive title" />
        </div>

        <!-- Description field (optional) -->
        <div class="form-field">
          <label for="description"
            >Description <span class="optional">(optional)</span></label
          >
          <textarea
            id="description"
            v-model="snippetData.description"
            rows="3"
            placeholder="Explain what this code does"></textarea>
        </div>

        <!-- Language selection -->
        <div class="form-field">
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
        <div class="form-actions">
          <button type="submit" class="btn primary-btn" :disabled="isLoading">
            <i class="bi bi-plus-circle"></i>
            {{ isLoading ? 'Creating...' : 'Create Snippet' }}
          </button>

          <router-link to="/" class="btn secondary-btn">
            <i class="bi bi-x"></i>
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'CreateSnippet',
  setup() {
    // Store and router initialization
    const store = useStore();
    const router = useRouter();

    // Form data initialization
    const snippetData = ref({
      title: '',
      description: '',
      programmingLanguage: 'javascript', // Default language
      code: '',
    });

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

    // Status tracking
    const isLoading = computed(() => store.state.snippetsLoading);
    const error = computed(() => store.state.snippetsError);

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

    // Handle form submission
    const handleSubmit = async () => {
      try {
        // Create snippet through Vuex store
        const result = await store.dispatch('createSnippet', snippetData.value);

        // Navigate to the new snippet's page
        router.push(`/snippets/${result._id}`);
      } catch (err) {
        console.error('Failed to create snippet:', err);
      }
    };

    // Return values for template
    return {
      snippetData,
      languages,
      isLoading,
      error,
      handleSubmit,
      pasteFromClipboard,
    };
  },
};
</script>

<style scoped>
/* Container styling */
.create-snippet {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

/* Form container */
.snippet-form-container {
  background-color: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 2rem;
}

/* Page title */
.page-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--text-dark);
  border-bottom: 2px solid var(--border);
  padding-bottom: 0.5rem;
}

/* Error message */
.error-message {
  background-color: #fdeaea;
  color: #dc3545;
  border-left: 4px solid #dc3545;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
}

.error-message i {
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

/* Form styling */
.form-field {
  margin-bottom: 1.5rem;
}

.form-field label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.optional {
  color: var(--text-light);
  font-weight: normal;
  font-size: 0.9em;
}

.form-field input,
.form-field textarea,
.form-field select {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.95rem;
  background-color: #fff;
}

.form-field input:focus,
.form-field textarea:focus,
.form-field select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(74, 107, 255, 0.1);
}

.form-field textarea {
  resize: vertical;
  min-height: 100px;
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

/* Form actions */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.25rem;
  border-radius: var(--radius);
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.primary-btn {
  background-color: var(--primary);
  color: white;
}

.primary-btn:hover:not(:disabled) {
  background-color: #3b5adb;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.primary-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.secondary-btn {
  background-color: #f1f3f5;
  color: var(--text);
}

.secondary-btn:hover {
  background-color: #e9ecef;
  color: var(--text-dark);
}

/* Creator info */
.creator-info {
  text-align: right;
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: var(--text-light);
  font-style: italic;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .snippet-form-container {
    padding: 1.5rem 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
