<template>
  <div class="auth-container">
    <div class="auth-card">
      <!-- Card header -->
      <div class="auth-header">
        <h2>Login</h2>
      </div>

      <div class="auth-body">
        <!-- Error message -->
        <div v-if="error" class="auth-alert">
          <i class="bi bi-exclamation-triangle"></i>
          <span>{{ error }}</span>
        </div>

        <!-- Login form -->
        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="identifier">Email address or Username</label>
            <div class="input-with-icon">
              <i class="bi bi-person"></i>
              <input
                type="text"
                id="identifier"
                v-model="identifier"
                placeholder="Enter your email or username"
                required />
            </div>
          </div>

          <!-- password input -->
          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-with-icon">
              <i class="bi bi-lock"></i>
              <input
                type="password"
                id="password"
                v-model="password"
                placeholder="Enter your password"
                required />
            </div>
          </div>

          <button type="submit" class="auth-button" :disabled="isLoading">
            <i class="bi bi-box-arrow-in-right"></i>
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Don't have an account?
            <router-link to="/register">Register here</router-link>
          </p>
          <p class="timestamp"><i class="bi bi-clock"></i></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  setup() {
    // Core services
    const store = useStore();
    const router = useRouter();

    // Form data
    const identifier = ref('');
    const password = ref('');

    // Store state
    const isLoading = computed(() => store.state.authLoading);
    const error = computed(() => store.state.authError);

    // Login handler
    const handleLogin = async () => {
      console.log('Login button clicked');
      if (!identifier.value || !password.value) {
        return;
      }

      const success = await store.dispatch('login', {
        identifier: identifier.value,
        password: password.value,
      });

      if (success) {
        router.push('/');
      }
    };

    return {
      identifier,
      password,
      handleLogin,
      isLoading,
      error,
    };
  },
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
}

.auth-card {
  width: 100%;
  max-width: 450px;
  background-color: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.auth-header {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  padding: 1.5rem;
  text-align: center;
}

.auth-header h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.auth-body {
  padding: 1.5rem;
}

.auth-alert {
  background-color: #fdeaea;
  border-left: 4px solid #dc3545;
  color: #dc3545;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
}

.auth-alert i {
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

.auth-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
}

.input-with-icon input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 1rem;
  transition: all 0.2s;
}

.input-with-icon input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(74, 107, 255, 0.1);
}

#password {
  padding-right: 1rem;
}

.auth-button {
  width: 100%;
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.auth-button:hover:not(:disabled) {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
}

.auth-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  color: var(--text);
}

.auth-footer a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.timestamp {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: var(--text-light);
}
</style>
