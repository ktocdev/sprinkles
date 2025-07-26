<script setup>
import ThemeToggle from '../shared/ThemeToggle.vue'
</script>

<template>
  <header class="gps-topbar">
    <div class="gps-topbar__container">
      <div class="gps-topbar__menubar" role="menubar">
        <!-- Logo -->
        <div class="gps-topbar__logo">
          🐹
        </div>
        
        <!-- Title -->
        <h1 class="gps-topbar__title">Guinea Pig Simulator</h1>
        
        <!-- Theme toggle -->
        <ThemeToggle class="gps-topbar__theme-toggle" />
      </div>
    </div>
  </header>
</template>

<style>
.gps-topbar {
  width: 100%;
  background: var(--color-panel);
  border-block-end: 2px solid var(--color-accent);
  box-shadow: var(--box-shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}

.gps-topbar__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem 0.75rem;
  container-type: inline-size;
  container-name: topbar;
}

.gps-topbar__menubar {
  display: flex;
  align-items: center;
  gap: 0.25em;
  position: relative;
}

.gps-topbar__logo {
  font-size: 1.5rem;
  margin-inline-end: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
}

.gps-topbar__title {
  font-size: 1.5rem;
  margin: 0;
  color: var(--color-accent);
  font-weight: 600;
}

.gps-topbar__theme-toggle {
  margin-inline-start: auto;
}

/* Container query for larger containers */
@container topbar (min-width: 800px) {
  .gps-topbar__container {
    padding: 0.75rem 1.5rem;
  }
  
  .gps-topbar__menubar {
    gap: 0.75em;
  }
}

/* Container query for medium containers */
@container topbar (min-width: 600px) and (max-width: 799px) {
  .gps-topbar__container {
    padding: 0.75rem 1rem;
  }
  
  .gps-topbar__menubar {
    gap: 0.5em;
  }
}
</style> 