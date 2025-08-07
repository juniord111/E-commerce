<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card class="pa-6" max-width="400">
      <v-card-title class="text-h5 text-center">Registrarse</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="register">
          <v-text-field
            v-model="nombre"
            label="Nombre"
            required
          />
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
            <v-text-field
                v-model="numero"
                label="Número de contacto"
                type="tel"
                required
              />

          <v-btn type="submit" color="primary" block class="mt-4">
            Registrarse
          </v-btn>

          <v-alert v-if="error" type="error" dense text class="mt-4">
            {{ error }}
          </v-alert>

          <p class="mt-4 text-center">
            ¿Ya tienes cuenta? 
            <router-link to="/login">Inicia sesión aquí</router-link>
          </p>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const nombre = ref('')
const email = ref('')
const password = ref('')
const numero = ref('')
const error = ref('')
const router = useRouter()

const register = async () => {
  try {
    await axios.post('https://e-commerce-nw9h.onrender.com/api/auth/register', {
      nombre: nombre.value,
      email: email.value,
      password: password.value,
      numero: numero.value
    })

    // Redirigir al login después de registrarse
    router.push('/login')
  } catch (err) {
    error.value = err.response?.data?.error || 'Error al registrar'
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
