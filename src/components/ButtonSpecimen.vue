<template>
  <div class="gps-button-specimen">
    <div class="gps-button-specimen__header">
      <div class="gps-button-specimen__header-content">
        <h1 class="gps-button-specimen__title">Button Component Specimen</h1>
        <p class="gps-button-specimen__desc">
          This page showcases all available button variations in the Guinea Pig Simulator design system.
        </p>
      </div>
      <div class="gps-button-specimen__theme-toggle">
        <ThemeToggle />
      </div>
    </div>

    <div class="gps-button-specimen__section">
      <h2 class="gps-button-specimen__section-title">Primary Buttons</h2>
      <p class="gps-button-specimen__section-desc">Main call-to-action buttons with accent color background.</p>
      <div class="gps-button-specimen__examples">
        <Button type="primary">Primary Button</Button>
        <Button type="primary">Start Game</Button>
        <Button type="primary">Save Changes</Button>
      </div>
    </div>

    <div class="gps-button-specimen__section">
      <h2 class="gps-button-specimen__section-title">Secondary Buttons</h2>
      <p class="gps-button-specimen__section-desc">Secondary actions with transparent background and border.</p>
      <div class="gps-button-specimen__examples">
        <Button type="secondary">Secondary Button</Button>
        <Button type="secondary">View Inventory</Button>
        <Button type="secondary">Show Info</Button>
      </div>
    </div>

    <div class="gps-button-specimen__section">
      <h2 class="gps-button-specimen__section-title">Flat Buttons</h2>
      <p class="gps-button-specimen__section-desc">Subtle buttons with no background or border, used for theme toggles and minor actions.</p>
      <div class="gps-button-specimen__examples">
        <Button type="flat">Flat Button</Button>
        <Button type="flat">🌙 Dark</Button>
        <Button type="flat">🌞 Light</Button>
      </div>
    </div>

    <div class="gps-button-specimen__section">
      <h2 class="gps-button-specimen__section-title">Warning Buttons</h2>
      <p class="gps-button-specimen__section-desc">Buttons for actions that require caution, with orange background.</p>
      <div class="gps-button-specimen__examples">
        <Button type="warn">Warning Button</Button>
        <Button type="warn">Clear Cage</Button>
        <Button type="warn">Delete Item</Button>
      </div>
    </div>

    <div class="gps-button-specimen__section">
      <h2 class="gps-button-specimen__section-title">Danger Buttons</h2>
      <p class="gps-button-specimen__section-desc">Buttons for destructive actions, with red background.</p>
      <div class="gps-button-specimen__examples">
        <Button type="danger">Danger Button</Button>
        <Button type="danger">Reset Game</Button>
        <Button type="danger">Delete Account</Button>
      </div>
    </div>

    <div class="gps-button-specimen__section">
      <h2 class="gps-button-specimen__section-title">Disabled Buttons</h2>
      <p class="gps-button-specimen__section-desc">Buttons that are not interactive, with reduced opacity.</p>
      <div class="gps-button-specimen__examples">
        <Button type="disabled">Disabled Button</Button>
        <Button type="disabled">Not Available</Button>
        <Button type="disabled">Coming Soon</Button>
      </div>
    </div>

    <div class="gps-button-specimen__section">
      <h2 class="gps-button-specimen__section-title">Mixed Examples</h2>
      <p class="gps-button-specimen__section-desc">How different button types work together in a form or interface.</p>
      <div class="gps-button-specimen__examples">
        <Button type="primary">Save</Button>
        <Button type="secondary">Cancel</Button>
        <Button type="danger">Delete</Button>
      </div>
    </div>

    <div class="gps-button-specimen__section">
      <h2 class="gps-button-specimen__section-title">Usage Guidelines</h2>
      <div class="gps-button-specimen__guidelines">
        <h3>When to use each type:</h3>
        <ul>
          <li><strong>Primary:</strong> Main actions, form submissions, game progression</li>
          <li><strong>Secondary:</strong> Alternative actions, navigation, information display</li>
          <li><strong>Flat:</strong> Theme toggles, minor UI controls, subtle actions</li>
          <li><strong>Warning:</strong> Actions that require user attention but aren't destructive</li>
          <li><strong>Danger:</strong> Destructive actions, data loss, permanent changes</li>
          <li><strong>Disabled:</strong> Unavailable actions, loading states, permissions</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from './Button.vue'
import ThemeToggle from './ThemeToggle.vue'
</script>

<style>
.gps-button-specimen {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.gps-button-specimen__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  margin-block-end: 3rem;
}

.gps-button-specimen__header-content {
  flex: 1;
}

.gps-button-specimen__title {
  font-size: 2.5em;
  color: var(--color-accent);
  margin-block-end: 1rem;
  text-align: start;
}

.gps-button-specimen__desc {
  font-size: 1.1rem;
  color: var(--color-text);
  margin-block-end: 0;
  text-align: start;
  opacity: 0.8;
}

.gps-button-specimen__theme-toggle {
  flex-shrink: 0;
}

.gps-button-specimen__section {
  margin-block-end: 3rem;
  padding: 2rem;
  background: var(--color-panel);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.gps-button-specimen__section-title {
  font-size: 1.5em;
  color: var(--color-accent);
  margin-block-end: 0.5rem;
}

.gps-button-specimen__section-desc {
  color: var(--color-text);
  margin-block-end: 1.5rem;
  opacity: 0.8;
}

.gps-button-specimen__examples {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.gps-button-specimen__guidelines {
  background: var(--color-bg);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.gps-button-specimen__guidelines h3 {
  color: var(--color-accent);
  margin-block-end: 1rem;
}

.gps-button-specimen__guidelines ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.gps-button-specimen__guidelines li {
  padding: 0.5rem 0;
  border-block-end: 1px solid var(--color-border);
}

.gps-button-specimen__guidelines li:last-child {
  border-block-end: none;
}

.gps-button-specimen__guidelines strong {
  color: var(--color-accent);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .gps-button-specimen {
    padding: 1rem;
  }
  
  .gps-button-specimen__header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }
  
  .gps-button-specimen__title {
    text-align: center;
  }
  
  .gps-button-specimen__desc {
    text-align: center;
  }
  
  .gps-button-specimen__section {
    padding: 1.5rem;
  }
  
  .gps-button-specimen__examples {
    flex-direction: column;
    align-items: stretch;
  }
  
  .gps-button-specimen__examples .gps-main__button {
    width: 100%;
  }
}
</style> 