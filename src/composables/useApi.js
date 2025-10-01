import { ref } from 'vue'
import axios from 'axios'

// Configurar axios aquí también para asegurar que funcione
axios.defaults.baseURL = 'https://backend-inmanfinal-nf20.onrender.com'
axios.defaults.withCredentials = true

export const useApi = () => {
  const loading = ref(false)
  const error = ref(null)

  const apiCall = async (method, url, data = null) => {
    loading.value = true
    error.value = null

    try {
      const config = { method, url }
      if (data) config.data = data

      const response = await axios(config)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    apiCall
  }
}
