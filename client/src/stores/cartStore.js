import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  function agregarAlCarrito(producto) {
    const existente = items.value.find(p => p._id === producto._id)
    if (existente) {
      existente.cantidad += 1
    } else {
      items.value.push({ ...producto, cantidad: 1 })
    }
  }

  function quitarDelCarrito(id) {
    items.value = items.value.filter(p => p._id !== id)
  }

  function vaciarCarrito() {
    items.value = []
  }

  const totalCantidad = computed(() =>
    items.value.reduce((sum, p) => sum + p.cantidad, 0)
  )

  const totalPrecio = computed(() =>
    items.value.reduce((sum, p) => sum + p.precio * p.cantidad, 0)
  )

  async function realizarCompra() {
    try {
      // 1. Guardar la orden en la base de datos (opcional pero recomendado)
      await axios.post('https://e-commerce-nw9h.onrender.com/api/ordenes', {
        productos: items.value,
        total: totalPrecio.value
      })

      // 2. Formatear productos para MercadoPago
      const productosMP = items.value.map(p => ({
        title: p.nombre,
        quantity: p.cantidad,
        unit_price: p.precio,
        currency_id: 'COP'
      }))

      // 3. Crear preferencia de pago
      const response = await axios.post('https://e-commerce-nw9h.onrender.com/api/ordenes/pago', {
        productos: productosMP
      })

      // 4. Redirigir al checkout de MercadoPago
      window.location.href = response.data.init_point
    } catch (error) {
      console.error('❌ Error al procesar la compra:', error)
      alert('❌ Hubo un error al procesar la compra. Intenta de nuevo.')
    }
  }

  return {
    items,
    agregarAlCarrito,
    quitarDelCarrito,
    vaciarCarrito,
    totalCantidad,
    totalPrecio,
    realizarCompra,
  }
})
