// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore' // ⬅️ Importa el store correctamente
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import Carrito from '@/views/CarritoView.vue'
import FormularioPedido from "@/views/FormularioPedido.vue";
import Register from '@/views/Register.vue'
import HistorialCompras from '@/views/HistorialCompras.vue'
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/producto/:id', name: 'ProductDetail', component: ProductDetail },
  { path: '/carrito', name: 'Carrito', component: Carrito },
  { path: '/compra-exitosa', component: () => import('@/views/CompraExitosa.vue') },
  { path: '/compra-fallida', component: () => import('@/views/CompraFallida.vue') },
  { path: '/compra-pendiente', component: () => import('@/views/CompraPendiente.vue') },
  { path: '/pedido', name: 'FormularioPedido', component: FormularioPedido },
   { path: '/mis-compras', name: 'HistorialCompras', component: HistorialCompras }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.path === '/dashboard') {
    if (userStore.usuario && userStore.usuario.rol === 'admin') {
      next()
    } else {
      next('/') // Redirige al home si no es admin
    }
  } else {
    next()
  }
})

export default router
