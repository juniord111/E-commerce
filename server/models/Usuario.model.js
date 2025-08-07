import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  numero: { type: String, required: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['cliente', 'admin'], default: 'cliente' },
  fechaRegistro: { type: Date, default: Date.now }
})

// Encriptar contraseña antes de guardar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// Método para comparar contraseñas
usuarioSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password)
}

const Usuario = mongoose.model('Usuario', usuarioSchema)

export default Usuario

