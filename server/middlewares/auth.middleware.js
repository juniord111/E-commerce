import jwt from 'jsonwebtoken'

export const verificarToken = (req, res, next) => {
  const token = req.header('Authorization')

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' })
  }

  try {
    const tokenLimpio = token.replace('Bearer ', '')
    const verificado = jwt.verify(tokenLimpio, process.env.JWT_SECRET)
    req.user = verificado // Guardas la info del usuario en req
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado.' })
  }
}
