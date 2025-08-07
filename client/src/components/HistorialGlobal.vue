<template>
  <div>
    <h4>Historial de Compras (Todos los usuarios)</h4>
    <ul class="list-group">
      <li class="list-group-item" v-for="orden in ordenes" :key="orden._id">
        <strong>{{ orden.usuarioNombre }}</strong> - 
        ${{ orden.total }} - 
        {{ new Date(orden.createdAt).toLocaleDateString() }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
const token = localStorage.getItem('token')
const ordenes = ref([])

onMounted(async () => {
  try {
    const res = await api.get('/ordenes/todas', {
      headers: { Authorization: `Bearer ${token}` }
    })
    ordenes.value = res.data
  } catch (err) {
    console.error('❌ Error cargando historial global:', err)
  }
})
</script>
