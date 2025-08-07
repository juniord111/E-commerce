import axios from 'axios'

const API = 'https://tuservidor.com/api' // Reemplaza con tu URL

export async function login(correo, contraseña) {
  const res = await axios.post(`${API}/auth/login`, { correo, contraseña })
  const { token, usuario } = res.data

  localStorage.setItem('token', token)
  localStorage.setItem('usuario', JSON.stringify(usuario))

  return usuario
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
}

export function getUsuario() {
  const usuario = localStorage.getItem('usuario')
  return usuario ? JSON.parse(usuario) : null
}

export function getToken() {
  return localStorage.getItem('token')
}
