import dotenv from 'dotenv'
dotenv.config()
import { Router } from 'express'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import Orden from '../models/orden.model.js'
import enviarCorreoPedido from '../utils/email.js' // 💌 Importa el email util
import { verificarToken } from '../middlewares/auth.middleware.js' // 📲 Importa la función de notificación
import { verificarAdmin } from '../middlewares/admin.middleware.js'
const router = Router()

// ✅ Configurar Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
})

// 🟢 Crear preferencia de pago con MercadoPago
router.post('/pago', async (req, res) => {
  try {
    const { productos } = req.body

    const items = productos.map(prod => ({
      title: String(prod.nombre),
      quantity: Number(prod.cantidad),
      unit_price: Number(prod.precio),
      currency_id: 'COP',
    }))

    console.log('🟢 Items enviados a Mercado Pago:', items)

    if (
      !Array.isArray(items) || items.length === 0 ||
      items.some(i =>
        typeof i.title !== 'string' || !i.title.trim() ||
        typeof i.quantity !== 'number' || i.quantity <= 0 ||
        typeof i.unit_price !== 'number' || i.unit_price < 0 ||
        typeof i.currency_id !== 'string' || !i.currency_id.trim()
      )
    ) {
      return res.status(400).json({ error: 'Datos inválidos para Mercado Pago', items })
    }

    const preference = new Preference(client)
    const pref = await preference.create({
      body: {
        items,
        back_urls: {
          success: 'https://bcfc7a76dbe9.ngrok-free.app/compra-exitosa',
          failure: 'https://bcfc7a76dbe9.ngrok-free.app/compra-fallida',
          pending: 'https://bcfc7a76dbe9.ngrok-free.app/compra-pendiente',
        },
      }
    })

    res.json({ init_point: pref.init_point })
  } catch (error) {
    console.error('❌ Error al crear preferencia:', error)
    res.status(500).json({ error: 'Error en la creación de preferencia' })
  }
})

// 🛒 Crear una orden (contra entrega o pagada)
router.post('/', verificarToken, async (req, res) => {
  try {
    const { productos, total, cliente, tipoPago } = req.body

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'Debes enviar productos válidos' })
    }

    if (typeof total !== 'number' || total <= 0) {
      return res.status(400).json({ error: 'Total inválido' })
    }

    if (!cliente || !cliente.nombre || !cliente.telefono || !cliente.direccion) {
      return res.status(400).json({ error: 'Faltan datos del cliente' })
    }

    const nuevaOrden = new Orden({
      usuarioId: req.user.id,
      productos,
      total,
      cliente,
      tipoPago,
      estado: tipoPago === 'entrega' ? 'pendiente' : 'completado',
      fecha: new Date()
    })

    await nuevaOrden.save()

    // 💌 Enviar notificación en cualquier tipo de pago
      if (['entrega', 'tarjeta', 'mercadopago'].includes(tipoPago)) {
  await enviarCorreoPedido(nuevaOrden)
}

    res.status(201).json({ mensaje: 'Orden registrada correctamente', orden: nuevaOrden })
  } catch (error) {
    console.error('❌ Error al crear orden:', error)
    res.status(500).json({ error: 'Error al crear la orden' })
  }
})

// 📋 Obtener todas las órdenes
router.get('/',verificarAdmin, async (req, res) => {
  try {
    const ordenes = await Orden.find().sort({ fecha: -1 })
    res.json(ordenes)
  } catch (error) {
    console.error('❌ Error al obtener órdenes:', error)
    res.status(500).json({ error: 'Error al obtener órdenes' })
  }
})

router.get('/estadisticas', verificarAdmin, async (req, res) => {
  try {
    const ordenes = await Orden.find({ estado: 'completado' }) // Solo completadas

    const ingresosTotales = ordenes.reduce((acc, orden) => acc + (orden.total || 0), 0)

    const totalProductosVendidos = ordenes.reduce((acc, orden) =>
      acc + orden.productos.reduce((sum, p) => sum + (p.cantidad || 0), 0), 0)

    const ingresosMensuales = Array(6).fill(0)

    ordenes.forEach(orden => {
      const mes = new Date(orden.fecha).getMonth()
      if (mes >= 0 && mes <= 5) {
        ingresosMensuales[mes] += orden.total
      }
    })

    res.json({
      ingresosTotales,
      totalProductosVendidos,
      ingresosMensuales,
      totalVentas: ordenes.length
    })
  } catch (err) {
    console.error('❌ Error en /estadisticas:', err)
    res.status(500).json({ error: 'Error al calcular estadísticas' })
  }
})
// 📄 Obtener historial de compras del usuario
router.get('/mis-compras', verificarToken, async (req, res) => {
  try {
    const ordenes = await Orden.find({ usuarioId: req.user.id }).sort({ fecha: -1 })
    res.json(ordenes)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener historial' })
  }
})
// 🛡️ Ruta para admin: obtener todas las órdenes
router.get('/todas', verificarAdmin, async (req, res) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'No autorizado' })
  }

  try {
    const ordenes = await Orden.find().sort({ createdAt: -1 }).populate('usuarioId', 'nombre email')
    const result = ordenes.map(o => ({
      _id: o._id,
      total: o.total,
      metodoPago: o.metodoPago,
      createdAt: o.createdAt,
      usuarioNombre: o.usuarioId.nombre || 'Usuario eliminado',
      usuarioEmail: o.usuarioId.email || 'Email eliminado'
    }))
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener las órdenes' })
  }
})
export default router
