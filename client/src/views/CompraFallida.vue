<template>
  <div class="resultado-pago error">
    <h1>❌ Pago fallido</h1>
    <p>Ocurrió un problema con tu pago. Intenta de nuevo.</p>
    <router-link to="/" class="btn">Volver a la tienda</router-link>
  </div>
</template>

<style scoped>
.resultado-pago {
  text-align: center;
  padding: 3rem;
}
.error {
  color: #c62828;
}
.btn {
  display: inline-block;
  margin-top: 1rem;
  background: #c62828;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
}
</style>
