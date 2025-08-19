import { createRouter, createWebHistory } from 'vue-router'
import SwatchesExplorer from '../components/experiments/swatches/SwatchesExplorer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/swatches',
      name: 'swatches',
      component: SwatchesExplorer
    }
  ]
})

export default router