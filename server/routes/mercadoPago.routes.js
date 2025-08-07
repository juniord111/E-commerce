import { Router } from 'express'
import Orden from '../models/orden.model.js'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import dotenv from 'dotenv'

dotenv.config()

const router = Router()

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
})

const payment = new Payment(client)

router.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body

    if (type === 'payment') {
      const mpPayment = await payment.get({ id: data.id })

      console.log('🟢 Webhook recibido:', mpPayment)

      if (mpPayment.status === 'approved') {
   

        const totalPago = mpPayment.transaction_amount

        // Buscar orden con el mismo total y pendiente (simplificado)
        const orden = await Orden.findOne({
          total: totalPago,
          estado: 'pendiente',
          tipoPago: 'online'
        })

        if (orden) {
          orden.estado = 'completado'
          await orden.save()
          console.log(`✅ Orden ${orden._id} marcada como completada`)
        } else {
          console.warn(`⚠️ No se encontró orden para el pago ${data.id}`)
        }
      }
    }

    res.sendStatus(200)
  } catch (err) {
    console.error('❌ Error en webhook:', err)
    res.sendStatus(500)
  }
})

export default router
