import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import Usuario from '../models/Usuario.model.js' // Ajusta si tu path es diferente

dotenv.config()

const crearAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    const existeAdmin = await Usuario.findOne({ rol: 'admin' })

    if (existeAdmin) {
      console.log('⚠️ Ya existe un admin en la base de datos.')
      process.exit(0)
    }

    const hashedPassword = await bcrypt.hash('123456', 10)

    const admin = new Usuario({
        nombre: 'Admin',
  email: 'adminone@example.com',
  password: '123456',
  rol: 'admin',
  numero: '0000000000'  
    })

    await admin.save()

    console.log('✅ Admin creado correctamente.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error creando el admin:', err)
    process.exit(1)
  }
}

crearAdmin()
