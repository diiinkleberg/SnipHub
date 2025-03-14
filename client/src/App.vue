<template>
  <div id="app">
    <!-- Header component -->
    <AppHeader />

    <!-- Main content area -->
    <div class="container main-content">
      <router-view />
    </div>

    <!-- Footer component -->
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
  },
};
</script>

<style>
/* Import base styles */
@import './style.css';

/* App-specific styles */
.main-content {
  min-height: calc(100vh - 150px); /* Keeps footer at bottom */
  padding: var(--spacing-lg) 0;
}

/* Smooth page transitions */
.router-view-transition-enter-active,
.router-view-transition-leave-active {
  transition: opacity 0.3s ease;
}

.router-view-transition-enter,
.router-view-transition-leave-to {
  opacity: 0;
}
</style>
