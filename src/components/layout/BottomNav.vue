<template>
  <div v-if="
    shouldShowBottomNav
  " class="bottom-nav fixed bottom-0 left-0 w-full h-20
           flex items-center
           bg-white
           shadow-[0_-5px_20px_rgba(0,0,0,0.08)]
           rounded-t-3xl
           z-50">

    <!-- INICIO -->
    <!-- INICIO -->
    <button class="flex-1 h-full flex flex-col items-center justify-center relative" @click="goInicio">

      <i class="fa fa-home text-xl transition" :class="isActiveInicio()
        ? 'text-orange-500'
        : 'text-white'
        ">
      </i>

      <span class="text-xs mt-1 transition" :class="isActiveInicio()
        ? 'text-orange-500 font-semibold'
        : 'text-white'
        ">

        Inicio

      </span>

    </button>

    <!-- CHATS -->
    <button class="flex-1 h-full flex flex-col items-center justify-center relative"
      @click="go('/Wvn1_mis_mensajes?titulo=Chats')">

      <i class="fa fa-list-alt text-xl transition" :class="isActive('/Wvn1_mis_mensajes')
        ? 'text-orange-500'
        : 'text-white'
        ">
      </i>

      <!-- BADGE -->
      <span v-if="cantMensajes > 0" class="
      absolute
      top-3
      right-8
      bg-red-500
      text-white
      text-xs
      w-5
      h-5
      rounded-full
      flex
      items-center
      justify-center
    ">

        {{ cantMensajes }}

      </span>

      <span class="text-xs mt-1 transition" :class="isActive('/Wvn1_mis_mensajes')
        ? 'text-orange-500 font-semibold'
        : 'text-white'
        ">

        Chats

      </span>

    </button>

    <!-- PEDIDOS -->
    <button class="flex-1 h-full flex flex-col items-center justify-center relative" @click="go('/mod_pedidos')">

      <i class="fa fa-shopping-basket text-xl transition" :class="isActive('/mod_pedidos')
        ? 'text-orange-500'
        : 'text-white'
        ">
      </i>

      <!-- BADGE -->
      <span v-if="cantPedidos > 0" class="
      absolute
      top-3
      right-8
      bg-red-500
      text-white
      text-xs
      w-5
      h-5
      rounded-full
      flex
      items-center
      justify-center
    ">

        {{ cantPedidos }}

      </span>

      <span class="text-xs mt-1 transition" :class="isActive('/mod_pedidos')
        ? 'text-orange-500 font-semibold'
        : 'text-white'
        ">

        Pedidos

      </span>

    </button>

    <!-- MENU -->
    <button class="flex-1 h-full flex flex-col items-center justify-center" @click="abrirMenuUsuario">

      <i class="
            fa
            fa-bars

            text-xl

            transition
        " :class="showMenuUsuario

          ?

          'text-orange-500'

          :

          'text-white'
          ">
      </i>

      <span class="
            text-xs
            mt-1
            transition
        " :class="showMenuUsuario

          ?

          'text-orange-500 font-semibold'

          :

          'text-white'
          ">

        Menú

      </span>

    </button>

  </div>

  <ModalMenuUsuario v-model="showMenuUsuario
    " @open-info="
      showUsuario = true
      " />

  <ModalUsuario v-model="showUsuario
    " />
</template>
<script setup>

import {
  useRouter,
  useRoute
}
  from 'vue-router'


import {
  computed,
  ref,
  onMounted,
  onUnmounted
}
  from 'vue'

import axios
  from 'axios'

import {
  useUsuario
}
  from '../../services/usuarioService.js'

import {
  bus
}
  from '../../services/eventBus.js'

import {
  useTrackingQueue
}
  from '../../services/useTrackingQueue.js'

import ModalMenuUsuario
  from '../ModalMenuUsuario.vue'

import ModalUsuario
  from '../ModalUsuario.vue'
/* ======================================
   ENV
====================================== */

const API =
  import.meta.env.VITE_PUBLIC_URL_BASE

const POLLING =
  Number(
    import.meta.env.VITE_PUBLIC_RQ_POLLING
    || 1
  )

const mercadoId =
  import.meta.env.VITE_PUBLIC_MERCADO_ID

const negId =
  import.meta.env.VITE_PUBLIC_NEG_ID

/* ======================================
   ROUTER
====================================== */

const router =
  useRouter()

const route =
  useRoute()

/* ======================================
   BOTTOM NAV
====================================== */

const hideCount =
  ref(0)

/* ======================================
   TRACKING
====================================== */

const showMenuUsuario =
  ref(false)

const showUsuario =
  ref(false)

const {

  getTracking,
  clearTracking

} =
  useTrackingQueue()

function abrirMenuUsuario() {

  showMenuUsuario.value = true

}

/* ======================================
   PATH ACTUAL
====================================== */

const currentPath =
  computed(() => {

    return (
      route.path
      ||
      ''
    )

  })

/* ======================================
   🔥 HIDE POR RUTA
====================================== */

const shouldHideByRoute =
  computed(() => {

    return !!route.meta?.hideNav

  })

/* ======================================
   USUARIO
====================================== */

const {

  getUsuId,
  isLogged,
  usuario

} =
  useUsuario()

