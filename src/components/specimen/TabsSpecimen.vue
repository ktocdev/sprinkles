<template>
  <SpecimenPage
    title="Tabs Component Specimen"
    description="This page showcases the flexible tabs component with different configurations and use cases."
    @backToLanding="$emit('backToLanding')"
  >

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Basic Tabs</h2>
      <p class="gps-specimen__section-desc">Simple tab navigation with text labels and content slots.</p>
      <div class="gps-specimen__examples">
        <Tabs :tabs="basicTabs" v-model="basicTabValue">
          <template #overview>
            <div class="gps-panel-section">
              <h3>Overview Content</h3>
              <p>This is the overview tab content. It provides a general introduction and summary of the information.</p>
            </div>
          </template>
          <template #details>
            <div class="gps-panel-section">
              <h3>Details Content</h3>
              <p>This tab contains detailed information with more specific data and explanations.</p>
              <ul>
                <li>Feature 1: Advanced functionality</li>
                <li>Feature 2: Enhanced performance</li>
                <li>Feature 3: Better user experience</li>
              </ul>
            </div>
          </template>
          <template #settings>
            <div class="gps-panel-section">
              <h3>Settings Content</h3>
              <p>Configure your preferences and options here.</p>
              <Button type="primary" size="compact">Save Settings</Button>
            </div>
          </template>
        </Tabs>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Tabs with Icons</h2>
      <p class="gps-specimen__section-desc">Tabs enhanced with icons for better visual identification.</p>
      <div class="gps-specimen__examples">
        <Tabs :tabs="iconTabs" v-model="iconTabValue">
          <template #home>
            <div class="gps-panel-section">
              <h3>🏠 Home Dashboard</h3>
              <p>Welcome to your home dashboard. Here you can see an overview of your guinea pig's status.</p>
              <div class="gps-specimen__demo-grid">
                <div class="gps-panel-section">
                  <h4>Quick Stats</h4>
                  <p>Hunger: 85%</p>
                  <p>Happiness: 92%</p>
                  <p>Health: 96%</p>
                </div>
              </div>
            </div>
          </template>
          <template #inventory>
            <div class="gps-panel-section">
              <h3>📦 Inventory Management</h3>
              <p>Manage your items, food, and supplies for your guinea pig.</p>
              <div class="gps-specimen__demo-list">
                <div class="gps-specimen__demo-item">🌾 Hay: 10 units</div>
                <div class="gps-specimen__demo-item">🥕 Carrots: 5 units</div>
                <div class="gps-specimen__demo-item">🥬 Lettuce: 3 units</div>
              </div>
            </div>
          </template>
          <template #profile>
            <div class="gps-panel-section">
              <h3>👤 Profile Settings</h3>
              <p>Update your profile information and preferences.</p>
              <Button type="secondary" size="compact">Edit Profile</Button>
            </div>
          </template>
        </Tabs>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Tabs with Badges</h2>
      <p class="gps-specimen__section-desc">Tabs can display badges to show counts, notifications, or status indicators.</p>
      <div class="gps-specimen__examples">
        <Tabs :tabs="badgeTabs" v-model="badgeTabValue">
          <template #messages>
            <div class="gps-panel-section">
              <h3>💬 Messages</h3>
              <p>You have 3 unread messages from other guinea pig owners.</p>
              <div class="gps-specimen__demo-messages">
                <div class="gps-specimen__demo-message">
                  <strong>PigLover42:</strong> "How do you keep your guinea pig so happy?"
                </div>
                <div class="gps-specimen__demo-message">
                  <strong>CarrotFan:</strong> "Check out my new cage setup!"
                </div>
                <div class="gps-specimen__demo-message">
                  <strong>GuineaExpert:</strong> "Tips for better nutrition?"
                </div>
              </div>
            </div>
          </template>
          <template #notifications>
            <div class="gps-panel-section">
              <h3>🔔 Notifications</h3>
              <p>You have 7 new notifications about your guinea pig's activities.</p>
              <div class="gps-specimen__demo-notifications">
                <div class="gps-specimen__demo-notification">Your guinea pig ate some hay</div>
                <div class="gps-specimen__demo-notification">Time to clean the cage</div>
                <div class="gps-specimen__demo-notification">New items available in market</div>
              </div>
            </div>
          </template>
          <template #updates>
            <div class="gps-panel-section">
              <h3>🔄 Updates</h3>
              <p>No recent updates available.</p>
              <Button type="flat" size="compact">Check for Updates</Button>
            </div>
          </template>
        </Tabs>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Compact Tabs</h2>
      <p class="gps-specimen__section-desc">Smaller tabs for constrained spaces or dense interfaces.</p>
      <div class="gps-specimen__examples">
        <Tabs :tabs="compactTabs" variant="compact" v-model="compactTabValue">
          <template #stats>
            <div class="gps-panel-section">
              <h4>Statistics</h4>
              <p>Compact view of your guinea pig's key statistics.</p>
            </div>
          </template>
          <template #history>
            <div class="gps-panel-section">
              <h4>History</h4>
              <p>Recent activity and interaction history.</p>
            </div>
          </template>
          <template #logs>
            <div class="gps-panel-section">
              <h4>Logs</h4>
              <p>System logs and debugging information.</p>
            </div>
          </template>
        </Tabs>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Rounded Tabs</h2>
      <p class="gps-specimen__section-desc">Alternative styling with rounded tab buttons.</p>
      <div class="gps-specimen__examples">
        <Tabs :tabs="roundedTabs" variant="rounded" v-model="roundedTabValue">
          <template #basic>
            <div class="gps-panel-section">
              <h4>Basic Options</h4>
              <p>Essential settings and basic configuration options.</p>
              <Button type="primary" size="compact">Apply Changes</Button>
            </div>
          </template>
          <template #advanced>
            <div class="gps-panel-section">
              <h4>Advanced Options</h4>
              <p>Advanced configuration for power users.</p>
              <Button type="warning" size="compact">Reset to Defaults</Button>
            </div>
          </template>
          <template #expert>
            <div class="gps-panel-section">
              <h4>Expert Mode</h4>
              <p>Expert-level settings. Use with caution!</p>
              <Button type="danger" size="compact">Enable Expert Mode</Button>
            </div>
          </template>
        </Tabs>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Interactive Example</h2>
      <p class="gps-specimen__section-desc">Try switching tabs and see the tab change events in action.</p>
      <div class="gps-specimen__examples">
        <div class="gps-panel-section">
          <p><strong>Current Tab:</strong> {{ currentTab?.label || 'None' }}</p>
          <p><strong>Tab Index:</strong> {{ currentTabIndex }}</p>
          <p><strong>Tab Changes:</strong> {{ tabChangeCount }}</p>
        </div>
        <Tabs :tabs="interactiveTabs" v-model="interactiveTabValue" @tabChange="handleTabChange">
          <template #tab1>
            <div class="gps-panel-section">
              <h4>First Tab</h4>
              <p>This is the content of the first tab. The tab change event will fire when you switch.</p>
            </div>
          </template>
          <template #tab2>
            <div class="gps-panel-section">
              <h4>Second Tab</h4>
              <p>Second tab content. Notice how the tab information updates above.</p>
            </div>
          </template>
          <template #tab3>
            <div class="gps-panel-section">
              <h4>Third Tab</h4>
              <p>Third tab content. Try using keyboard arrows to navigate between tabs!</p>
            </div>
          </template>
        </Tabs>
      </div>
    </div>

    <div class="gps-specimen__section">
      <h2 class="gps-specimen__section-title">Usage Examples</h2>
      <p class="gps-specimen__section-desc">Common patterns and code examples for implementing tabs.</p>
      <div class="gps-specimen__code-block">
        <h4>Basic Implementation</h4>
        <pre><code>&lt;Tabs :tabs="tabs" v-model="activeTab"&gt;
  &lt;template #overview&gt;
    &lt;div&gt;Overview content&lt;/div&gt;
  &lt;/template&gt;
  &lt;template #details&gt;
    &lt;div&gt;Details content&lt;/div&gt;
  &lt;/template&gt;
