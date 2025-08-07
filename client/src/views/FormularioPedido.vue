<template>
  <div class="container mt-5">
    <h2 class="mb-4">📝 Confirmar Pedido</h2>

    <form @submit.prevent="pagoOnline">
      <div class="mb-3">
        <label class="form-label">Nombre completo</label>
        <input v-model="form.nombre" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Dirección</label>
        <input v-model="form.direccion" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Barrio</label>
        <input v-model="form.barrio" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Ciudad</label>
        <input v-model="form.ciudad" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Número de contacto</label>
        <input v-model="form.contacto" type="tel" class="form-control" required />
      </div>

      <hr />

      <h5>📦 Productos</h5>
      <ul>
        <li v-for="(p, index) in productos" :key="index">
          {{ p.nombre }} - Cantidad: {{ p.cantidad }} - Precio: ${{ p.precio }}
        </li>
      </ul>
      <p class="mt-2"><strong>Total:</strong> ${{ total }}</p>

      <div class="d-flex gap-3 mt-4">
        <button type="button" class="btn btn-outline-primary" @click="pagoContraEntrega">
          Pago Contra Entrega
        </button>
        <button type="submit" class="btn btn-success">
          Pago Online
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
const token = localStorage.getItem('token')

const route = useRoute()
const router = useRouter()

const productos = ref([])
const total = ref(0)
const form = ref({
  nombre: '',
  direccion: '',
  barrio: '',
  ciudad: '',
  contacto: ''
})

const configToken = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
onMounted(() => {
  try {
    const data = JSON.parse(route.query.productos || '[]')
    productos.value = data.map(p => ({
      nombre: p.nombre,
      cantidad: p.cantidad || 1,
      precio: p.precio
    }))
    total.value = productos.value.reduce((acc, p) => acc + p.precio * p.cantidad, 0)
  } catch (err) {
    alert('Error al cargar productos')
    console.error(err)
  }
})

async function pagoOnline() {
  try {
    // Paso 1: crear orden en backend
    await axios.post('http://localhost:5000/api/ordenes', {
      productos: productos.value,
      total: total.value,
      cliente: {
        nombre: form.value.nombre,
        direccion: form.value.direccion,
        barrio: form.value.barrio,
        ciudad: form.value.ciudad,
        telefono: form.value.contacto
      },
      tipoPago: 'online'
    }, configToken)

    // Paso 2: redirigir a MercadoPago
    const response = await axios.post('http://localhost:5000/api/ordenes/pago', {
      productos: productos.value
    }, configToken)

    window.location.href = response.data.init_point
  } catch (err) {
    console.error('❌ Error al procesar el pago online:', err)
    alert('❌ Error al procesar el pago online')
  }
}

function pagoContraEntrega() {
  const mensaje = `
🛒 *Nuevo pedido contra entrega*:

📦 Productos:
${productos.value.map(p => `- ${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}`).join('\n')}

💰 Total: $${total.value}

📇 Cliente:
👤 Nombre: ${form.value.nombre}
🏠 Dirección: ${form.value.direccion}, Barrio: ${form.value.barrio}, Ciudad: ${form.value.ciudad}
📞 Contacto: ${form.value.contacto}

⏳ Estado: *PENDIENTE*
`.trim()

  const numero = '573148637135'
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`
  window.open(url, '_blank')

  // También guardar la orden en la base de datos
  axios.post('http://localhost:5000/api/ordenes', {
    productos: productos.value,
    total: total.value,
    cliente: {
      nombre: form.value.nombre,
      direccion: form.value.direccion,
      barrio: form.value.barrio,
      ciudad: form.value.ciudad,
      telefono: form.value.contacto
    },
    tipoPago: 'entrega'
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(() => {
    alert('✅ Pedido enviado por WhatsApp y guardado')
    router.push('/')
  }).catch(err => {
    console.error('❌ Error al guardar orden contra entrega:', err)
    alert('Error al guardar pedido')
  })
}
</script>

<style scoped>
.container {
  max-width: 700px;
}
</style>
