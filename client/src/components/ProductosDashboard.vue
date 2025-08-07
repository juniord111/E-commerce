<template>
  <div class="container mt-5">
    <div class="card shadow p-4">
      <h2 class="mb-4">Dashboard de Administrador</h2>

      <!-- Agregar Producto -->
      <div class="mb-5">
        <h4>Agregar Producto</h4>
        <form @submit.prevent="agregarProducto">
          <div class="row g-3">
            <div class="col-md-6">
              <input v-model="nuevoProducto.nombre" type="text" class="form-control" placeholder="Nombre del producto" required />
            </div>
            <div class="col-md-6">
              <input v-model.number="nuevoProducto.precio" type="number" class="form-control" placeholder="Precio" required />
            </div>
            <div class="col-md-12">
              <input type="file" name="imagen" class="form-control" @change="handleFile" accept="image/*" required />
            </div>
            <div class="col-md-12">
              <textarea v-model="nuevoProducto.descripcion" class="form-control" placeholder="Descripción del producto" required></textarea>
            </div>
            <div class="col-md-12">
              <button class="btn btn-success w-100">Agregar Producto</button>
            </div>
          </div>
        </form>
      </div>

      <hr />

      <!-- Lista de Productos -->
      <div>
        <h4>Lista de Productos</h4>
        <table class="table table-hover mt-3">
          <thead class="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="producto in productos" :key="producto._id">
              <td>{{ producto.nombre }}</td>
              <td>${{ producto.precio }}</td>
              <td>
                <button class="btn btn-primary btn-sm me-2" @click="seleccionarProducto(producto)">Editar</button>
                <button class="btn btn-danger btn-sm" @click="eliminarProducto(producto._id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Editar Producto -->
      <div v-if="productoSeleccionado" class="mt-5">
        <h4>Editar Producto</h4>
        <form @submit.prevent="guardarEdicion">
          <div class="row g-3">
            <div class="col-md-6">
              <input v-model="productoEditado.nombre" type="text" class="form-control" required />
            </div>
            <div class="col-md-6">
              <input v-model.number="productoEditado.precio" type="number" class="form-control" required />
            </div>
            <div class="col-md-12">
              <input type="file" class="form-control" @change="handleEditarFile" accept="image/*" />
              <small class="text-muted">Deja vacío si no deseas cambiar la imagen</small>
              <div v-if="productoEditado.imagenUrl" class="mt-2">
                <img :src="productoEditado.imagenUrl" alt="Imagen actual" width="120" />
              </div>
            </div>
            <div class="col-md-12">
              <textarea v-model="productoEditado.descripcion" class="form-control" required></textarea>
            </div>
            <div class="col-md-12 d-flex justify-content-between">
              <button class="btn btn-warning">Guardar Cambios</button>
              <button class="btn btn-secondary" @click.prevent="cancelarEdicion">Cancelar</button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="mt-5">
      <h4>Estadísticas</h4>
      <div class="row mt-3">
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
      <SalesChart />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useProductStore } from '@/stores/productStore'
import SalesChart from '@/components/SalesChart.vue'

const store = useProductStore()
const productos = store.productos

const ingresosTotales = 9700
const productosVendidos = 230

onMounted(() => {
  if (!productos.length) store.fetchProductos()
})

// Nuevo producto
const nuevoProducto = reactive({
  nombre: '',
  precio: null,
  descripcion: '',
})
const imagenFile = ref(null)
const handleFile = (e) => {
  imagenFile.value = e.target.files[0]
}

// Edición
const productoSeleccionado = ref(null)
const productoEditado = reactive({
  _id: '',
  nombre: '',
  precio: null,
  imagenUrl: '',
  descripcion: ''
})
const imagenEditarFile = ref(null)
const handleEditarFile = (e) => {
  imagenEditarFile.value = e.target.files[0]
}

async function subirImagen(file) {
  const formData = new FormData()
  formData.append('imagen', file)

  const res = await axios.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return res.data.imageUrl
}

async function agregarProducto() {
  if (!imagenFile.value) return alert('Selecciona una imagen')

  try {
    const imagenUrl = await subirImagen(imagenFile.value)

    await store.crearProducto({
      nombre: nuevoProducto.nombre,
      precio: nuevoProducto.precio,
      descripcion: nuevoProducto.descripcion,
      imagenUrl,
    })

    await store.fetchProductos()

    Object.assign(nuevoProducto, { nombre: '', precio: null, descripcion: '' })
    imagenFile.value = null
  } catch (err) {
    console.error(err)
    console.error('Error al subir imagen o crear producto:')
    console.error('-> message:', err.message)
    console.error('-> response:', err.response?.data)
    console.error('-> full error:', JSON.stringify(err, null, 2))
    alert('Error al subir imagen o crear producto')
  }
}

function seleccionarProducto(producto) {
  productoSeleccionado.value = producto
  Object.assign(productoEditado, producto)
  imagenEditarFile.value = null
}

function cancelarEdicion() {
  productoSeleccionado.value = null
  Object.assign(productoEditado, {
    _id: '',
    nombre: '',
    precio: null,
    imagenUrl: '',
    descripcion: ''
  })
  imagenEditarFile.value = null
}

async function guardarEdicion() {
  try {
    let nuevaImagenUrl = productoEditado.imagenUrl

    if (imagenEditarFile.value) {
      nuevaImagenUrl = await subirImagen(imagenEditarFile.value)
    }

    await store.actualizarProducto({
      ...productoEditado,
      imagenUrl: nuevaImagenUrl,
    })

    await store.fetchProductos()
    cancelarEdicion()
  } catch (err) {
    console.error('Error al actualizar producto:', err)
    alert('Error al guardar cambios')
  }
}

async function eliminarProducto(id) {
  await store.eliminarProducto(id)
  if (productoSeleccionado.value?._id === id) cancelarEdicion()
  await store.fetchProductos()
}
</script>

<style scoped>
img {
  object-fit: cover;
  border-radius: 8px;
  margin-top: 8px;
}
</style>
