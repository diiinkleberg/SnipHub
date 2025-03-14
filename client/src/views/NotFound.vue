<template>
  <div class="not-found text-center my-5">
    <!-- 404 Error graphic -->
    <div class="error-graphic mb-4">
      <i class="bi bi-exclamation-circle-fill"></i>
      <span>404</span>
    </div>

    <h1 class="mb-3">Page Not Found</h1>

    <!-- Error message -->
    <p class="lead mb-4">
      The page you're looking for doesn't exist or has been moved.
    </p>

    <!-- Navigation button to return to homepage -->
    <router-link to="/" class="btn btn-primary">
      <i class="bi bi-house-door me-2"></i>
      Go to Homepage
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
};
</script>

<style scoped>
.not-found {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.error-graphic {
  position: relative;
  display: inline-block;
}

.error-graphic i {
  font-size: 8rem;
  color: var(--primary);
  opacity: 0.2;
}

.error-graphic span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary);
}

h1 {
  font-weight: 700;
  color: var(--text-primary);
}

.lead {
  color: var(--text-secondary);
}
</style>
