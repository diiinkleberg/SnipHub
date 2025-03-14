<template>
  <div class="filter-card">
    <div class="filter-content">
      <div class="filter-layout">
        <!-- Filter Header -->
        <h5 class="filter-title">
          <i class="bi bi-funnel"></i>
          Filter
        </h5>

        <!-- Language Selector -->
        <select
          class="language-select"
          v-model="selectedLanguage"
          @change="handleChange">
          <option value="">All Languages</option>
          <option v-for="lang in languages" :key="lang" :value="lang">
            {{ lang }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// Setup router and route
const router = useRouter();
const route = useRoute();

// Reactive variables
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
  'other',
]);

// Initialize language filter from URL when component loads
if (route.query.language) {
  selectedLanguage.value = route.query.language;
}

// Update selected language when route changes
watch(
  () => route.query.language,
  (newLanguage) => {
    selectedLanguage.value = newLanguage || '';
  }
);

// Handle language selection change
const handleChange = () => {
  // Update URL with selected language filter
  router.push({
    path: '/',
    query: {
      ...route.query,
      language: selectedLanguage.value || undefined,
    },
  });
};
</script>

<style scoped>
.filter-card {
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 1.5rem;
}

.filter-content {
  padding: 1rem;
}

.filter-layout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.filter-title {
  margin: 0;
  margin-right: 1rem;
  font-size: 1.125rem;
  font-weight: 500;
}

.filter-title i {
  margin-right: 0.5rem;
}

.language-select {
  max-width: 200px;
  padding: 0.375rem 0.75rem;
  font-size: 0.9rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background-color: white;
  cursor: pointer;
}

.language-select:focus {
  outline: none;
  border-color: var(--primary-light);
  box-shadow: 0 0 0 2px rgba(74, 107, 255, 0.1);
}

@media (max-width: 576px) {
  .filter-layout {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-title {
    margin-bottom: 0.75rem;
  }

  .language-select {
    max-width: 100%;
    width: 100%;
  }
}
</style>
