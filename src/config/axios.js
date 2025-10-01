import axios from 'axios'

// Configuración global de axios
axios.defaults.baseURL = 'https://backend-inmanfinal-nf20.onrender.com'
axios.defaults.withCredentials = true

export default axios
