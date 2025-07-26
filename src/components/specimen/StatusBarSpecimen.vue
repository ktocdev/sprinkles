<template>
  <SpecimenPage
    title="StatusBar Component"
    description="The StatusBar component displays progress bars for various status indicators like health, needs, and other numerical values with color-coded visual feedback."
    @backToLanding="$emit('backToLanding')"
  >

    <!-- Basic Examples Section -->
    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">Basic Examples</h3>
      <p class="gps-specimen__section-desc">
        Simple progress bars with different values and colors.
      </p>
      
      <div class="gps-specimen__examples">
        <div class="gps-specimen__guidelines">
          <h4>High Value (Good)</h4>
          <StatusBar label="Health" :value="85" />
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>Medium Value (Warning)</h4>
          <StatusBar label="Hunger" :value="45" />
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>Low Value (Critical)</h4>
          <StatusBar label="Energy" :value="15" />
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>Empty</h4>
          <StatusBar label="Water" :value="0" />
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>Full</h4>
          <StatusBar label="Happiness" :value="100" />
        </div>
      </div>
    </div>

    <!-- Guinea Pig Needs Section -->
    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">Guinea Pig Needs Simulation</h3>
      <p class="gps-specimen__section-desc">
        Real-world examples showing how the StatusBar component is used to display guinea pig needs.
      </p>
      
      <div class="gps-specimen__examples">
        <div class="gps-specimen__guidelines">
          <h4>Physical Needs</h4>
          <StatusBar label="Hunger" :value="hunger" />
          <StatusBar label="Thirst" :value="thirst" />
          <StatusBar label="Energy" :value="energy" />
          <StatusBar label="Cleanliness" :value="cleanliness" />
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>Social & Mental Needs</h4>
          <StatusBar label="Love" :value="love" />
          <StatusBar label="Enrichment" :value="enrichment" />
          <StatusBar label="Comfort" :value="comfort" />
          <StatusBar label="Safety" :value="safety" />
        </div>
      </div>
      
      <div class="gps-panel-controls">
        <Button type="primary" @click="randomizeNeeds">🎲 Randomize Needs</Button>
        <Button type="secondary" @click="resetNeeds">Reset to Default</Button>
        <Button type="flat" @click="simulateTimePassing">⏰ Simulate Time</Button>
      </div>
    </div>

    <!-- Cage Status Section -->
    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">Cage Status Indicators</h3>
      <p class="gps-specimen__section-desc">
        StatusBar components used to show cage conditions and maintenance needs.
      </p>
      
      <div class="gps-specimen__examples">
        <div class="gps-specimen__guidelines">
          <h4>Cage Conditions</h4>
          <StatusBar label="Bedding Freshness" :value="beddingFreshness" />
          <StatusBar label="Water Level" :value="waterLevel" />
          <StatusBar label="Food Supply" :value="foodSupply" />
          <StatusBar label="Cleanliness" :value="cageCleanliness" />
        </div>
      </div>
      
      <div class="gps-panel-controls">
        <Button type="warning" @click="simulateCageDeterioration">Simulate Deterioration</Button>
        <Button type="primary" @click="refreshCage">Refresh Cage</Button>
      </div>
    </div>

    <!-- Interactive Demo Section -->
    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">Interactive Demo</h3>
      <p class="gps-specimen__section-desc">
        Adjust the values below to see how the StatusBar component responds to different inputs.
      </p>
      
      <div class="gps-specimen__guidelines">
        <div class="gps-statusbar-specimen__slider-group">
          <label for="demo-value">Demo Value: {{ demoValue }}%</label>
          <input 
            id="demo-value"
            type="range" 
            min="0" 
            max="100" 
            v-model="demoValue"
            class="gps-statusbar-specimen__slider"
          />
        </div>
        
        <div class="gps-statusbar-specimen__demo-bar">
          <StatusBar label="Interactive Demo" :value="demoValue" />
        </div>
      </div>
    </div>

    <!-- Documentation Section -->
    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">Documentation</h3>
      
      <div class="gps-specimen__examples">
        <div class="gps-specimen__guidelines">
          <h4>Props</h4>
          <div class="gps-statusbar-specimen__prop">
            <code>label</code> - The text label displayed next to the progress bar
          </div>
          <div class="gps-statusbar-specimen__prop">
            <code>value</code> - The current value (0-100) that determines the progress bar fill
          </div>
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>Color Coding</h4>
          <div class="gps-statusbar-specimen__color-info">
            <div class="gps-statusbar-specimen__color-item">
              <div class="gps-statusbar-specimen__color-swatch gps-statusbar-specimen__color-swatch--good"></div>
              <span>Good (70-100%) - Green</span>
            </div>
            <div class="gps-statusbar-specimen__color-item">
              <div class="gps-statusbar-specimen__color-swatch gps-statusbar-specimen__color-swatch--warning"></div>
              <span>Warning (30-69%) - Orange</span>
            </div>
            <div class="gps-statusbar-specimen__color-item">
              <div class="gps-statusbar-specimen__color-swatch gps-statusbar-specimen__color-swatch--critical"></div>
              <span>Critical (0-29%) - Red</span>
            </div>
          </div>
        </div>
        
        <div class="gps-specimen__guidelines">
          <h4>Usage Example</h4>
          <pre class="gps-statusbar-specimen__code"><code>&lt;StatusBar label="Health" :value="85" /&gt;</code></pre>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">Features</h3>
      
      <div class="gps-specimen__examples">
        <div class="gps-specimen__guidelines">
          <div class="gps-statusbar-specimen__feature">
            <div class="gps-statusbar-specimen__feature-icon">🎨</div>
            <div class="gps-statusbar-specimen__feature-content">
              <h4>Automatic Color Coding</h4>
              <p>Progress bars automatically change color based on the value range for intuitive visual feedback.</p>
            </div>
          </div>
        </div>
        
        <div class="gps-specimen__guidelines">
          <div class="gps-statusbar-specimen__feature">
            <div class="gps-statusbar-specimen__feature-icon">📱</div>
            <div class="gps-statusbar-specimen__feature-content">
              <h4>Responsive Design</h4>
              <p>Adapts to different screen sizes and maintains readability on mobile devices.</p>
            </div>
          </div>
        </div>
        
        <div class="gps-specimen__guidelines">
          <div class="gps-statusbar-specimen__feature">
            <div class="gps-statusbar-specimen__feature-icon">♿</div>
            <div class="gps-statusbar-specimen__feature-content">
              <h4>Accessible</h4>
              <p>Includes proper ARIA labels and semantic markup for screen readers.</p>
            </div>
          </div>
        </div>
        
        <div class="gps-specimen__guidelines">
          <div class="gps-statusbar-specimen__feature">
            <div class="gps-statusbar-specimen__feature-icon">⚡</div>
            <div class="gps-statusbar-specimen__feature-content">
              <h4>Performance Optimized</h4>
              <p>Lightweight component with smooth animations and efficient rendering.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SpecimenPage>
