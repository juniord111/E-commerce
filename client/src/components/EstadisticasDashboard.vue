<template>
  <div>
    <h4 class="mb-4">Estadísticas</h4>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else-if="loading">
      <p>Cargando estadísticas...</p>
    </div>

    <div v-else>
      <div class="row">
        <div class="col-md-6">
          <div class="card text-white bg-success mb-3">
            <div class="card-body">
              <h5 class="card-title">Ingresos Totales</h5>
              <p class="card-text fs-4">${{ ingresosTotales }}</p>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card text-white bg-primary mb-3">
            <div class="card-body">
              <h5 class="card-title">Productos Vendidos</h5>
              <p class="card-text fs-4">{{ productosVendidos }}</p>
            </div>
          </div>
        </div>
      </div>

      <SalesChart :dataValues="ingresosMensuales" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import SalesChart from '@/components/SalesChart.vue'

const ingresosTotales = ref(0)
const productosVendidos = ref(0)
const ingresosMensuales = ref([0, 0, 0, 0, 0, 0])
const error = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')

    if (!token) {
      error.value = 'Token no encontrado. Por favor inicia sesión nuevamente.'
      loading.value = false
      return
    }

    const res = await api.get('/ordenes/estadisticas', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    ingresosTotales.value = res.data.ingresosTotales
    productosVendidos.value = res.data.totalProductosVendidos
    ingresosMensuales.value = res.data.ingresosMensuales

    console.log('✅ Estadísticas cargadas:', res.data)
  } catch (err) {
    console.error('❌ Error cargando estadísticas:', err)
    error.value = err.response?.data?.error || 'Error al cargar estadísticas'
  } finally {
    loading.value = false
  }
})
</script>
