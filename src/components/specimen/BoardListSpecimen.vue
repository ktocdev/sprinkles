<template>
  <SpecimenPage 
    title="BoardList Component"
    description="A dynamic list component for displaying Guinea Pig needs and other information with optional urgency indicators."
    @backToLanding="$emit('backToLanding')"
  >
    <!-- Basic Example -->
    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">Basic List</h3>
      <p class="gps-specimen__section-desc">
        Simple text-based list without urgency indicators.
      </p>
      <div class="gps-specimen__examples">
        <BoardList :items="basicItems" />
      </div>
    </div>

    <!-- Urgency Example -->
    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">List with Urgency Indicators</h3>
      <p class="gps-specimen__section-desc">
        List items with urgency levels showing different visual states.
      </p>
      <div class="gps-specimen__examples">
        <BoardList :items="urgencyItems" :showUrgency="true" />
      </div>
    </div>

    <!-- Live Needs Example -->
    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">Live Guinea Pig Needs</h3>
      <p class="gps-specimen__section-desc">
        Real-time display of Guinea Pig needs from the needs system. The list updates automatically as needs change.
      </p>
      <div class="gps-specimen__examples">
        <BoardList 
          :items="liveNeedsItems" 
          :showUrgency="true" 
          emptyMessage="All needs are satisfied! 🐹✨"
        />
      </div>
    </div>

    <!-- Empty State Example -->
    <div class="gps-specimen__section">
      <h3 class="gps-specimen__section-title">Empty State</h3>
      <p class="gps-specimen__section-desc">
        How the component appears when there are no items to display.
      </p>
      <div class="gps-specimen__examples">
        <BoardList 
          :items="[]" 
          emptyMessage="No items to display in this example"
        />
      </div>
    </div>

    <!-- Usage Guidelines -->
    <div class="gps-specimen__section">
      <div class="gps-specimen__guidelines">
        <h3>Usage Guidelines</h3>
        <ul>
          <li><strong>Items prop</strong>: Accepts array of strings or objects with message/urgency properties</li>
          <li><strong>Show Urgency</strong>: Enable urgency indicators with showUrgency prop</li>
          <li><strong>Empty Message</strong>: Customize the message shown when list is empty</li>
          <li><strong>Responsive</strong>: Automatically adapts to different screen sizes</li>
          <li><strong>Theme Support</strong>: Follows the application's light/dark theme</li>
          <li><strong>Urgency Levels</strong>: Normal (0-50%), Urgent (51-80%), Critical (81-100%)</li>
        </ul>
      </div>
    </div>

    <!-- API Reference -->
    <div class="gps-specimen__section">
      <div class="gps-specimen__guidelines">
        <h3>Props</h3>
        <ul>
          <li><strong>items</strong>: Array - List of items to display (required)</li>
          <li><strong>showUrgency</strong>: Boolean - Show urgency indicators (default: false)</li>
          <li><strong>emptyMessage</strong>: String - Message when list is empty (default: "No items to display")</li>
        </ul>
      </div>
    </div>
  </SpecimenPage>
</template>

<script setup>
import { computed, defineEmits, onMounted } from 'vue'
import SpecimenPage from './SpecimenPage.vue'
import BoardList from '../shared/BoardList.vue'
import { useNeedsQueueStore } from '../../stores/needs/needsQueue'

const emit = defineEmits(['backToLanding'])

const needsQueueStore = useNeedsQueueStore()

// Basic example items
const basicItems = [
  "Guinea pig is resting peacefully",
  "Guinea pig is exploring the cage",
  "Guinea pig is making happy sounds",
  "Guinea pig is grooming itself"
]

// Example items with urgency
const urgencyItems = [
  { message: "Guinea pig is slightly hungry", urgency: 25 },
  { message: "Guinea pig is getting thirsty", urgency: 60 },
  { message: "Guinea pig is very hungry", urgency: 85 },
  { message: "Guinea pig is content", urgency: 10 }
]

// Live needs from the needs system
const liveNeedsItems = computed(() => {
  if (!needsQueueStore.queue || needsQueueStore.queue.length === 0) {
    return []
  }

  return needsQueueStore.queue.map(need => {
    const urgencyLevel = need.urgency > 80 ? 'critically' : 
                        need.urgency > 50 ? 'very' : 
                        need.urgency > 25 ? 'somewhat' : 'slightly'
    
    const needName = need.name === 'hunger' ? 'hungry' :
                    need.name === 'thirst' ? 'thirsty' :
                    need.name === 'shelter' ? 'seeking shelter' :
                    need.name === 'chew' ? 'needing to chew' :
                    need.name === 'enrichment' ? 'needing enrichment' :
                    need.name === 'love' ? 'needing attention' :
                    need.name === 'nails' ? 'needing nail care' :
                    need.name === 'hygiene' ? 'needing grooming' :
                    need.name

    return {
      message: `Guinea pig is ${urgencyLevel} ${needName}`,
      urgency: need.urgency
    }
  })
})

// Only start the needs system if it's currently active (respects user debug panel settings)
onMounted(() => {
  if (needsQueueStore.isActive) {
    needsQueueStore.startNeedsSystem()
  }
})
</script>

<style>
/* Additional styling specific to BoardList specimen */
.gps-specimen__examples .gps-board-list {
  max-width: 100%;
}

/* Ensure proper spacing between examples */
.gps-specimen__examples > * + * {
  margin-block-start: 1rem;
}
</style>