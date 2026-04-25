<template>

  <div class="productos-section">

    <div class="productos-header">
      Productos destacados
      <span class="vermas">
        Ver más >
      </span>
    </div>

    <div class="productos-grid">

      <div v-for="n in 8" :key="n" class="producto-card">

        <img :src="`https://picsum.photos/200?random=${n + 120}`" class="producto-img" />

        <div class="producto-nombre">
          Roxana
        </div>

        <div class="producto-precio">
          S/7.50
        </div>

        <button class="producto-btn">
          Agregar >
        </button>

      </div>

    </div>

  </div>

</template>

<script setup>
</script>

<style scoped>
.productos-section {
  margin-top: 30px;
}

.productos-header {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  margin-bottom: 15px;
}

.vermas {
  color: #FD7635;
  font-size: 12px;
}

.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.producto-card {
  background: white;
  padding: 15px;
  border-radius: 16px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

.producto-img {
  width: 100%;
  height: 110px;
  object-fit: cover;
  border-radius: 12px;
}

.producto-nombre {
  margin-top: 8px;
  font-weight: 600;
}

.producto-precio {
  color: #444;
}

.producto-btn {
  margin-top: 8px;
  background: #FD7635;
  color: white;
  padding: 6px;
  border-radius: 20px;
  font-size: 12px;
  width: 100%;
}
</style>