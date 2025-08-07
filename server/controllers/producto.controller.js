// server/controllers/producto.controller.js
import Producto from '../models/Producto.model.js'

// Obtener todos los productos
export const getProductos = async (req, res) => {
  try {
    const productos = await Producto.find()
    res.json(productos)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos' })
  }
}

export const createProducto = async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body)
    const productoGuardado = await nuevoProducto.save()
    res.status(201).json(productoGuardado)
  } catch (err) {
    res.status(400).json({ message: 'Error al crear producto' })
  }
}

export const getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id)
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' })
    res.json(producto)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el producto' })
  }
}

export const updateProducto = async (req, res) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    if (!productoActualizado) return res.status(404).json({ message: 'Producto no encontrado' })
    res.json(productoActualizado)
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar el producto' })
  }
}

export const deleteProducto = async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id)
    if (!productoEliminado) return res.status(404).json({ message: 'Producto no encontrado' })
    res.json({ message: 'Producto eliminado' })
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el producto' })
  }
}
