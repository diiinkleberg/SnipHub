<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1>My Profile</h1>
      <div class="user-session-info">
        <span class="time-info">
          <i class="bi bi-clock"></i> {{ currentDateTime }}
        </span>
      </div>
    </div>

    <!-- User profile information card -->
    <div class="profile-card">
      <div class="profile-card-header">
        <i class="bi bi-person-circle"></i>
        <span>Profile Information</span>
      </div>
      <div class="profile-card-body">
        <div v-if="currentUser" class="profile-info">
          <div class="profile-avatar">
            {{ getInitials(currentUser.username) }}
          </div>
          <div class="profile-details">
            <h3>{{ currentUser.username }}</h3>
            <p class="email">
              <i class="bi bi-envelope"></i> {{ currentUser.email }}
            </p>
            <p class="member-since">
              <i class="bi bi-calendar-check"></i>
              Member since: {{ formatDate(currentUser.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- User's snippets collection section -->
    <div class="snippets-section">
      <div class="snippets-header">
        <h2><i class="bi bi-code-square"></i> My Code Snippets</h2>
        <router-link to="/create" class="new-snippet-btn">
          <i class="bi bi-plus-lg"></i> New Snippet
        </router-link>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading snippets...</p>
      </div>

      <!-- Error message -->
      <div v-else-if="error" class="error-alert">
        <i class="bi bi-exclamation-triangle"></i>
        {{ error }}
      </div>

      <!-- Empty state message -->
      <div v-else-if="snippets.length === 0" class="empty-state">
        <i class="bi bi-info-circle"></i>
        <p>You haven't created any snippets yet.</p>
        <router-link to="/create" class="create-first-btn">
          Create your first snippet!
        </router-link>
      </div>

      <!-- Snippets table with actions -->
      <div v-else class="snippets-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Language</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="snippet in snippets" :key="snippet._id">
              <td>
                <router-link
                  :to="`/snippets/${snippet._id}`"
                  class="snippet-title">
                  {{ snippet.title }}
                </router-link>
              </td>
              <td>
                <span class="language-badge">
                  {{ snippet.programmingLanguage || snippet.language }}
                </span>
              </td>
              <td>{{ formatDate(snippet.createdAt) }}</td>
              <td>
                <div class="action-buttons">
                  <router-link :to="`/edit/${snippet._id}`" class="edit-btn">
                    <i class="bi bi-pencil"></i> Edit
                  </router-link>
                  <button
                    @click="() => confirmDelete(snippet._id)"
                    class="delete-btn">
                    <i class="bi bi-trash"></i> Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Profile',
  setup() {
    // Core setup
    const store = useStore();
    const router = useRouter();

    // Current date/time and user info
    const currentDateTime = ref('2025-03-05 14:08:41');
    const userLogin = ref('AntonHennig');

    // App state from store
    const currentUser = computed(() => store.getters.currentUser);
    const snippets = computed(() => store.getters.allSnippets);
    const isLoading = computed(() => store.state.snippetsLoading);
    const error = computed(() => store.state.snippetsError);

    // Helper function to get user initials for avatar
    const getInitials = (name) => {
      if (!name) return '?';
      return name
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2);
    };

    // Format date for display
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    };

    // Delete confirmation
    const confirmDelete = (snippetId) => {
      if (
        confirm(
          'Are you sure you want to delete this snippet? This action cannot be undone.'
        )
      ) {
        deleteSnippet(snippetId);
      }
    };

    // Delete snippet and refresh list
    const deleteSnippet = async (snippetId) => {
      await store.dispatch('deleteSnippet', snippetId);
      loadUserSnippets();
    };

    // Load user snippets from API
    const loadUserSnippets = async () => {
      if (currentUser.value) {
        await store.dispatch('fetchUserSnippets', currentUser.value._id);
      }
    };

    // Initialize component
    onMounted(async () => {
      // Load user data if needed
      if (!currentUser.value) {
        await store.dispatch('loadUser');
      }

      // Load user snippets
      loadUserSnippets();
    });

    // Expose to template
    return {
      currentUser,
      snippets,
      isLoading,
      error,
      formatDate,
      confirmDelete,
      currentDateTime,
      userLogin,
      getInitials,
    };
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

/* Header styling */
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border);
}

.profile-header h1 {
  font-size: 1.8rem;
  margin: 0;
  color: var(--text-dark);
}

.user-session-info {
  font-size: 0.9rem;
  color: var(--text-light);
}

.time-info {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

/* Profile card styling */
.profile-card {
  background-color: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
  overflow: hidden;
}

.profile-card-header {
  padding: 1rem 1.5rem;
  background-color: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
}

.profile-card-body {
  padding: 1.5rem;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
}

.profile-details {
  flex: 1;
}

.profile-details h3 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.email,
.member-since {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.member-since {
  font-size: 0.9rem;
  color: var(--text-light);
}

/* Snippets section styling */
.snippets-section {
  background-color: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
}

.snippets-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.snippets-header h2 {
  font-size: 1.4rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.new-snippet-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: white;
  border-radius: var(--radius);
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.new-snippet-btn:hover {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
}

/* Loading state */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
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

/* Error and empty state */
.error-alert {
  background-color: #fdeaea;
  color: #dc3545;
  border-left: 4px solid #dc3545;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text);
}

.empty-state i {
  font-size: 3rem;
  color: var(--text-light);
  margin-bottom: 1rem;
}

.empty-state p {
  margin-bottom: 1rem;
}

.create-first-btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: white;
  border-radius: var(--radius);
  text-decoration: none;
  font-weight: 500;
}

.create-first-btn:hover {
  background-color: var(--primary-dark);
}

/* Snippets table styling */
.snippets-table {
  overflow-x: auto;
  border-radius: var(--radius);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f8f9fa;
}

th {
  text-align: left;
  padding: 0.8rem;
  border-bottom: 2px solid var(--border);
  font-weight: 600;
  color: var(--text-dark);
}

td {
  padding: 0.8rem;
  border-bottom: 1px solid var(--border);
  color: var(--text);
}

tbody tr:hover {
  background-color: #f8f9fa;
}

.snippet-title {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.snippet-title:hover {
  text-decoration: underline;
}

.language-badge {
  display: inline-block;
  background-color: rgba(74, 107, 255, 0.1);
  color: var(--primary);
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius);
  font-size: 0.8rem;
  font-weight: 500;
}

/* Action buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius);
  font-size: 0.85rem;
  text-decoration: none;
}

.edit-btn {
  background-color: rgba(74, 107, 255, 0.1);
  color: var(--primary);
  border: none;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: var(--primary);
  color: white;
}

.delete-btn {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border: none;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #dc3545;
  color: white;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .profile-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .snippets-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.3rem;
  }

  .edit-btn,
  .delete-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
