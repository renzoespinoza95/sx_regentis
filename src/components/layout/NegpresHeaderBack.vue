<template>
  <div class="flex justify-between items-center px-4 pt-4 pb-3" :style="{
    background: mercadoColor,
    '--header-color': mercadoColor
  }">

    <!-- LEFT: BACK -->
    <!-- LEFT -->
    <div class="flex items-center gap-2 cursor-pointer" @click="goBack">

      <!-- =========================================
       LOGO LEFT
  ========================================= -->
      <template v-if="showLogoLeft">

        <div class="logo-box">

          <img :src="data?.negocio?.img_logo || 'https://barsi-img.b-cdn.net/recursos/logo-regentis.png'"
            class="logo-img">

          <span class="logo-text">
            {{ data?.negocio?.nombre || 'Regentis' }}
          </span>

        </div>

      </template>

      <!-- =========================================
       FLECHA NORMAL
  ========================================= -->
      <template v-else>

        <div
          class="w-9 h-9 bg-white backdrop-blur-md rounded-full flex items-center justify-center active:scale-90 transition">

          <i class="fa fa-arrow-left text-sm" :style="{ color: mercadoColor }">
          </i>

        </div>

        <span class="font-semibold text-lg text-white">
          {{ titulo }}
        </span>

      </template>

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
          <div id="icon-heart-header" class="icon-btn relative" @click="irFavoritos">

            <i class="fa fa-heart"></i>

            <span v-if="favoritosCount > 0" class="notif-badge">

              {{ favoritosCount }}

            </span>

          </div>

          <!-- CARRITO -->
          <div class="icon-btn relative" @click="irCarrito">

            <i class="fa fa-shopping-cart"></i>

            <span v-if="carritoCount > 0" class="notif-badge">

              {{ carritoCount }}

            </span>

          </div>

          <!-- MENU -->
          <!-- AVATAR -->
          <div class="icon-btn overflow-hidden p-0" @click="abrirMenuUsuario">

            <img :src="user?.img_perfil || 'https://picsum.photos/80'" class="w-full h-full object-cover" />

          </div>

        </div>

      </template>

    </div>

    <!-- MODALES -->
    <ModalUsuario v-model="showModalUsuario" />
    <ModalMenuUsuario v-model="showMenuUsuario" />

  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useUsuario } from '../../services/usuarioService.js'
import { useMercado } from '../../services/useMercado.js'
import ModalUsuario from '../ModalUsuario.vue'
import ModalMenuUsuario from '../ModalMenuUsuario.vue'
import { useTienda } from '../../services/useTienda.js'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { bus } from '../../services/eventBus.js'

const { data } = useTienda()

const user = computed(() => {
  return usuario.value?.user || null
})

const props = defineProps({

  showLogoLeft: {
    type: Boolean,
    default: false
  }

})

const router = useRouter()
const route = useRoute()

const carritoCountLocal = ref(0)
const favoritosCountLocal = ref(0)

const showModalUsuario = ref(false)
const showMenuUsuario = ref(false)

const titulo = computed(() => {
  return data.value?.negocio?.nombre
    || route.query.titulo
    || 'Tienda'
})

const {
  isLogged,
  usuario
} = useUsuario()

/* =========================================
   MERCADO
========================================= */
const { mercado } = useMercado()

/* =========================================
   🔥 EVITAR NULL
========================================= */
const mercadoColor = computed(() => {
  return mercado.value?.topnavbar_color || '#FD7635'
})

function irLogin() {
  router.push('/KT3ENavegantes')
}

function abrirModalUsuario() {
  showModalUsuario.value = true
}

function updateCounts(payload) {

  carritoCountLocal.value =
    payload.carrito || 0

  favoritosCountLocal.value =
    payload.favoritos || 0
}

onMounted(() => {
  bus.on('header:updateCounts', updateCounts)
})

onUnmounted(() => {
  bus.off('header:updateCounts', updateCounts)
})

function abrirMenuUsuario() {
  showMenuUsuario.value = true
}

function irFavoritos() {

  router.push({
    path: '/Adfj_mis_favoritos',
    query: {
      titulo: 'Favoritos'
    }
  })
}

function irCarrito() {

  router.push({
    path: '/URl4_usuario_carrito',
    query: {
      titulo: 'Carrito de compras'
    }
  })
}

function goBack() {

  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const favoritosCount = computed(() => {

  return favoritosCountLocal.value
    || data.value?.favoritos_count
    || 0
})

const carritoCount = computed(() => {

  return carritoCountLocal.value
    || data.value?.carrito_count
    || 0
})
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

.logo-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-img {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  object-fit: cover;
  background: white;
  padding: 3px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
}

.logo-text {
  color: white;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.1;
  max-width: 170px;
}
</style>