<template>

  <div class="tn-header fixed top-0 left-0 right-0 z-50">

    <!-- IZQUIERDA: VOLVER -->
    <div class="tn-header-left">

      <button v-if="!isNegocioHome" type="button" class="tn-icon-btn" aria-label="Volver" @click="goBack">

        <i class="fa fa-arrow-left"></i>

      </button>

    </div>

    <!-- CENTRO: MARCA -->
    <div class="tn-brand">

      <img class="tn-brand-logo" :src="data?.negocio?.img_logo || LOGO_DEFAULT" alt="Logo">

      <span class="tn-brand-name">
        {{ titulo }}
      </span>

    </div>

    <!-- DERECHA: ACCIONES -->
    <div class="tn-header-right">

      <!-- CARRITO ANONIMO -->
      <button v-if="!isLogged" id="icon-carrito-header" type="button" class="tn-icon-btn" aria-label="Carrito"
        @click="irCarritoAnonimo">

        <i class="fa fa-shopping-cart"></i>

        <span v-if="carritoCount > 0" class="tn-badge">
          {{ carritoCount }}
        </span>

      </button>

      <!-- COMPARTIR -->
      <button type="button" class="tn-icon-btn" aria-label="Compartir" @click="showCompartir = true">

        <i class="fa fa-share-alt"></i>

      </button>

      <!-- NO LOGUEADO -->
      <button v-if="!isLogged" type="button" class="tn-icon-btn" aria-label="Ingresar" @click="irLogin">

        <i class="fa fa-user"></i>

      </button>

      <!-- LOGUEADO -->
      <button v-else type="button" class="tn-icon-btn" aria-label="Menú" @click="abrirMenuUsuario">

        <span class="tn-avatar">

          <img :src="user?.img_perfil || 'https://picsum.photos/80'" alt="Perfil">

        </span>

        <span v-if="favoritosCount > 0" class="tn-badge">
          {{ favoritosCount }}
        </span>

      </button>

    </div>

  </div>

  <!-- MODALES -->
  <ModalUsuario v-model="showModalUsuario" />
  <ModalMenuUsuario v-model="showMenuUsuario" />
  <LoginSelectorDialog v-model="showLoginSelector" @registrarse="loginFirebase" @pin="showPinDialog = true" />

  <PinCodeDialog v-model="showPinDialog" />
  <CompartirNegocioDialog v-model="showCompartir" :slug="data?.negocio?.slug || ''" />

</template>

<script setup>

import { useRouter, useRoute } from 'vue-router'
import { useUsuario } from '../../services/usuarioService.js'
import ModalUsuario from '../ModalUsuario.vue'
import ModalMenuUsuario from '../ModalMenuUsuario.vue'
import { useTienda } from '../../services/useTienda.js'
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  watch
}
  from 'vue'
import { bus } from '../../services/eventBus.js'
import CompartirNegocioDialog
  from './CompartirNegocioDialog.vue'
import { useAnonimo }
  from '../../services/anonimoService.js'

import LoginSelectorDialog
  from '../../modules/retail/consumidor/XXV1_origen/components/LoginSelectorDialog.vue'

import PinCodeDialog
  from '../../modules/retail/consumidor/XXV1_origen/components/PinCodeDialog.vue'

import {
  signInWithPopup
}
  from "firebase/auth"

import {
  auth,
  provider
}
  from '../../services/firebase.js'

import axios
  from 'axios'

const LOGO_DEFAULT =
  'https://barsi-img.b-cdn.net/recursos/logo-regentis.png'

/* =========================================
   PROPS (se mantiene por compatibilidad)
========================================= */

const props = defineProps({

  showLogoLeft: {
    type: Boolean,
    default: false
  }

})

/* =========================================
   DATA
========================================= */

const { data } = useTienda()

const {
  anonimo,
  setNegocio
} = useAnonimo()

const {

  isLogged,

  usuario,

  setLoginData

} = useUsuario()

const user = computed(() => {
  return usuario.value?.user || null
})

const api = axios.create({

  baseURL:
    import.meta.env.VITE_PUBLIC_URL_BASE

})

const router = useRouter()
const route = useRoute()

/* =========================================
   ESTADO
========================================= */

const showCompartir =
  ref(false)

const carritoCountLocal = ref(0)
const favoritosCountLocal = ref(0)

const showModalUsuario = ref(false)
const showMenuUsuario = ref(false)

const showLoginSelector =
  ref(false)

const showPinDialog =
  ref(false)

/* =========================================
   TITULO
========================================= */

const titulo = computed(() => {

  return route.query.titulo
    || data.value?.negocio?.nombre
    || 'Tienda'

})

/* =========================================
   LOGIN
========================================= */

function irLogin() {

  showLoginSelector.value = true

}

async function loginFirebase() {

  try {

    const result =
      await signInWithPopup(

        auth,
        provider

      )

    const userFirebase =
      result.user

    const idToken =
      await userFirebase.getIdToken()

    const res =
      await api.post(

        '/coral/crearUsuarioFirebase',

        {

          token:
            idToken

        }

      )

    if (

      res.data.status
      ===
      'ok'

    ) {

      setLoginData(
        res.data
      )

      router.replace(
        `/`
      )

    }

  }

  catch (e) {

    console.error(e)

  }

}

/* =========================================
   RUTA
========================================= */

const isNegocioHome =
  computed(() => {

    return String(
      route.name || ''
    ) === 'CV2K_negocio'

      ||

      String(
        route.path || ''
      ).startsWith('/CV2K_negocio/')

  })

/* =========================================
   MENUS
========================================= */

function abrirMenuUsuario() {

  showMenuUsuario.value = true

}

function irCarritoAnonimo() {

  router.push({

    path:
      '/RF5S_anonimo_carrito',

    query: {

      titulo:
        'Carrito'

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

/* =========================================
   CONTADORES
========================================= */

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

watch(

  () => data.value?.negocio?.neg_id,

  (neg_id) => {

    if (!neg_id)
      return

    setNegocio(
      neg_id
    )

  },

  {
    immediate: true
  }

)

const favoritosCount = computed(() => {

  return favoritosCountLocal.value
    || data.value?.favoritos_count
    || 0

})

const carritoCount = computed(() => {

  return (

    anonimo.value?.productos

      ?.reduce(

        (
          sum,
          p
        ) =>

          sum +

          Number(
            p.cantidad || 0
          ),

        0

      )

    ||

    0

  )

})

</script>