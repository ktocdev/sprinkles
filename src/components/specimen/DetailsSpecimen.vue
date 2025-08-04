<template>
  <SpecimenPage 
    title="Details Component"
    description="Expandable details component based on HTML details/summary elements with custom styling and two named slots."
    @back-to-landing="$emit('backToLanding')"
  >
    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Basic Usage</h2>
      <p class="gps-specimen__section-desc">
        The Details component wraps the HTML details/summary elements with two named slots: 
        <code>summary</code> for the clickable header and <code>content</code> for the expandable content.
      </p>
      
      <Details>
        <template #summary>
          🐹 Guinea Pig Care Instructions
        </template>
        <template #content>
          <div class="gps-details-specimen__care-content">
            <h3>Daily Care Requirements</h3>
            <ul>
              <li>Fresh water daily</li>
              <li>High-quality hay available 24/7</li>
              <li>Fresh vegetables (1/4 cup per day)</li>
              <li>Clean cage bedding weekly</li>
              <li>Social interaction and playtime</li>
            </ul>
            <p><strong>Note:</strong> Guinea pigs are social animals and should be kept in pairs or groups.</p>
          </div>
        </template>
      </Details>
    </div>
    
    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Multiple Examples</h2>
      
      <Details>
        <template #summary>
          🏠 Cage Setup Guide
        </template>
        <template #content>
          <div class="gps-details-specimen__setup-content">
            <h3>Essential Cage Items</h3>
            <div class="gps-details-specimen__setup-grid">
              <div class="gps-details-specimen__setup-item">
                <strong>Food Bowl:</strong> Heavy ceramic to prevent tipping
              </div>
              <div class="gps-details-specimen__setup-item">
                <strong>Water Bottle:</strong> Clean and refill daily
              </div>
              <div class="gps-details-specimen__setup-item">
                <strong>Hide House:</strong> Safe space for resting
              </div>
              <div class="gps-details-specimen__setup-item">
                <strong>Hay Rack:</strong> Keeps hay clean and accessible
              </div>
            </div>
          </div>
        </template>
      </Details>
      
      <Details>
        <template #summary>
          🥗 Safe Foods List
        </template>
        <template #content>
          <div class="gps-details-specimen__food-content">
            <h3>Vegetables (Daily)</h3>
            <ul>
              <li>Bell peppers (all colors)</li>
              <li>Carrots (small amounts)</li>
              <li>Cucumber</li>
              <li>Romaine lettuce</li>
              <li>Zucchini</li>
            </ul>
            
            <h3>Fruits (Occasional Treats)</h3>
            <ul>
              <li>Apple (no seeds)</li>
              <li>Blueberries</li>
              <li>Strawberries</li>
              <li>Banana (small amounts)</li>
            </ul>
            
            <p><strong>Important:</strong> Introduce new foods gradually to avoid digestive upset.</p>
          </div>
        </template>
      </Details>
      
      <Details>
        <template #summary>
          ⚠️ Health Warning Signs
        </template>
        <template #content>
          <div class="gps-details-specimen__health-content">
            <h3>Contact a Veterinarian If You Notice:</h3>
            <ul>
              <li>Loss of appetite or weight loss</li>
              <li>Difficulty breathing or wheezing</li>
              <li>Lethargy or lack of energy</li>
              <li>Hair loss or skin problems</li>
              <li>Changes in droppings</li>
              <li>Limping or difficulty moving</li>
            </ul>
            <p><strong>Emergency:</strong> Guinea pigs hide illness well, so any behavior change should be taken seriously.</p>
          </div>
        </template>
      </Details>
    </div>
    
    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Component Features</h2>
      <div class="gps-specimen__examples">
        <div class="gps-details-specimen__feature">
          <h3>✅ Accessibility</h3>
          <p>Uses native HTML details/summary elements for proper screen reader support and keyboard navigation.</p>
        </div>
        
        <div class="gps-details-specimen__feature">
          <h3>🎨 Styled</h3>
          <p>Custom styling with hover effects, smooth transitions, and visual indicators for open/closed states.</p>
        </div>
        
        <div class="gps-details-specimen__feature">
          <h3>📱 Responsive</h3>
          <p>Mobile-first design with enhanced spacing and touch-friendly interactions on larger screens.</p>
        </div>
        
        <div class="gps-details-specimen__feature">
          <h3>🎯 Flexible</h3>
          <p>Two named slots allow for any content in both summary and expandable sections.</p>
        </div>
      </div>
    </div>
    
    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Usage Guidelines</h2>
      <div class="gps-specimen__guidelines">
        <h3>Best Practices</h3>
        <ul>
          <li><strong>Clear Summary:</strong> Use descriptive text in the summary slot that clearly indicates what content will be revealed.</li>
          <li><strong>Consistent Content:</strong> Keep expandable content focused and well-organized.</li>
          <li><strong>Accessibility:</strong> The component uses native HTML elements, ensuring proper screen reader support.</li>
          <li><strong>Mobile Friendly:</strong> Touch targets are appropriately sized for mobile devices.</li>
          <li><strong>Visual Feedback:</strong> Hover states and transitions provide clear user feedback.</li>
        </ul>
      </div>
    </div>
  </SpecimenPage>
</template>

<script setup>
import { defineEmits } from 'vue'
import Details from '../shared/Details.vue'
import SpecimenPage from './SpecimenPage.vue'

const emit = defineEmits(['backToLanding'])
</script>

<style>
.gps-details-specimen__care-content h3,
.gps-details-specimen__setup-content h3,
.gps-details-specimen__food-content h3,
.gps-details-specimen__health-content h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-block-end: 0.75rem;
}

.gps-details-specimen__care-content ul,
.gps-details-specimen__food-content ul,
.gps-details-specimen__health-content ul {
  margin-block-end: 1rem;
  padding-inline-start: 1.5rem;
}

.gps-details-specimen__care-content li,
.gps-details-specimen__food-content li,
.gps-details-specimen__health-content li {
  margin-block-end: 0.25rem;
  color: var(--color-text);
}

.gps-details-specimen__care-content p,
.gps-details-specimen__food-content p,
.gps-details-specimen__health-content p {
  color: var(--color-text);
  opacity: 0.8;
  font-style: italic;
  margin-block-start: 1rem;
}

.gps-details-specimen__setup-grid {
  display: grid;
  gap: 0.75rem;
  margin-block-end: 1rem;
}

.gps-details-specimen__setup-item {
  padding: 0.75rem;
  background: var(--color-bg);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.gps-details-specimen__feature {
  padding: 1rem;
  background: var(--color-bg);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  flex: 1;
  min-width: 200px;
}

.gps-details-specimen__feature h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
  margin-block-end: 0.5rem;
}

.gps-details-specimen__feature p {
  color: var(--color-text);
  opacity: 0.8;
  line-height: var(--line-height-relaxed);
}

/* Mobile-first responsive design */
@media (min-width: 481px) {
  .gps-details-specimen__setup-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 