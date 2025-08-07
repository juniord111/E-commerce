import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD_APP
  },
  logger: true,
  debug: true // Activa logs internos de nodemailer
})

export default async function enviarCorreoPedido(orden) {
  const { cliente, productos, total, tipoPago, estado } = orden

  const lista = productos.map(p => `• ${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}`).join('\n')

  const contenidoCorreo = `
🛒 Pedido nuevo:

 Cliente: ${cliente?.nombre}
 Teléfono: ${cliente?.telefono}
 Ciudad: ${cliente?.ciudad || 'No especificada'}
 Dirección: ${cliente?.direccion}

📦 Productos:
${lista}

 Total: $${total}
 Tipo de pago: ${tipoPago}
 Fecha: ${new Date().toLocaleString()}
 Estado: ${estado}
`.trim()

  const mailOptions = {
    from: `"Pedidos Web" <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_ADMIN,
    subject: ' Nuevo pedido pendiente',
    text: contenidoCorreo
  }


  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(' Correo enviado correctamente:', info.response)
  } catch (error) {
    console.error(' Error al enviar correo:', error)
  }
}
