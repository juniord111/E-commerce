// server/server.js
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'

import uploadRoutes from './routes/upload.routes.js'
import productosRoutes from './routes/productos.routes.js'
import ordenRoutes from './routes/orden.routes.js'
import authRoutes from './routes/auth.routes.js'
import mercadopagoRoutes from './routes/mercadoPago.routes.js'




const app = express()
const PORT = process.env.PORT || 3000

// Para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(cors())
app.use(express.json())

// Rutas
app.use('/api/upload', uploadRoutes)
app.use('/api/productos', productosRoutes)
app.use('/api/ordenes', ordenRoutes)
app.use('/api/auth', authRoutes)
app.use('/mercadopago', mercadopagoRoutes)
// Conexión a MongoDB


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('🟢 Conectado a MongoDB')
}).catch(err => {
  console.error('🔴 Error al conectar a MongoDB:', err)
})

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../client/dist')))

// SPA fallback (para Vue Router)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'))
})


app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
})
