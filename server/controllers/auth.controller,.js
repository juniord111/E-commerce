import Usuario from '../models/Usuario.model.js'
import jwt from 'jsonwebtoken'

export const login = async (req, res) => {
  const { email, password } = req.body

  const usuario = await Usuario.findOne({ email })
  if (!usuario) return res.status(400).json({ error: 'Usuario no encontrado' })

  const esValido = await usuario.comparePassword(password)
  if (!esValido) return res.status(400).json({ error: 'Contraseña incorrecta' })

  const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '7d' })

  res.json({ token, usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } })
}
