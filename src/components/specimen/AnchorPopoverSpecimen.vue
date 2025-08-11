<template>
  <SpecimenPage
    title="AnchorPopover Component Specimen"
    description="This page showcases the AnchorPopover component, a fixed-position navigation component with a flyout menu that uses SubNav for content display."
    @backToLanding="$emit('backToLanding')"
  >

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Basic AnchorPopover</h2>
      <p class="gps-specimen__section-desc">The AnchorPopover component provides a fixed anchor button that opens a flyout menu containing navigation links or other content.</p>
      <div class="gps-specimen__examples">
        <div class="gps-specimen__anchor-demo">
          <AnchorPopover>
            <div class="gps-specimen__nav-content">
              <h4>Quick Navigation</h4>
              <div class="gps-specimen__nav-links">
                <Button type="flat" size="compact">🏠 Home</Button>
                <Button type="flat" size="compact">🎮 Game</Button>
                <Button type="flat" size="compact">⚙️ Settings</Button>
                <Button type="flat" size="compact">📊 Stats</Button>
              </div>
            </div>
          </AnchorPopover>
        </div>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Navigation with Sections</h2>
      <p class="gps-specimen__section-desc">AnchorPopover can contain organized sections of navigation items using the slot content.</p>
      <div class="gps-specimen__examples">
        <div class="gps-specimen__anchor-demo">
          <AnchorPopover>
            <div class="gps-specimen__nav-content">
              <div class="gps-specimen__nav-section">
                <h4>Main Navigation</h4>
                <div class="gps-specimen__nav-links">
                  <Button type="flat" size="compact">🏠 Dashboard</Button>
                  <Button type="flat" size="compact">🐹 Guinea Pigs</Button>
                  <Button type="flat" size="compact">🏠 Cage Management</Button>
                </div>
              </div>
              
              <div class="gps-specimen__nav-section">
                <h4>Tools</h4>
                <div class="gps-specimen__nav-links">
                  <Button type="flat" size="compact">📊 Statistics</Button>
                  <Button type="flat" size="compact">⚙️ Settings</Button>
                  <Button type="flat" size="compact">❓ Help</Button>
                </div>
              </div>
            </div>
          </AnchorPopover>
        </div>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Quick Actions Menu</h2>
      <p class="gps-specimen__section-desc">AnchorPopover can serve as a quick actions menu with different button types for various actions.</p>
      <div class="gps-specimen__examples">
        <div class="gps-specimen__anchor-demo">
          <AnchorPopover>
            <div class="gps-specimen__nav-content">
              <h4>Quick Actions</h4>
              <div class="gps-specimen__nav-actions">
                <Button type="primary" size="compact">+ Add Guinea Pig</Button>
                <Button type="secondary" size="compact">📋 View Reports</Button>
                <Button type="warning" size="compact">🧹 Clean Cage</Button>
                <Button type="flat" size="compact">💾 Save Game</Button>
              </div>
            </div>
          </AnchorPopover>
        </div>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Mixed Content</h2>
      <p class="gps-specimen__section-desc">The AnchorPopover slot can contain any type of content, not just navigation links.</p>
      <div class="gps-specimen__examples">
        <div class="gps-specimen__anchor-demo">
          <AnchorPopover>
            <div class="gps-specimen__nav-content">
              <h4>Game Status</h4>
              <div class="gps-specimen__status-info">
                <p><strong>Level:</strong> 15</p>
                <p><strong>Guinea Pigs:</strong> 3</p>
                <p><strong>Happiness:</strong> 85%</p>
              </div>
              
              <div class="gps-specimen__nav-section">
                <h4>Quick Actions</h4>
                <div class="gps-specimen__nav-links">
                  <Button type="primary" size="compact">🍎 Feed All</Button>
                  <Button type="secondary" size="compact">🧹 Clean All</Button>
                </div>
              </div>
            </div>
          </AnchorPopover>
        </div>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Component Features</h2>
      <div class="gps-specimen__guidelines">
        <h3>Key Features:</h3>
        <ul>
          <li><strong>Fixed Position:</strong> Stays in place as the user scrolls through content</li>
          <li><strong>Toggle Button:</strong> Uses the Button component with anchor emoji (⚓) for consistent styling</li>
          <li><strong>SubNav Integration:</strong> Uses SubNav component as the flyout container with built-in header and close button</li>
          <li><strong>Flexible Content:</strong> Slot-based content allows for any type of navigation or quick actions</li>
          <li><strong>CSS Variables:</strong> Leverages design system variables for consistent theming</li>
          <li><strong>Responsive Design:</strong> Adapts to different screen sizes with appropriate sizing</li>
        </ul>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Usage Guidelines</h2>
      <div class="gps-specimen__guidelines">
        <h3>When to use AnchorPopover:</h3>
        <ul>
          <li><strong>Secondary Navigation:</strong> When you need persistent access to less-frequently used navigation items</li>
          <li><strong>Quick Actions:</strong> For contextual actions that users might need from any page</li>
          <li><strong>Status Information:</strong> To display persistent game state or user information</li>
          <li><strong>Tool Palettes:</strong> For specialized tools or functions that don't fit in the main navigation</li>
        </ul>
        
        <h3>Best Practices:</h3>
        <ul>
          <li><strong>Keep Content Focused:</strong> Limit to 5-8 primary items to avoid overwhelming users</li>
          <li><strong>Group Related Items:</strong> Use sections to organize different types of content</li>
          <li><strong>Use Appropriate Button Types:</strong> Primary for main actions, secondary for alternatives, flat for navigation</li>
          <li><strong>Consider Context:</strong> Ensure the anchor position doesn't interfere with main content interaction</li>
        </ul>
      </div>
    </div>

  </SpecimenPage>
