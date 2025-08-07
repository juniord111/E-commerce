<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card class="pa-6" max-width="400">
      <v-card-title class="text-h5 text-center">Iniciar Sesión</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="email"
            label="Correo electrónico"
            type="email"
            required
          />
          <v-text-field
            v-model="password"
            label="Contraseña"
            type="password"
            required
          />

          <v-btn type="submit" color="primary" block class="mt-4">
            Iniciar sesión
          </v-btn>

          <p class="mt-4 text-center">
            ¿No tienes cuenta?
            <router-link to="/register">Regístrate aquí</router-link>
          </p>

          <v-alert v-if="error" type="error" class="mt-4" dense text>
            {{ error }}
          </v-alert>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import api from '@/api/axios.js'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const userStore = useUserStore()

const login = async () => {
  try {
    const res = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    })

    const { token, usuario } = res.data
    userStore.setUsuario(usuario)
    localStorage.setItem('token', token)
     
    // Redirige al dashboard si es admin, o al home si no lo es
    if (usuario.rol === 'admin') {
      router.push('/dashboard')
    } else {
      router.push('/')
    }
  } catch (err) {
    console.error('Error al iniciar sesión:', err)
    error.value = 'Credenciales inválidas o error en el servidor.'
  }
}
</script>

<style scoped>
.v-container {
  background-color: #f3f4f6;
  padding: 2rem;
}
.v-card {
  border-radius: 1.25rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  background-color: #fff;
}
.v-card-title {
  font-weight: 600;
  color: #1e293b;
}
.v-text-field input {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 0.75rem;
}
.v-btn {
  border-radius: 2rem;
  font-weight: 600;
  font-size: 1rem;
  text-transform: none;
}
.v-alert {
  font-weight: 500;
  font-size: 0.95rem;
}
</style>
