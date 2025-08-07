import { Router } from 'express'
import Usuario from '../models/Usuario.model.js'  // Asegúrate de tener bien la ruta
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = Router()

// 🔑 LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' })
    }

    const usuario = await Usuario.findOne({ email })

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const esValido = await bcrypt.compare(password, usuario.password)

    if (!esValido) {
      return res.status(401).json({ error: 'Contraseña incorrecta' })
    }

    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        nombre: usuario.nombre,
        email: usuario.email,
        numero: usuario.numero,
        rol: usuario.rol
      }
    })
  } catch (err) {
    console.error('❌ Error en login:', err)
    res.status(500).json({ error: 'Error en el login' })
  }
})

// 📝 REGISTRO
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, numero, password } = req.body

    if (!nombre || !email || !numero || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' })
    }

    const existe = await Usuario.findOne({ email })
    if (existe) {
      return res.status(400).json({ error: 'El correo ya está registrado' })
    }

    
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      numero,
      password,
      rol: 'cliente' // Default para usuarios normales
    })

    await nuevoUsuario.save()

    const token = jwt.sign(
      { id: nuevoUsuario._id, nombre: nuevoUsuario.nombre, rol: nuevoUsuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      mensaje: 'Usuario registrado',
      token,
      usuario: {
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        numero: nuevoUsuario.numero,
        rol: nuevoUsuario.rol
      }
    })
  } catch (err) {
    console.error('❌ Error en registro:', err)
    res.status(500).json({ error: 'Error al registrar usuario' })
  }
})

export default router
