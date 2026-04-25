<template>
  <div class="login-container">
    <div class="form-wrapper">
      <LoginForm />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import LoginForm from './components/LoginForm.vue'

const router = useRouter()
</script>

<style scoped>
/* 🔥 FONDO FULL SCREEN REAL */
.login-container {
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;

  background-image: url('/fondo_login.avif');
  background-repeat: no-repeat;
  background-size: cover;
  /* 🔥 Esto hace que cubra todo */
  background-position: center;
  /* 🔥 Centrado perfecto */
  background-attachment: fixed;
  /* opcional, efecto más premium */
}

/* 🍊 OVERLAY PATRÓN */
.login-container::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;

  background-image:
    radial-gradient(ellipse at top left, #EA6223 50%, transparent 50%),
    radial-gradient(ellipse at bottom right, #EA6223 50%, transparent 50%);

  background-size: 40px 40px;
  background-repeat: repeat;

  opacity: 0.85;
  mix-blend-mode: soft-light;
}

/* FORM ENCIMA */
.form-wrapper {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  /* 🔥 centra verticalmente y evita espacio blanco */
}
</style>