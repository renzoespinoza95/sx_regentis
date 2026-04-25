<template>

  <div class="header-wrapper" :style="{ '--header-color': mercado.topnavbar_color }">

    <div class="header-inner">

      <!-- LOGO -->
      <div class="logo-box">

        <img :src="mercado.logo || 'https://barsi-img.b-cdn.net/recursos/logo-regentis.png'" class="logo-img" />
        <span class="logo-text">
          {{ mercado.nombre || 'Regentis' }}
        </span>

      </div>

      <!-- RIGHT SIDE -->
      <div class="header-actions">

        <!-- 🔐 NO LOGUEADO -->
        <button v-if="!isLogged" @click="irLogin"
          class="bg-white text-[#FD7635] px-3 py-1 rounded-full text-xs font-semibold shadow-sm hover:scale-105 transition">
          Ingresar
        </button>

        <!-- 🔓 LOGUEADO -->
        <template v-else>

          <!-- NOTIFICACIONES -->
          <div class="notification cursor-pointer" @click="showMenuModal = true">
            <i class="fa fa-bell"></i>
            <span class="notification-badge">
              3
            </span>
          </div>

          <!-- AVATAR -->
          <img src="https://picsum.photos/40?random=77" class="avatar cursor-pointer" @click="openUserModal" />

        </template>

      </div>

    </div>
  </div>

  <!-- 🔥 MODAL USUARIO -->
  <ModalUsuario v-model="showUserModal" />

  <!-- 🔥 MODAL MENU USUARIO -->
  <ModalMenuUsuario v-model="showMenuModal" />

</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsuario } from '../../../services/usuarioService.js'
import ModalUsuario from '../../../components/ModalUsuario.vue'
import ModalMenuUsuario from '../../../components/ModalMenuUsuario.vue'
import { useMercado } from '../../../services/useMercado.js'

const router = useRouter()
const { isLogged } = useUsuario()

// 🔥 USO LIMPIO
const { mercado } = useMercado()

/* 🔥 MODALES */
const showUserModal = ref(false)
const showMenuModal = ref(false)

function openUserModal() {
  showUserModal.value = true
}

function irLogin() {
  router.push('/login')
}
</script>

<style scoped>
/* ============================= */
/* NAVBAR STICKY                */
/* ============================= */

.header-wrapper {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  padding: 16px 0;
  background: var(--header-color, #FD7635);
}

/* ============================= */
/* CONTENEDOR INTERNO           */
/* ============================= */

.header-inner {
  max-width: 1400px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

/* ============================= */
/* LOGO                         */
/* ============================= */

.logo-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  background: white;
  color: #FD7635;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.logo-text {
  font-weight: 600;
  color: white;
}

/* ============================= */
/* ACTIONS                      */
/* ============================= */

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* ============================= */
/* NOTIFICATION                 */
/* ============================= */

.notification {
  position: relative;
  color: white;
  font-size: 18px;
}

.notification-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background: white;
  color: #FD7635;
  font-size: 10px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

/* ============================= */
/* AVATAR                       */
/* ============================= */

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

/* ============================= */
/* FADE                         */
/* ============================= */

.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.logo-img {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  object-fit: cover;
  background: white;
}
</style>