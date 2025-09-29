import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import axios from 'axios'

// Configure axios para conexión directa
axios.defaults.baseURL = 'https://backend-inmanfinal-nf20.onrender.com'
axios.defaults.withCredentials = true

export default axios;

const app = createApp(App)
app.mount('#app')
