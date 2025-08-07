<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-logo">
        <router-link to="/" class="logo">Mi Tienda</router-link>
      </div>

      <div class="navbar-links">
        <router-link to="/" class="nav-link">Home</router-link>

        <router-link to="/carrito" class="btn btn-outline-primary">
          🛒 <span class="badge bg-secondary">{{ cart.totalCantidad }}</span>
        </router-link>

        <!-- Dashboard solo para admins -->
        <router-link v-if="isAdmin" to="/dashboard" class="nav-link">Dashboard</router-link>

        <!-- Login / Logout -->
        <router-link v-if="!isLogged" to="/login" class="nav-link">
          <img class="login-link" src="/userlogin.png" alt="Login">
        </router-link>

        <button v-if="isLogged" @click="logout" class="nav-link">
          <img class="login-link" src="/logout.png" alt="Logout">
        </button>
        <router-link 
  v-if="isLogged && !isAdmin" 
  to="/mis-compras" 
  class="nav-link">
  Mis Compras
</router-link>

      </div> 

    </div>
  </nav>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
import { useUserStore } from '@/stores/userStore'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const userStore = useUserStore()
const router = useRouter()

const isLogged = computed(() => !!userStore.usuario)
const isAdmin = computed(() => userStore.usuario?.rol === 'admin')

const logout = () => {
  userStore.clearUsuario()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  background-color: #c7c7c7;
  border-bottom: 1px solid #81a8f7;
  padding: 1rem 2rem;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.navbar-logo .logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0d6efd;
  text-decoration: none;
  margin-right: 50px;
}

.navbar-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
}

.login-link {
  width: 35px;
  height: auto;
}

.nav-link:hover {
  background-color: #0d6efd;
  color: #fff;
}

.btn-outline-primary {
  border: 1px solid transparent;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  background: none;
  color: #0d6efd;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-outline-primary:hover {
  background: #0d6efd;
  color: #fff;
}

.badge {
  background-color: #6b7280;
  color: #fff;
  border-radius: 999px;
  padding: 0 8px;
  font-size: 0.75rem;
}
</style>
