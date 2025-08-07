<template>
  <div class="container">
    <h1 class="page-title">Productos Disponibles</h1>

    <!-- 🔍 Buscador -->
    <div class="buscador-container">
      <input
        v-model="busqueda"
        type="text"
        placeholder="Buscar producto por nombre..."
        class="buscador-input"
      />
    </div>

    <!-- 🛍️ Lista de productos filtrados -->
    <div v-if="productosFiltrados.length > 0" class="productos-grid">
      <div v-for="producto in productosFiltrados" :key="producto._id" class="card">
        <img :src="producto.imagenUrl" alt="producto" class="imagen" />
        <div class="card-content">
          <h2 class="titulo">{{ producto.nombre }}</h2>
          <p class="precio">$ {{ producto.precio }}</p>
          <router-link :to="`/producto/${producto._id}`" class="btn">Ver más</router-link>
        </div>
      </div>
    </div>

    <div v-else>
      <p class="mensaje-cargando">
        No se encontraron productos que coincidan con la búsqueda.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useProductStore } from '@/stores/productStore'

const store = useProductStore()
const productos = computed(() => store.productos)
const busqueda = ref('')

onMounted(async () => {
  console.log('Mounted: llamando a fetchProductos')
  await store.fetchProductos()
})

// 🔍 Filtrar productos según el input de búsqueda
const productosFiltrados = computed(() => {
  const termino = busqueda.value.toLowerCase().trim()
  if (!termino) return productos.value
  return productos.value.filter(producto =>
    producto.nombre.toLowerCase().includes(termino)
  )
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  background-color: #f9f9f9;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  color: #1e1e1e;
}

/* 🔎 Estilos del buscador */
.buscador-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2.5rem;
}

.buscador-input {
  width: 100%;
  max-width: 400px;
  padding: 0.7rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 30px;
  outline: none;
  transition: border 0.3s ease;
}

.buscador-input:focus {
  border-color: #0d6efd;
}

.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.card {
  background-color: #ffffff;
  border-radius: 1.25rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.imagen {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.titulo {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.precio {
  font-weight: bold;
  color: #2e7d32;
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
}

.btn {
  align-self: center;
  display: inline-block;
  padding: 0.55rem 1.5rem;
  background-color: #0d6efd;
  color: #ffffff;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 500;
  font-size: 0.95rem;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #0b5ed7;
}

.mensaje-cargando {
  text-align: center;
  font-weight: 600;
  color: #555;
  margin-top: 2rem;
}
</style>
