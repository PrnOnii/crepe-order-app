import { createRouter, createWebHistory } from 'vue-router'
import OrderView from '@/views/OrderView.vue'
import KitchenView from '@/views/KitchenView.vue'

const routes = [
  { path: '/', redirect: '/order' },
  { path: '/order', component: OrderView },
  { path: '/kitchen', component: KitchenView }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