</template>

<script setup>
import { ref } from 'vue'
import StatusBar from '../shared/StatusBar.vue'
import Button from '../shared/Button.vue'
import SpecimenPage from './SpecimenPage.vue'

const emit = defineEmits(['backToLanding'])

// Interactive demo value
const demoValue = ref(50)

// Guinea pig needs simulation
const hunger = ref(75)
const thirst = ref(60)
const energy = ref(85)
const cleanliness = ref(40)
const love = ref(90)
const enrichment = ref(70)
const comfort = ref(80)
const safety = ref(95)

// Cage status simulation
const beddingFreshness = ref(65)
const waterLevel = ref(30)
const foodSupply = ref(45)
const cageCleanliness = ref(25)

function randomizeNeeds() {
  hunger.value = Math.floor(Math.random() * 100)
  thirst.value = Math.floor(Math.random() * 100)
  energy.value = Math.floor(Math.random() * 100)
  cleanliness.value = Math.floor(Math.random() * 100)
  love.value = Math.floor(Math.random() * 100)
  enrichment.value = Math.floor(Math.random() * 100)
  comfort.value = Math.floor(Math.random() * 100)
  safety.value = Math.floor(Math.random() * 100)
}

function resetNeeds() {
  hunger.value = 75
  thirst.value = 60
  energy.value = 85
  cleanliness.value = 40
  love.value = 90
  enrichment.value = 70
  comfort.value = 80
  safety.value = 95
}

