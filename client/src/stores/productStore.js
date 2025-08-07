// src/stores/productStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useProductStore = defineStore('productStore', () => {
  const productos = ref([])

  const API_URL = '/api/productos'

  // Obtener todos los productos
  const fetchProductos = async () => {
    try {
      const { data } = await axios.get(API_URL)
      productos.value = data
      console.log('✅ Productos cargados:', data.length)
    } catch (error) {
      console.error('❌ Error al obtener productos:', error)
    }
  }

  // Crear producto
  const crearProducto = async (producto) => {
    try {
      const { data } = await axios.post(API_URL, producto)
      productos.value.push(data)
    } catch (error) {
      console.error('❌ Error al crear producto:', error.response?.data || error.message)
      throw error
    }
  }

  // Actualizar producto
  const actualizarProducto = async (producto) => {
    try {
      const { data } = await axios.put(`${API_URL}/${producto._id}`, producto)
      const index = productos.value.findIndex(p => p._id === producto._id)
      if (index !== -1) productos.value[index] = data
    } catch (error) {
      console.error('❌ Error al actualizar producto:', error.response?.data || error.message)
      throw error
    }
  }

  // Eliminar producto
  const eliminarProducto = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      productos.value = productos.value.filter(p => p._id !== id)
    } catch (error) {
      console.error('❌ Error al eliminar producto:', error.response?.data || error.message)
      throw error
    }
  }

  // Obtener producto por ID (solo en memoria)
  const obtenerProductoPorId = async (id) => {
    if (!productos.value.length) {
      await fetchProductos()
    }
    return productos.value.find(p => p._id === id)
  }

  return {
    productos,
    fetchProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductoPorId
  }
})
