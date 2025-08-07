<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Dashboard de Administrador</h2>
      <nav class="nav nav-pills">
        <button class="nav-link" :class="{ active: seccion === 'productos' }" @click="seccion = 'productos'">Productos</button>
        <button class="nav-link" :class="{ active: seccion === 'estadisticas' }" @click="seccion = 'estadisticas'">Estadísticas</button>
        <button class="nav-link" :class="{ active: seccion === 'historial' }" @click="seccion = 'historial'">Historial de Compras</button>

      </nav>
    </div>

    <ProductosDashboard v-if="seccion === 'productos'" />
    <EstadisticasDashboard v-if="seccion === 'estadisticas'" />
    <HistorialGlobal v-if="seccion === 'historial'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProductosDashboard from '@/components/ProductosDashboard.vue'
import EstadisticasDashboard from '@/components/EstadisticasDashboard.vue'
import HistorialGlobal from '@/components/HistorialGlobal.vue'
const seccion = ref('productos')
</script>

<style scoped>
.nav-link {
  cursor: pointer;
}
</style>