function simulateTimePassing() {
  // Simulate needs decreasing over time
  hunger.value = Math.max(0, hunger.value - 10)
  thirst.value = Math.max(0, thirst.value - 15)
  energy.value = Math.max(0, energy.value - 5)
  cleanliness.value = Math.max(0, cleanliness.value - 20)
  love.value = Math.max(0, love.value - 8)
  enrichment.value = Math.max(0, enrichment.value - 12)
  comfort.value = Math.max(0, comfort.value - 6)
  safety.value = Math.max(0, safety.value - 3)
}

function simulateCageDeterioration() {
  beddingFreshness.value = Math.max(0, beddingFreshness.value - 20)
  waterLevel.value = Math.max(0, waterLevel.value - 30)
  foodSupply.value = Math.max(0, foodSupply.value - 25)
  cageCleanliness.value = Math.max(0, cageCleanliness.value - 40)
}

function refreshCage() {
  beddingFreshness.value = 100
  waterLevel.value = 100
  foodSupply.value = 100
  cageCleanliness.value = 100
}
</script>

<style>
/* Interactive demo styles */
.gps-statusbar-specimen__slider-group {
  margin-block-end: 1.5rem;
}

.gps-statusbar-specimen__slider-group label {
  display: block;
  margin-block-end: 0.5rem;
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
}

.gps-statusbar-specimen__slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--color-border);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.gps-statusbar-specimen__slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-accent);
  cursor: pointer;
  border: 2px solid var(--color-white);
  box-shadow: var(--box-shadow-light);
}

.gps-statusbar-specimen__slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-accent);
  cursor: pointer;
  border: 2px solid var(--color-white);
  box-shadow: var(--box-shadow-light);
}

.gps-statusbar-specimen__demo-bar {
  padding: 1.5rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
}

/* Documentation styles */
.gps-statusbar-specimen__prop {
  margin-block-end: 1rem;
  padding: 0.75rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  font-family: monospace;
}

.gps-statusbar-specimen__prop code {
  color: var(--color-accent);
  font-weight: var(--font-weight-semibold);
}

.gps-statusbar-specimen__color-info {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.gps-statusbar-specimen__color-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
}

.gps-statusbar-specimen__color-swatch {
  width: 24px;
  height: 24px;
  border-radius: var(--border-radius);
  border: 2px solid var(--color-white);
  box-shadow: var(--box-shadow-light);
  flex-shrink: 0;
}

.gps-statusbar-specimen__color-swatch--good {
  background: #27ae60;
}

.gps-statusbar-specimen__color-swatch--warning {
  background: #f39c12;
}

.gps-statusbar-specimen__color-swatch--critical {
  background: #e74c3c;
}

.gps-statusbar-specimen__code {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 1rem;
  overflow-x: auto;
  font-family: monospace;
  color: var(--color-text);
}

/* Feature styles */
.gps-statusbar-specimen__feature {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
}

.gps-statusbar-specimen__feature-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-accent);
  color: var(--color-white);
  border-radius: var(--border-radius);
  flex-shrink: 0;
}

.gps-statusbar-specimen__feature-content h4 {
  font-size: var(--font-size-lg);
  color: var(--color-text);
  margin: 0 0 0.5rem 0;
  font-weight: var(--font-weight-semibold);
}

.gps-statusbar-specimen__feature-content p {
  color: var(--color-text);
  opacity: 0.8;
  margin: 0;
  line-height: var(--line-height-relaxed);
}

/* StatusBar spacing within guidelines */
.gps-specimen__guidelines .gps-status-bar {
  margin-block-end: 0.75rem;
}

.gps-specimen__guidelines .gps-status-bar:last-child {
  margin-block-end: 0;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .gps-statusbar-specimen__color-info {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style> 