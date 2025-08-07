<template>
  <div class="container mt-5">
    <h2 class="mb-4">🛒 Carrito de Compras</h2>

    <div v-if="cart.items.length">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart.items" :key="item._id">
            <td>{{ item.nombre }}</td>
            <td>${{ item.precio }}</td>
            <td>{{ item.cantidad }}</td>
            <td>${{ item.precio * item.cantidad }}</td>
            <td>
              <button class="btn btn-sm btn-danger" @click="cart.quitarDelCarrito(item._id)">
                Quitar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex justify-content-between align-items-center mt-4">
        <h4>Total: ${{ cart.totalPrecio }}</h4>
        <button class="btn btn-success" :disabled="cargando" @click="irAFormularioPedido">
          <span v-if="cargando">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Procesando...
          </span>
          <span v-else>
            Finalizar Compra
          </span>
        </button>
      </div>
    </div>

    <div v-else>
      <p>Tu carrito está vacío.</p>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const cart = useCartStore()
const router = useRouter()
const cargando = ref(false)

function irAFormularioPedido() {
  cargando.value = true
  try {
    const productos = cart.items.map(item => ({
      nombre: item.nombre,
      cantidad: Number(item.cantidad),
      precio: Number(item.precio)
    }))
    
    router.push({
      name: 'FormularioPedido',
      query: {
        productos: JSON.stringify(productos)
      }
    })
  } catch (error) {
    console.error('❌ Error al redirigir al formulario:', error)
    alert('❌ No se pudo continuar con el pedido.')
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
