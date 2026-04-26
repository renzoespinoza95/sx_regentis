<template>
  <div class="flex justify-between items-center px-4 pt-4 pb-3" :style="{
    background: mercado.topnavbar_color || '#FD7635',
    '--header-color': mercado.topnavbar_color || '#FD7635'
  }">

    <!-- LEFT: BACK -->
    <div class="flex items-center gap-2 cursor-pointer" @click="goBack">
      <div
        class="w-9 h-9 bg-white backdrop-blur-md rounded-full flex items-center justify-center active:scale-90 transition">
        <i class="fa fa-arrow-left text-sm" :style="{ color: mercado.topnavbar_color || '#FD7635' }">
        </i>
      </div>

      <span class="font-semibold text-lg text-white">
        {{ titulo }}
      </span>
    </div>

    <div class="flex items-center gap-4">

      <!-- 🔐 NO LOGUEADO -->
      <button v-if="!isLogged" @click="irLogin"
        class="bg-white text-[#FD7635] px-3 py-1 rounded-full text-xs font-semibold shadow-sm hover:scale-105 transition">
        Ingresar
      </button>

      <!-- 🔓 LOGUEADO -->
      <template v-else>

        <div class="flex items-center gap-2">

          <!-- FAVORITOS -->
          <div class="icon-btn relative" @click="irFavoritos">
            <i class="fa fa-heart"></i>

            <span class="notif-badge">
              2
            </span>
          </div>

          <!-- CARRITO -->
          <div class="icon-btn relative" @click="irCarrito">
            <i class="fa fa-shopping-cart"></i>

            <span class="notif-badge">
              3
            </span>
          </div>

          <div class="icon-btn">
            <i class="fa fa-ellipsis-v"></i>
          </div>

        </div>

      </template>

    </div>

  </div>
</template>
<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useUsuario } from '../../services/usuarioService.js'
import { useMercado } from '../../services/useMercado.js'

const router = useRouter()
const route = useRoute()

const titulo = route.query.titulo || 'La Tienda de Celeste'

const { isLogged } = useUsuario()

// 🔥 MERCADO GLOBAL
const { mercado } = useMercado()

function irLogin() {
  router.push('/KT3ENavegantes')
}

function irFavoritos() {
  router.push({
    path: '/Adfj_mis_favoritos',
    query: { titulo: 'Favoritos' }
  })
}

function irCarrito() {
  router.push({
    path: '/URl4_usuario_carrito',
    query: { titulo: 'Carrito de compras' }
  })
}

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>


<style scoped>
.icon-btn {
  width: 36px;
  height: 36px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--header-color, #FD7635);
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn:active {
  transform: scale(0.9);
}

.icon-btn i {
  font-size: 14px;
}

.notif-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #EF4444;
  /* rojo */
  color: white;
  font-size: 10px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}
</style>