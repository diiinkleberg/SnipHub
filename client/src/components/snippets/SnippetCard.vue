<template>
  <div class="snippet-card">
    <!-- Card Header -->
    <div class="snippet-header">
      <h5 class="snippet-title">{{ snippet.title }}</h5>
      <span class="snippet-language">
        {{ snippet.programmingLanguage || snippet.language }}
      </span>
    </div>

    <!-- Card Content -->
    <div class="snippet-content">
      <!-- Description -->
      <p v-if="snippet.description" class="snippet-description">
        {{ truncate(snippet.description, 100) }}
      </p>

      <!-- Code Preview with Syntax Highlighting -->
      <div class="code-preview">
        <highlightjs
          :language="
            snippet.programmingLanguage || snippet.language || 'javascript'
          "
          :code="truncate(snippet.code, 100)" />
      </div>
    </div>

    <!-- Card Footer -->
    <div class="snippet-footer">
      <div class="snippet-meta">
        <!-- Author Info -->
        <span class="snippet-author">
          By: {{ snippet.user?.username || 'Unknown' }}
        </span>

        <div class="snippet-actions">
          <!-- Favorite Button, if authenticated -->
          <FavoriteButton v-if="isAuthenticated" :snippet-id="snippet._id" />

          <!-- View Button -->
          <router-link :to="`/snippets/${snippet._id}`" class="view-button">
            View Snippet
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import FavoriteButton from '@/components/snippets/FavoriteButton.vue';

export default {
  // Props
  props: {
    snippet: {
      type: Object,
      required: true,
    },
  },

  components: {
    FavoriteButton,
  },

  setup() {
    const store = useStore();
    const isAuthenticated = computed(() => store.getters.isAuthenticated);

    return {
      isAuthenticated,
    };
  },

  methods: {
    // Truncate long text
    truncate(text, length) {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    },
  },
};
</script>

<style scoped>
.snippet-card {
  height: 100%;
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
}

.snippet-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
}

.snippet-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 500;
}

.snippet-language {
  color: var(--text-light);
  font-size: 0.875rem;
}

.snippet-content {
  padding: 1rem;
  flex-grow: 1;
}

.snippet-description {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--text);
}

.code-preview {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 10px;
  overflow: hidden;
}

.code-preview pre {
  margin: 0;
  max-height: 100px;
  overflow: hidden;
  font-family: monospace;
  font-size: 0.85rem;
}

.snippet-footer {
  padding: 1rem;
  border-top: 1px solid var(--border);
}

.snippet-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.snippet-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.snippet-author {
  color: var(--text-light);
  font-size: 0.875rem;
}

.view-button {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--primary);
  color: white;
  border-radius: var(--radius);
  text-decoration: none;
  font-size: 0.875rem;
  transition: var(--transition);
}

.view-button:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}
</style>
