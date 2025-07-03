import { createRouter, createWebHistory } from 'vue-router'
import OrderView from '@/views/OrderView.vue'
import KitchenView from '@/views/KitchenView.vue'
import HistoryView from '@/views/HistoryView.vue'
import CustomerOrderView from '@/views/CustomerOrderView.vue'
import CustomerQueueView from '@/views/CustomerQueueView.vue'

const routes = [
  { path: '/', redirect: '/order' },
  { path: '/order', component: OrderView },
  { path: '/order/:id', name: 'CustomerOrder', component: CustomerOrderView },
  { path: '/kitchen', component: KitchenView },
  { path: '/history', component: HistoryView },
  { path: '/queue', component: CustomerQueueView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
