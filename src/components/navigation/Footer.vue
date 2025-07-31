<template>
  <footer class="gps-footer">
    <div class="gps-footer__content-wrapper">
      <div class="gps-footer__content">
        <p class="gps-footer__text">
          Guinea Pig Simulator - A text-based pet care game
        </p>
      </div>
    </div>
  </footer>
</template>

<style>
/* Mobile-first base styles */
.gps-footer {
  background: var(--color-panel);
  border-block-start: 2px solid var(--color-accent);
  margin-block-start: auto;
  position: fixed;
  bottom: 0;
  left: 50px; /* Mobile: smaller sidebar */
  right: 0;
  z-index: 200;
}

.gps-footer__content-wrapper {
  padding: 1rem;
  max-width: 100%;
  margin-inline: auto;
}

.gps-footer__content {
  text-align: center;
}

.gps-footer__text {
  color: var(--color-text);
  margin: 0;
  font-size: var(--font-size-sm);
  opacity: 0.8;
}

/* Tablet and larger screens */
@media (min-width: 768px) {
  .gps-footer {
    left: 60px; /* Larger sidebar on desktop */
  }
  
  .gps-footer__content-wrapper {
    padding: 1rem 1.5rem;
  }
}

/* Desktop and larger screens */
@media (min-width: 1250px) {
  .gps-footer__content-wrapper {
    max-width: 1200px;
    margin-inline: auto;
    padding: 1rem 1.5rem;
  }
}

/* Large desktop screens */
@media (min-width: 1400px) {
  .gps-footer__content-wrapper {
    max-width: 1400px;
  }
}
</style> 