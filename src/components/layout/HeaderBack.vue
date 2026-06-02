<template>
  <div class="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 pt-4 pb-3" :style="{
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

          <!-- MENU -->
          <!-- AVATAR -->
          <div class="icon-btn overflow-hidden p-0" @click="abrirModalUsuario">

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

import {
  useRouter,
  useRoute
}
  from 'vue-router'

import {
  useUsuario
}
  from '../../services/usuarioService.js'

import {
  useMercado
}
  from '../../services/useMercado.js'

import ModalUsuario
  from '../ModalUsuario.vue'

import ModalMenuUsuario
  from '../ModalMenuUsuario.vue'

import {
  ref,
  computed,
  onMounted,
  onUnmounted
}
  from 'vue'

import {
  bus
}
  from '../../services/eventBus.js'

/* =========================================
🔥 MERCADO
========================================= */

const {
  mercado
} = useMercado()

/* =========================================
🔥 USER
========================================= */

const {
  isLogged,
  usuario
} = useUsuario()

const user =
  computed(() => {

    return usuario.value?.user || null

  })

/* =========================================
🔥 PROPS
========================================= */

const props =
  defineProps({

    showLogoLeft: {

      type: Boolean,

      default: false

    }

  })

/* =========================================
🔥 ROUTER
========================================= */

const router =
  useRouter()

const route =
  useRoute()

/* =========================================
🔥 COUNTS
========================================= */

const carritoCountLocal =
  ref(0)

const favoritosCountLocal =
  ref(0)

/* =========================================
🔥 MODALS
========================================= */

const showModalUsuario =
  ref(false)

const showMenuUsuario =
  ref(false)

/* =========================================
🔥 TITULO
========================================= */

const titulo =
  computed(() => {

    return (

      route.query.titulo

      ||

      mercado.value?.nombre

      ||

      'Mercado'

    )

  })

/* =========================================
🔥 COLOR
========================================= */

const mercadoColor =
  computed(() => {

    return (

      mercado.value?.topnavbar_color

      ||

      '#FD7635'

    )

  })

/* =========================================
🔥 LOGIN
========================================= */

function irLogin() {

  router.push(
    '/KT3ENavegantes'
  )

}

/* =========================================
🔥 MODAL USER
========================================= */

function abrirModalUsuario() {

  showModalUsuario.value = true

}

/* =========================================
🔥 COUNTS
========================================= */

function updateCounts(payload) {

  carritoCountLocal.value =
    payload.carrito || 0

  favoritosCountLocal.value =
    payload.favoritos || 0

}

onMounted(() => {

  bus.on(
    'header:updateCounts',
    updateCounts
  )

})

onUnmounted(() => {

  bus.off(
    'header:updateCounts',
    updateCounts
  )

})

/* =========================================
🔥 MENU USER
========================================= */

function abrirMenuUsuario() {

  showMenuUsuario.value = true

}

/* =========================================
🔥 FAVORITOS
========================================= */

function irFavoritos() {

  router.push({

    path:
      '/Adfj_mis_favoritos',

    query: {

      titulo:
        'Favoritos'

    }

  })

}

/* =========================================
🔥 CARRITO
========================================= */

function irCarrito() {

  router.push({

    path:
      '/URl4_usuario_carrito',

    query: {

      titulo:
        'Carrito de compras'

    }

  })

}

/* =========================================
🔥 BACK
========================================= */

function goBack() {

  if (
    window.history.length > 1
  ) {

    router.back()

  } else {

    router.push('/')

  }

}

/* =========================================
🔥 FAVORITOS COUNT
========================================= */

const favoritosCount =
  computed(() => {

    return favoritosCountLocal.value || 0

  })

/* =========================================
🔥 CARRITO COUNT
========================================= */

const carritoCount =
  computed(() => {

    return carritoCountLocal.value || 0

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