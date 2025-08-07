// server/models/Producto.model.js
import mongoose from 'mongoose'

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String
  },
  precio: {
    type: Number,
    required: true
  },
  imagenUrl: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    default: 0
  },
  colores: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
})

const Producto = mongoose.model('Producto', productoSchema)

export default Producto