&lt;/Tabs&gt;</code></pre>
      </div>
      
      <div class="gps-specimen__code-block">
        <h4>With Icons and Badges</h4>
        <pre><code>const tabs = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'messages', label: 'Messages', icon: '💬', badge: '3' },
  { id: 'settings', label: 'Settings', icon: '⚙️' }
]</code></pre>
      </div>
    </div>

  </SpecimenPage>
</template>

<script setup>
import { ref } from 'vue'
import SpecimenPage from './SpecimenPage.vue'
import Tabs from '../shared/Tabs.vue'
import Button from '../shared/Button.vue'

defineEmits(['backToLanding'])

// Basic tabs data
const basicTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'details', label: 'Details' },
  { id: 'settings', label: 'Settings' }
]
const basicTabValue = ref('overview')

// Icon tabs data
const iconTabs = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'inventory', label: 'Inventory', icon: '📦' },
  { id: 'profile', label: 'Profile', icon: '👤' }
]
const iconTabValue = ref('home')

// Badge tabs data
const badgeTabs = [
  { id: 'messages', label: 'Messages', icon: '💬', badge: '3' },
  { id: 'notifications', label: 'Notifications', icon: '🔔', badge: '7' },
  { id: 'updates', label: 'Updates', icon: '🔄' }
]
const badgeTabValue = ref('messages')

// Compact tabs data
const compactTabs = [
  { id: 'stats', label: 'Stats' },
  { id: 'history', label: 'History' },
  { id: 'logs', label: 'Logs' }
]
const compactTabValue = ref('stats')

// Rounded tabs data
const roundedTabs = [
  { id: 'basic', label: 'Basic' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'expert', label: 'Expert' }
]
const roundedTabValue = ref('basic')

// Interactive tabs data
const interactiveTabs = [
  { id: 'tab1', label: 'First Tab' },
  { id: 'tab2', label: 'Second Tab' },
  { id: 'tab3', label: 'Third Tab' }
]
const interactiveTabValue = ref('tab1')
const currentTab = ref(interactiveTabs[0])
const currentTabIndex = ref(0)
const tabChangeCount = ref(0)

// Handle tab change events
const handleTabChange = ({ tab, index }) => {
  currentTab.value = tab
  currentTabIndex.value = index
  tabChangeCount.value++
}
</script>

<style>
/* Demo specific styles */
.gps-specimen__demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.gps-specimen__demo-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.gps-specimen__demo-item {
  padding: 0.5rem;
  background: var(--color-panel);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.gps-specimen__demo-messages,
.gps-specimen__demo-notifications {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.gps-specimen__demo-message,
.gps-specimen__demo-notification {
  padding: 0.75rem;
  background: var(--color-panel);
  border-radius: var(--border-radius);
  border-left: 3px solid var(--color-accent);
}

.gps-specimen__code-block {
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin: 1rem 0;
}

.gps-specimen__code-block h4 {
  margin: 0 0 0.5rem 0;
  color: var(--color-accent);
  font-size: var(--font-size-sm);
}

.gps-specimen__code-block pre {
  margin: 0;
  padding: 0;
  background: none;
  color: var(--color-text);
  font-family: 'Courier New', monospace;
  font-size: var(--font-size-xs);
  white-space: pre-wrap;
  word-wrap: break-word;
}

.gps-specimen__code-block code {
  background: none;
  padding: 0;
  color: var(--color-text);
  font-family: inherit;
}
</style>