</template>

<script setup>
import AnchorPopover from '../navigation/AnchorPopover.vue'
import Button from '../shared/Button.vue'
import SpecimenPage from './SpecimenPage.vue'

const emit = defineEmits(['backToLanding'])
</script>

<style>
.gps-specimen__anchor-demo {
  position: relative;
  height: 200px;
  width: 100%;
  background: var(--color-bg);
  border: 2px dashed var(--color-border);
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  font-size: var(--font-size-sm);
}

/* Override AnchorPopover fixed positioning for specimen demonstrations */
.gps-specimen__anchor-demo .gps-anchor-popover {
  position: absolute;
  top: var(--font-size-base);
  inset-inline-end: var(--font-size-base);
  inset-inline-start: auto;
  max-width: none;
  width: auto;
}

/* Override SubNav positioning to open to the left like NeedsNav */
.gps-specimen__anchor-demo .gps-anchor-popover .gps-subnav {
  position: absolute;
  top: 0;
  inset-inline-end: calc(100% + var(--font-size-sm));
  inset-inline-start: auto;
  margin-inline-start: 0;
}

.gps-specimen__anchor-demo::before {
  content: "Click the anchor button in the top-right corner";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.gps-specimen__nav-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.gps-specimen__nav-content h4 {
  margin: 0 0 0.5rem 0;
  color: var(--color-accent);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.gps-specimen__nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.gps-specimen__nav-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gps-specimen__nav-section {
  padding-block-end: 0.5rem;
  border-block-end: 1px solid var(--color-border);
}

.gps-specimen__nav-section:last-child {
  border-block-end: none;
  padding-block-end: 0;
}

.gps-specimen__status-info {
  background: var(--color-bg);
  padding: 0.75rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  margin-block-end: 1rem;
}

.gps-specimen__status-info p {
  margin: 0.25rem 0;
  font-size: var(--font-size-sm);
  color: var(--color-text);
}

.gps-specimen__status-info strong {
  color: var(--color-accent);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .gps-specimen__anchor-demo {
    height: 150px;
  }
  
  .gps-specimen__anchor-demo::before {
    font-size: var(--font-size-xs);
  }
}
</style>