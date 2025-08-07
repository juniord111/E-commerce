<template>
  <div class="container">
    <div v-if="producto" class="product-detail">
      <img :src="producto.imagenUrl" :alt="producto.nombre" class="product-image" />

      <div class="info">
        <h1>{{ producto.nombre }}</h1>
        <p class="price">Precio: ${{ producto.precio }}</p>
        <p class="description">{{ producto.descripcion }}</p>

        <div class="colors" v-if="producto.colores?.length">
          <p>Colores disponibles:</p>
          <ul>
            <li v-for="(color, index) in producto.colores" :key="index">
              {{ color }}
            </li>
          </ul>
        </div>

        <div class="actions">
          <button @click="agregarAlCarrito">Agregar al carrito</button>
          <button @click="irAlFormularioDePedido">Comprar ahora</button>
        </div>
      </div>
    </div>

    <div v-else>
      <p>Producto no encontrado.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'

const route = useRoute()
const router = useRouter()
const productoId = route.params.id
const store = useProductStore()
const cartStore = useCartStore()

onMounted(async () => {
  if (store.productos.length === 0) {
    await store.fetchProductos()
  }
})

const producto = computed(() =>
  store.productos.find(p => p._id === productoId)
)

function agregarAlCarrito() {
  if (producto.value) {
    cartStore.agregarAlCarrito(producto.value)
    alert(`🛒 Producto "${producto.value.nombre}" agregado al carrito`)
  }
}

// 🚀 Reemplaza el pago directo por redirección al formulario
function irAlFormularioDePedido() {
  if (producto.value) {
    const payload = [
      {
        id: producto.value._id,
        nombre: producto.value.nombre,
        precio: producto.value.precio
      }
    ]
    router.push({
      path: '/pedido',
      query: {
        productos: JSON.stringify(payload)
      }
    })
  }
}
</script>

<style scoped>
.container {
  padding: 2rem;
}
.product-detail {
  display: flex;
  gap: 2rem;
}
.product-image {
  width: 300px;
  height: auto;
  border-radius: 8px;
}
.info {
  max-width: 600px;
}
.price {
  font-size: 1.5rem;
  color: #2e7d32;
}
.description {
  margin: 1rem 0;
}
.colors ul {
  list-style: none;
  padding: 0;
}
.colors li {
  background: #f0f0f0;
  margin: 0.25rem 0;
  padding: 0.5rem;
  border-radius: 5px;
}
.actions {
  margin-top: 1.5rem;
}
.actions button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
