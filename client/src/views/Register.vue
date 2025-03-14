<template>
  <div class="auth-container">
    <div class="auth-card">
      <!-- Card header -->
      <div class="auth-header">
        <h2>Create Account</h2>
      </div>

      <div class="auth-body">
        <!-- Error message -->
        <div v-if="error" class="auth-alert">
          <i class="bi bi-exclamation-triangle"></i>
          <span>{{ error }}</span>
        </div>

        <!-- Registration form -->
        <form @submit.prevent="handleRegister" class="auth-form">
  
          <div class="form-group">
            <label for="username">Username</label>
            <div class="input-with-icon">
              <i class="bi bi-person-badge"></i>
              <input
                type="text"
                id="username"
                v-model="username"
                placeholder="Choose a username"
                required />
            </div>
          </div>

          <!-- Email field -->
          <div class="form-group">
            <label for="email">Email address</label>
            <div class="input-with-icon">
              <i class="bi bi-envelope"></i>
              <input
                type="email"
                id="email"
                v-model="email"
                placeholder="Enter your email"
                required />
            </div>
          </div>

          <!-- Password field -->
          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-with-icon">
              <i class="bi bi-lock"></i>
              <input
                type="password"
                id="password"
                v-model="password"
                placeholder="Create a password"
                required
                minlength="6" />
            </div>
            <div
              class="password-hint"
              :class="{ active: password.length >= 6 }">
              <i
                class="bi"
                :class="
                  password.length >= 6 ? 'bi-check-circle' : 'bi-circle'
                "></i>
              At least 6 characters
            </div>
          </div>

          <!-- Confirm password field -->
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="input-with-icon">
              <i class="bi bi-shield-lock"></i>
              <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                placeholder="Confirm your password"
                required />
            </div>
            <div
              class="password-hint"
              :class="{
                active: confirmPassword && password === confirmPassword,
              }">
              <i
                class="bi"
                :class="
                  confirmPassword && password === confirmPassword
                    ? 'bi-check-circle'
                    : 'bi-circle'
                "></i>
              Passwords match
            </div>
          </div>

          <button
            type="submit"
            class="auth-button"
            :disabled="isLoading || !isFormValid">
            <i class="bi bi-person-plus"></i>
            {{ isLoading ? 'Creating Account...' : 'Register' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Already have an account?
            <router-link to="/login">Login here</router-link>
          </p>
          <p class="timestamp">
            <i class="bi bi-person-circle"></i>
          </p>
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
  name: 'Register',
  setup() {
    // Core services
    const store = useStore();
    const router = useRouter();

    // Form data
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const formError = ref('');

    // Store state
    const isLoading = computed(() => store.state.authLoading);
    const storeError = computed(() => store.state.authError);
    const error = computed(() => formError.value || storeError.value);

    // Form validation
    const isFormValid = computed(() => {
      formError.value = '';

      if (
        !username.value ||
        !email.value ||
        !password.value ||
        !confirmPassword.value
      ) {
        return false;
      }

      if (password.value !== confirmPassword.value) {
        formError.value = 'Passwords do not match';
        return false;
      }

      if (password.value.length < 6) {
        formError.value = 'Password must be at least 6 characters long';
        return false;
      }

      return true;
    });

    // Form submission
    const handleRegister = async () => {
      if (!isFormValid.value) {
        return;
      }

      const success = await store.dispatch('register', {
        username: username.value,
        email: email.value,
        password: password.value,
      });

      if (success) {
        router.push('/');
      }
    };

    return {
      username,
      email,
      password,
      confirmPassword,
      handleRegister,
      isLoading,
      isFormValid,
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

.password-hint {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-light);
}

.password-hint.active {
  color: #198754;
}

.password-hint i {
  font-size: 0.9rem;
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
