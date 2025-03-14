<template>
  <header class="header">
    <div class="container">
      <nav class="navbar">
        <!-- Logo on the left -->
        <router-link class="navbar-brand" to="/">
          <img
            src="@/assets/logo.svg"
            alt="SnipHub Logo"
            class="logo"
            height="30" />
        </router-link>

        <!-- Mobile menu toggle button -->
        <button
          class="menu-toggle"
          @click="toggleMenu"
          aria-label="Toggle navigation">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>

        <!-- Navigation menu -->
        <div class="nav-menu" :class="{ 'is-active': menuActive }">
          <!-- Left side menu items -->
          <ul class="nav-list left-items">
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/create">
                <i class="bi bi-plus-circle"></i> Create Snippet
              </router-link>
            </li>
          </ul>

          <!-- Right side menu items -->
          <div class="right-side">
            <!-- Search bar -->
            <div class="search-box">
              <form @submit.prevent="handleSearch">
                <input
                  type="search"
                  placeholder="Search snippets..."
                  v-model="searchQuery"
                  aria-label="Search" />
                <button type="submit" class="search-btn">
                  <i class="bi bi-search"></i>
                </button>
              </form>
            </div>

            <!-- Auth links -->
            <ul class="nav-list auth-links">
              <!-- Login/Register buttons for guests -->
              <template v-if="!isAuthenticated">
                <li class="nav-item">
                  <router-link class="nav-link" to="/login">
                    <i class="bi bi-box-arrow-in-right"></i> Login
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link signup-link" to="/register">
                    <i class="bi bi-person-plus"></i> Register
                  </router-link>
                </li>
              </template>

              <!-- Account dropdown for logged-in users -->
              <template v-else>
                <li class="nav-item dropdown">
                  <button
                    class="dropdown-toggle"
                    @click.stop="toggleDropdown"
                    ref="dropdownButton">
                    <i class="bi bi-person-circle"></i> Account
                    <i
                      :class="[
                        'bi',
                        dropdownOpen ? 'bi-chevron-up' : 'bi-chevron-down',
                      ]"></i>
                  </button>
                  <ul
                    class="dropdown-menu"
                    :class="{ show: dropdownOpen }"
                    ref="dropdownMenu">
                    <li>
                      <router-link class="dropdown-item" to="/profile">
                        <i class="bi bi-person"></i> Profile
                      </router-link>
                    </li>
                    <li>
                      <router-link class="dropdown-item" to="/favorites">
                        <i class="bi bi-heart"></i> Favorites
                      </router-link>
                    </li>
                    <li class="dropdown-divider"></li>
                    <li>
                      <button class="dropdown-item logout-btn" @click="logout">
                        <i class="bi bi-box-arrow-right"></i> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';

export default {
  setup() {
    // Store, router and route setup
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    // Reactive references
    const searchQuery = ref('');
    const menuActive = ref(false);
    const dropdownOpen = ref(false);
    const dropdownButton = ref(null);
    const dropdownMenu = ref(null);

    // Computed properties
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const currentUser = computed(() => store.getters.currentUser);

    // Setup on component mount
    onMounted(() => {
      // Initialize search from URL if present
      if (route.query.search) {
        searchQuery.value = route.query.search;
      }

      // Setup click outside listener for dropdown
      document.addEventListener('click', handleClickOutside);
    });

    // Handle clicks outside the dropdown
    const handleClickOutside = (event) => {
      // Make sure refs are available
      if (!dropdownButton.value || !dropdownMenu.value) return;

      // Close dropdown if click is outside dropdown element
      if (
        !dropdownButton.value.contains(event.target) &&
        !dropdownMenu.value.contains(event.target)
      ) {
        dropdownOpen.value = false;
      }
    };

    // Clean up event listener when component unmounts
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    // Watch for route changes
    watch(
      () => route.query.search,
      (newValue) => {
        if (newValue !== searchQuery.value) {
          searchQuery.value = newValue || '';
        }
      }
    );

    // Close menu on route changes
    watch(
      () => route.path,
      () => {
        menuActive.value = false;
      }
    );

    // User actions
    const logout = () => {
      store.dispatch('logout');
      router.push('/login');
      dropdownOpen.value = false;
    };

    const handleSearch = () => {
      const newQuery = { ...route.query };

      if (searchQuery.value.trim()) {
        newQuery.search = searchQuery.value.trim();
      } else {
        delete newQuery.search;
      }

      router.push({
        path: '/',
        query: newQuery,
      });

      // Close mobile menu after search
      menuActive.value = false;
    };

    const toggleMenu = () => {
      menuActive.value = !menuActive.value;
    };

    const toggleDropdown = (e) => {
      e.stopPropagation();
      dropdownOpen.value = !dropdownOpen.value;
    };

    return {
      isAuthenticated,
      currentUser,
      searchQuery,
      menuActive,
      dropdownOpen,
      dropdownButton,
      dropdownMenu,
      logout,
      handleSearch,
      toggleMenu,
      toggleDropdown,
    };
  },
};
</script>

