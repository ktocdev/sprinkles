<script setup>
import Cage from '../cage/Cage.vue'
import StatusMarquee from '../cage/StatusMarquee.vue'
import CageItemManager from '../cage/CageItemManager.vue'
</script>

<template>
  <div class="gps-main">
    <div>
      <div>
        <div>
          <div>
            <Cage />
            <StatusMarquee />
          </div>
          <CageItemManager />
        </div>
      </div>
    </div>
  </div>
</template>
