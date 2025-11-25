<template>
  <header class="app-header">
    <nav>
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/signup" class="nav-link">Sign Up</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
};
</script>

<style scoped>
.app-header {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 0;
}

.app-header nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 24px;
}

.nav-link {
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.2s;
}

.nav-link:hover {
  background: #f3f4f6;
}

.nav-link.router-link-active {
  color: #1976d2;
  background: #eff6ff;
}
</style>