<style scoped>
.header {
  background: white;
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  flex-wrap: wrap;
}

.navbar-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--text-dark);
  font-weight: 700;
  font-size: 1.25rem;
}

.nav-menu {
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: space-between;
  margin-left: 2rem;
}

/* Added to group search and auth on the right */
.right-side {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
}

.nav-list {
  list-style: none;
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
}

.left-items {
  margin-right: auto;
}

.nav-item {
  margin-right: 1rem;
}

.nav-item:last-child {
  margin-right: 0;
}

.nav-link {
  color: var(--text-light);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius);
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.nav-link:hover {
  color: var(--primary);
  background-color: rgba(74, 107, 255, 0.05);
}

/* Login Button */
.login-link {
  border: 1px solid var(--border);
  padding: 0.45rem 1rem;
}

.login-link:hover {
  border-color: var(--primary);
  transform: translateY(-1px);
}

/* Signup Button - Enhanced */
.signup-link {
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius);
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(74, 107, 255, 0.2);
}

.signup-link:hover {
  color: white;
  box-shadow: 0 4px 8px rgba(74, 107, 255, 0.3);
  transform: translateY(-2px);
  background: linear-gradient(135deg, var(--primary-light), var(--primary));
}

.signup-link:active {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(74, 107, 255, 0.2);
}

/* Search box styling */
.search-box {
  max-width: 250px;
  width: 100%;
}

.search-box form {
  display: flex;
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: 20px;
  margin: 0;
  font-size: 0.9rem;
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary-light);
  box-shadow: 0 0 0 2px rgba(74, 107, 255, 0.1);
}

.search-btn {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  background: transparent;
  border: none;
  padding: 0 0.75rem;
  color: var(--text-light);
  cursor: pointer;
}

/* Dropdown styling */
.dropdown {
  position: relative;
}

.dropdown-toggle {
  background: none;
  border: none;
  color: var(--text-light);
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 1rem;
}

.dropdown-toggle:hover {
  color: var(--primary);
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  min-width: 200px;
  list-style: none;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  z-index: 10;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: var(--text-light);
  text-decoration: none;
  transition: var(--transition);
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 1rem;
}

.dropdown-item:hover {
  background-color: rgba(74, 107, 255, 0.1);
  color: var(--primary);
}

.dropdown-divider {
  height: 1px;
  background-color: var(--border);
  margin: 0.5rem 0;
}

.logout-btn {
  color: #dc3545;
}

/* Mobile menu toggle */
.menu-toggle {
  display: none;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0.5rem;
}

.bar {
  display: block;
  width: 25px;
  height: 3px;
  background: var(--text-dark);
  margin: 5px 0;
  border-radius: 3px;
  transition: var(--transition);
}

/* Mobile styles */
@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .nav-menu {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    margin-left: 0;
    margin-top: 1rem;
  }

  .nav-menu.is-active {
    max-height: 500px;
  }

  .right-side {
    flex-direction: column;
    width: 100%;
  }

  .nav-list {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .left-items {
    margin-right: 0;
  }

  .nav-item {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }

  .nav-link {
    display: block;
    padding: 0.75rem 0;
  }

  .search-box {
    max-width: 100%;
    margin: 1rem 0;
  }

  .auth-links {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .dropdown-menu {
    position: static;
    box-shadow: none;
    border-radius: 0;
    border-left: 2px solid var(--primary);
    margin-left: 0.5rem;
  }
}
</style>
