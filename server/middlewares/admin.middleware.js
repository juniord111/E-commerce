import jwt from 'jsonwebtoken'

export function verificarAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado, no eres administrador' })
    }

    req.user = decoded // Por si quieres usar info del usuario luego
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' })
  }
}
