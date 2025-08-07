import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const usuario = ref(JSON.parse(localStorage.getItem('usuario')) || null)

  const setUsuario = (user) => {
    usuario.value = user
    if (user) {
      localStorage.setItem('usuario', JSON.stringify(user))
    } else {
      localStorage.removeItem('usuario')
    }
  }

  const clearUsuario = () => {
    usuario.value = null
    localStorage.removeItem('usuario')
    localStorage.removeItem('token')
  }

  return {
    usuario,
    setUsuario,
    clearUsuario
  }
})