const usu_id =
  computed(() => {

    return (

      usuario.value?.user?.usu_id

      ||

      null

    )

  })

/* ======================================
   🔥 MOSTRAR NAV
====================================== */

const shouldShowBottomNav =
  computed(() => {

    return (

      isLogged.value

      &&

      hideCount.value <= 0

      &&

      !shouldHideByRoute.value

    )

  })

/* ======================================
   BADGES
====================================== */

const cantMensajes =
  ref(0)

const cantPedidos =
  ref(0)

/* ======================================
   INTERVAL
====================================== */

let interval =
  null

/* ======================================
   🔥 CARGAR BADGES
====================================== */

async function cargarCantidadMensajes() {

  if (!usu_id.value)
    return

  try {

    const res =
      await axios.post(

        `${API}/reg/tk_cant_msg`,

        {

          usu_id:
            usu_id.value,

          tracking:
            getTracking()

        }

      )

    console.log(
      '📨 tk_cant_msg:',
      res.data
    )


    /* ======================================
       🔥 LISTA MESAS
    ====================================== */

    if (

      Array.isArray(
        res.data.lista_mesas
      )

    ) {

      bus.emit(

        'mesas:update',

        res.data.lista_mesas

      )

    }

    /* ======================================
       🔥 BADGE CHATS
    ====================================== */

    cantMensajes.value =

      res.data.mensajes_nuevos
      ||
      0

    /* ======================================
       🔥 BADGE PEDIDOS
    ====================================== */

    cantPedidos.value =

      res.data.carritos_enviados
      ||
      0

    /* ======================================
       🔥 CACHE
    ====================================== */

    localStorage.setItem(

      'regentis_chats_cache',

      JSON.stringify({

        ts:
          Date.now(),

        data:
          res.data.data
          ||
          []

      })

    )

    /* ======================================
       🔥 EVENTOS
    ====================================== */

    bus.emit(

      'chat:update',

      res.data.data
      ||
      []

    )

    bus.emit(

      'header:updateCounts',

      {

        mensajes:
          res.data.mensajes_nuevos
          ||
          0,

        carrito:
          res.data.carrito_count
          ||
          0,

        favoritos:
          res.data.favoritos_count
          ||
          0,

        pedidos:
          res.data.carritos_enviados
          ||
          0

      }

    )

    /* ======================================
       🔥 CLEAR TRACKING
    ====================================== */

    if (

      res.data.estado
      ===
      'ok'

    ) {

      clearTracking()

    }

  } catch (e) {

    console.error(
      '❌ error badge:',
      e
    )

  }

}

/* ======================================
   🔥 INIT
====================================== */

onMounted(() => {

  /* ======================================
     🔥 BADGES
  ====================================== */

  cargarCantidadMensajes()

  /* ======================================
     🔥 POLLING
  ====================================== */

  interval =
    setInterval(() => {

      cargarCantidadMensajes()

    },

      POLLING
      *
      60
      *
      1000

    )

  /* ======================================
     🔥 TOGGLE GLOBAL
  ====================================== */

  bus.on(

    'bottomnav:toggle',

    (estado) => {

      /* ======================================
         🔥 HIDE
      ====================================== */

      if (estado) {

        hideCount.value++

        return

      }

      /* ======================================
         🔥 SHOW
      ====================================== */

      hideCount.value--

      if (

        hideCount.value < 0

      ) {

        hideCount.value = 0

      }

    }

  )

})

/* ======================================
   🔥 DESTROY
====================================== */

onUnmounted(() => {

  if (interval) {

    clearInterval(interval)

  }

})

/* ======================================
   🔥 NAVIGATE
====================================== */

function go(path) {

  router.push(path)

}

/* ======================================
   🔥 ACTIVE
====================================== */

function isActive(path) {

  return currentPath.value
    .startsWith(path)

}

/* ======================================
   🔥 GO INICIO
====================================== */

function goInicio() {

  if (

    String(mercadoId)
    ===
    '0'

  ) {

    router.push(
      `/CV2K_negocio/${negId}`
    )

  }

  else {

    router.push(
      '/principal'
    )

  }

}

/* ======================================
   🔥 ACTIVE INICIO
====================================== */

function isActiveInicio() {

  if (

    String(mercadoId)
    ===
    '0'

  ) {

    return currentPath.value
      .startsWith('/CV2K_negocio')

  }

  return (
    currentPath.value
    ===
    '/principal'
  )

}

</script>
<style scoped>
.bottom-nav {
  background-image:
    radial-gradient(circle at center center, rgba(33, 33, 33, 0), rgb(33, 33, 33)),
    repeating-linear-gradient(135deg, rgb(33, 33, 33) 0px, rgb(33, 33, 33) 1px, transparent 1px, transparent 4px),
    repeating-linear-gradient(45deg, rgb(56, 56, 56) 0px, rgb(56, 56, 56) 5px, transparent 5px, transparent 6px),
    linear-gradient(90deg, rgb(33, 33, 33), rgb(33, 33, 33));

  color: white;
}

.bottom-nav i,
.bottom-nav span {

  transition:
    all 0.2s ease;

}

.bottom-nav button:hover i,
.bottom-nav button.active i {
  color: #FD7635;
}
</style>