import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

import './assets/main.css' // We'll use this for Tailwind soon

createApp(App).use(router).mount('#app')
