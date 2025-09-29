import { ref, computed } from 'vue'
import axios from 'axios'

const currentUser = ref(null)
const userPermissions = ref({})
const isAuthenticated = ref(false)

export const useAuth = () => {
  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials)
      console.log('Respuesta de login:', response.data);

      if (response.data.success) {
        currentUser.value = response.data.user
        userPermissions.value = response.data.permissions || {}
        isAuthenticated.value = true
        
        console.log('Usuario autenticado:', currentUser.value);
        console.log('Permisos:', userPermissions.value);
        
        return { success: true }
      } else {
        return { success: false, error: response.data.error }
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error de conexión'
      }
    }
  }

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      currentUser.value = null
      userPermissions.value = {}
      isAuthenticated.value = false
    }
  }

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/auth/current-user')
      console.log('Respuesta de checkAuth:', response.data);

      if (response.data.authenticated) {
        currentUser.value = response.data.user
        userPermissions.value = response.data.permissions || {}
        isAuthenticated.value = true
        
        console.log('Usuario verificado:', currentUser.value);
        console.log('Permisos:', userPermissions.value);
        
        return true
      }
      return false
    } catch (error) {
      console.error('Auth check error:', error)
      return false
    }
  }

  const availableModules = computed(() => {
    const allModules = [
      { id: 'dashboard', name: 'Dashboard', icon: 'fas fa-chart-line' },
      { id: 'equipos', name: 'Equipos', icon: 'fas fa-desktop' },
      { id: 'reportes', name: 'Reportes', icon: 'fas fa-exclamation-triangle' },
      { id: 'monitoreo', name: 'Monitoreo', icon: 'fas fa-eye' },
      { id: 'mantenimientos', name: 'Mantenimientos', icon: 'fas fa-tools' },
      { id: 'qr', name: 'Escáner QR', icon: 'fas fa-qrcode' },
    ]

    // Si el usuario es un Aprendiz, solo mostrar Dashboard y Escáner QR
    const esAprendiz = currentUser.value?.perfil?.toLowerCase() === 'aprendiz';
    
    if (esAprendiz) {
      return allModules.filter(module => 
        module.id === 'dashboard' || module.id === 'qr'
      );
    }

    // Para otros roles, usar los módulos permitidos según sus permisos
    const userModules = userPermissions.value?.modules || [];
    return allModules.filter(module => 
      userModules.includes(module.id) || module.id === 'dashboard'
    );
  })

  return {
    currentUser,
    userPermissions,
    isAuthenticated,
    availableModules,
    login,
    logout,
    checkAuth
  }
}
