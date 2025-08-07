<template>
  <div class="container mt-4">
    <h3>Mi Historial de Compras</h3>
    <div v-if="ordenes.length === 0">No tienes compras registradas.</div>
    <ul v-else>
      <li v-for="orden in ordenes" :key="orden._id">
        {{ orden.fecha }} - ${{ orden.total }} - Estado: {{ orden.estado }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
const ordenes = ref([])
const token = localStorage.getItem('token')
onMounted(async () => {
  
  try {
    const res = await api.get('/ordenes/mis-compras', {
      headers: { Authorization: `Bearer ${token}` }
    })
    ordenes.value = res.data
  } catch (err) {
    console.error('❌ Error al cargar historial:', err)
  }
})
</script>
