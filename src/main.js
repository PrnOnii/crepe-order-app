import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

import './assets/main.css'

createApp(App)
    .use(router)
    .use(Toast, {
        position: 'top-center',
        timeout: 3000,
        closeOnClick: true,
        pauseOnHover: true
      })
    .mount('#app')
