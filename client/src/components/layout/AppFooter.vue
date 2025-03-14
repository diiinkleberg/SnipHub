<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-logo">
          <img src="@/assets/logo.svg" alt="SnipHub Logo" height="24" />
        </div>
        <p class="footer-copyright">
          &copy; {{ new Date().getFullYear() }}
        </p>
        <div class="footer-spacer"></div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: white;
  padding: 2rem 0;
  border-top: 1px solid var(--border);
  margin-top: 2rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.footer-brand {
  font-weight: 600;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.footer-copyright {
  color: var(--text-light);
  font-size: 0.9rem;
  margin: 0;
  text-align: center;
  flex: 1;
}

.footer-spacer {
  flex: 1;
}

@media (max-width: 767px) {
  .footer-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .footer-logo, .footer-copyright, .footer-spacer {
    flex: none;
  }
}
</style>
