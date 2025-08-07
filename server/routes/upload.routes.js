// server/routes/upload.routes.js
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'

const router = express.Router()

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Configurar Multer con Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ecommerce',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
})

const upload = multer({ storage })

// Ruta para subir imagen
router.post('/', (req, res, next) => {
  upload.single('imagen')(req, res, function (err) {
    if (err) {
      console.error('❌ Error en multer:', err)
      return res.status(500).json({ error: err.message || 'Error al subir imagen' })
    }

    try {
      if (!req.file) {
        console.error('❌ No se recibió archivo')
        return res.status(400).json({ error: 'No se recibió archivo' })
      }

      res.json({ imageUrl: req.file.path }) // 👈 asegúrate que "path" es correcto
    } catch (error) {
      console.error('❌ Error en el controlador:', error)
      res.status(500).json({ error: error.message || 'Error inesperado al subir imagen' })
    }
  })
})

export default router
