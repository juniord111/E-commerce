<template>
  <div class="resultado-pago pending">
    <h1>⏳ Pago pendiente</h1>
    <p>Tu pago está en revisión. Te notificaremos cuando se confirme.</p>
    <router-link to="/" class="btn">Volver a inicio</router-link>
  </div>
</template>

<style scoped>
.resultado-pago {
  text-align: center;
  padding: 3rem;
}
.pending {
  color: #f9a825;
}
.btn {
  display: inline-block;
  margin-top: 1rem;
  background: #f9a825;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
}
</style>
