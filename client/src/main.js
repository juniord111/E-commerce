// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'


import 'vuetify/styles' // Import Vuetify styles
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import './assets/main.css' // si usas estilos

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(vuetify)
app.mount('#app')
