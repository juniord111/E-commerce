<template>
  <div class="resultado-pago success">
    <h1>✅ ¡Gracias por tu compra!</h1>
    <p>Tu pago fue aprobado correctamente.</p>
    <router-link to="/" class="btn">Volver a inicio</router-link>
  </div>
</template>

<style scoped>
.resultado-pago {
  text-align: center;
  padding: 3rem;
}
.success {
  color: #2e7d32;
}
.btn {
  display: inline-block;
  margin-top: 1rem;
  background: #2e7d32;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
}
</style>
