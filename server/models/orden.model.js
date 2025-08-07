import mongoose from 'mongoose'

const ordenSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }, // ← Agrega esto
  productos: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' }, // opcional
      nombre: String,
      precio: Number,
      cantidad: Number,
    }
  ],
  total: {
    type: Number,
    required: true,
    min: 0
  },
  cliente: {
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    barrio: { type: String },
    ciudad: { type: String },
    telefono: { type: String, required: true }
  },
  tipoPago: {
    type: String,
    enum: ['entrega', 'online'],
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'completado', 'cancelado'],
    default: 'pendiente'
  },
  fecha: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Orden', ordenSchema)
