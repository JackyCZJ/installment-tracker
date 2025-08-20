import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import i18n from './i18n'

const app = createApp(App)

app.use(createPinia())
app.use(i18n)

app.mount('#app')

// 注册 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .then(() => {
        // Service Worker registered successfully
      })
      .catch(() => {
        // Service Worker registration failed
      })
  })
}
