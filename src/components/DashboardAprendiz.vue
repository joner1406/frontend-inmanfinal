<template>
  <div class="space-y-8">
    <!-- Banner de bienvenida -->
    <div class="card-elevated p-8 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100">
      <div class="flex flex-col md:flex-row items-center justify-between">
        <div class="text-center md:text-left mb-6 md:mb-0">
          <h1 class="text-3xl font-bold text-gray-900 font-heading mb-2">¡Bienvenido, {{ currentUser?.nombre }}!</h1>
          <p class="text-gray-600 font-body">Sistema de Gestión de Equipos - Rol: Aprendiz</p>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
          <i class="fas fa-qrcode text-5xl text-indigo-600"></i>
        </div>
      </div>
    </div>

    <!-- Estadísticas del Aprendiz -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="card-elevated p-6">
        <div class="flex items-center justify-between">
          <div class="space-y-2">
            <p class="text-sm font-medium text-gray-600 font-body uppercase tracking-wide">Equipo Asignado</p>
            <p class="text-3xl font-bold text-indigo-600 font-heading">
              {{ equipoAsignado ? equipoAsignado.nombre : 'Ninguno' }}
            </p>
            <p v-if="equipoAsignado" class="text-sm text-gray-500 font-body">
              {{ equipoAsignado.tipo }} - {{ equipoAsignado.modelo }}
            </p>
          </div>
          <div class="icon-container bg-indigo-100">
            <i class="fas fa-laptop-code text-indigo-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="card-elevated p-6">
        <div class="flex items-center justify-between">
          <div class="space-y-2">
            <p class="text-sm font-medium text-gray-600 font-body uppercase tracking-wide">Estado del Equipo</p>
            <p class="text-3xl font-bold font-heading" :class="{
              'text-green-600': equipoAsignado?.estado === 'disponible',
              'text-yellow-600': equipoAsignado?.estado === 'mantenimiento',
              'text-gray-600': !equipoAsignado
            }">
              {{ getEstadoTexto(equipoAsignado?.estado) }}
            </p>
            <p v-if="equipoAsignado?.ultimo_mantenimiento" class="text-xs text-gray-500 font-body">
              Último mantenimiento: {{ formatDate(equipoAsignado.ultimo_mantenimiento) }}
            </p>
          </div>
          <div class="icon-container" :class="{
            'bg-green-100': equipoAsignado?.estado === 'disponible',
            'bg-yellow-100': equipoAsignado?.estado === 'mantenimiento',
            'bg-gray-100': !equipoAsignado
          }">
            <i class="fas fa-check-circle text-xl" :class="{
              'text-green-600': equipoAsignado?.estado === 'disponible',
              'text-yellow-600': equipoAsignado?.estado === 'mantenimiento',
              'text-gray-600': !equipoAsignado
            }"></i>
          </div>
        </div>
      </div>

      <div class="card-elevated p-6">
        <div class="flex items-center justify-between">
          <div class="space-y-2">
            <p class="text-sm font-medium text-gray-600 font-body uppercase tracking-wide">Acciones Rápidas</p>
            <div class="space-y-2 mt-2">
              <button @click="irAEscanner" class="w-full btn-primary">
                <i class="fas fa-qrcode mr-2"></i>Escanear Código QR
              </button>
              <button @click="reportarProblema" class="w-full btn-secondary">
                <i class="fas fa-exclamation-circle mr-2"></i>Reportar Problema
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Instrucciones para el Aprendiz -->
    <div class="card-elevated p-8">
      <h3 class="text-2xl font-bold text-gray-900 mb-6 font-heading">Instrucciones</h3>
      <div class="space-y-4">
        <div class="flex items-start space-x-4">
          <div class="icon-container bg-blue-100 mt-1">
            <i class="fas fa-1 text-blue-600"></i>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 font-body">Vincula tu equipo</h4>
            <p class="text-gray-600 font-body">Usa el escáner QR para vincular tu equipo asignado al inicio de la sesión.</p>
          </div>
        </div>
        <div class="flex items-start space-x-4">
          <div class="icon-container bg-blue-100 mt-1">
            <i class="fas fa-2 text-blue-600"></i>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 font-body">Reporta problemas</h4>
            <p class="text-gray-600 font-body">Si encuentras algún problema con tu equipo, repórtalo de inmediato.</p>
          </div>
        </div>
        <div class="flex items-start space-x-4">
          <div class="icon-container bg-blue-100 mt-1">
            <i class="fas fa-3 text-blue-600"></i>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 font-body">Solicita mantenimiento</h4>
            <p class="text-gray-600 font-body">Si tu equipo requiere mantenimiento, notifícalo para programar una revisión.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useApi } from '../composables/useApi'

export default {
  name: 'DashboardAprendiz',
  
  props: {
    setActiveModule: {
      type: Function,
      required: true
    }
  },
  
  setup(props) {
    const { currentUser } = useAuth()
    const { apiCall } = useApi()
    
    const equipoAsignado = ref(null)
    const cargando = ref(true)
    
    // Obtener el equipo asignado al aprendiz
    const obtenerEquipoAsignado = async () => {
      try {
        cargando.value = true
        const response = await apiCall({
          method: 'GET',
          url: '/api/aprendiz/equipo-asignado'
        })
        
        if (response.data) {
          equipoAsignado.value = response.data
        }
      } catch (error) {
        console.error('Error al obtener equipo asignado:', error)
      } finally {
        cargando.value = false
      }
    }
    
    const getEstadoTexto = (estado) => {
      const estados = {
        'disponible': 'Disponible',
        'en_uso': 'En uso',
        'mantenimiento': 'En mantenimiento',
        'baja': 'Dado de baja'
      }
      return estados[estado] || 'No asignado'
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return 'Nunca'
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('es-ES', options)
    }
    
    const irAEscanner = () => {
      props.setActiveModule('qr')
    }
    
    const reportarProblema = () => {
      // Implementar lógica para reportar problema
      console.log('Reportar problema')
      // Aquí podrías abrir un modal o redirigir a un formulario de reporte
    }
    
    onMounted(() => {
      obtenerEquipoAsignado()
    })
    
    return {
      currentUser,
      equipoAsignado,
      cargando,
      getEstadoTexto,
      formatDate,
      irAEscanner,
      reportarProblema
    }
  }
}
</script>

<style scoped>
/* Estilos para el dashboard del aprendiz */
.card-elevated {
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.card-elevated:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: #4f46e5;
  color: white;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #4338ca;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: #e0e7ff;
  color: #4f46e5;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s;
  border: 1px solid #c7d2fe;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #c7d2fe;
}

.font-heading {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-weight: 700;
}

.font-body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .card-elevated {
    padding: 1.25rem;
  }
  
  .icon-container {
    width: 2.5rem;
    height: 2.5rem;
  }
}

/* Estilos para el estado de carga */
.loading-spinner {
  border: 3px solid rgba(79, 70, 229, 0.3);
  border-radius: 50%;
  border-top: 3px solid #4f46e5;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
