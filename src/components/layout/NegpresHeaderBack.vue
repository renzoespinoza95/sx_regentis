<template>
  <div class="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 pt-4 pb-3" :style="headerStyle">

    <!-- LEFT: BACK -->
    <!-- LEFT -->
    <div class="flex items-center gap-2 cursor-pointer" @click="goBack">

      <!-- =========================================
       LOGO LEFT
  ========================================= -->
      <template v-if="showLogoLeft">

        <div class="logo-box">

          <!-- 🔙 BACK -->
          <button v-if="route.query?.titulo" @click="router.back()" class="
        w-10
        h-10

        rounded-full

        bg-white

        flex
        items-center
        justify-center

        shadow-[0_4px_12px_rgba(0,0,0,0.12)]

        active:scale-95

        transition
    ">

            <i class="
            fa
            fa-arrow-left

            text-sm

            text-[#7DBA66]
        ">

            </i>

          </button>

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

          <i class="fa fa-arrow-left text-sm text-[#FD7635]">
          </i>

        </div>

        <span class="font-semibold text-lg text-white">
          {{ titulo }}
        </span>

      </template>

    </div>

    <div class="flex items-center gap-2">

      <!-- CARRITO -->
      <div id="icon-carrito-header" class="relative icon-btn p-0" @click="irCarritoAnonimo">

        <div class="
      w-full
      h-full

      flex
      items-center
      justify-center

      rounded-full

      bg-gradient-to-br

      from-[#FD7635]
      via-[#FF934D]
      to-[#FFB347]

      shadow-[0_0_15px_rgba(253,118,53,.45)]
    ">

          <i class="fa fa-shopping-cart text-white"></i>

        </div>

        <span v-if="carritoCount > 0" class="notif-badge">

          {{ carritoCount }}

        </span>

      </div>

      <!-- COMPARTIR -->
      <div class="relative icon-btn p-0" @click="showCompartir = true">

        <div class="
      w-full
      h-full

      flex
      items-center
      justify-center

      rounded-full

      bg-gradient-to-br

      from-[#FD7635]
      via-[#FF934D]
      to-[#FFB347]

      shadow-[0_0_15px_rgba(253,118,53,.45)]
    ">

          <i class="fa fa-mail-forward text-white"></i>

        </div>

      </div>

      <!-- NO LOGUEADO -->
      <button v-if="!isLogged" @click="irLogin" class="icon-btn p-0">

        <div class="
      w-full
      h-full

      flex
      items-center
      justify-center

      rounded-full

      bg-gradient-to-br

      from-[#FD7635]
      via-[#FF934D]
      to-[#FFB347]

      shadow-[0_0_15px_rgba(253,118,53,.45)]
    ">

          <i class="fa fa-user text-white"></i>

        </div>

      </button>

      <!-- LOGUEADO -->
      <div v-else class="relative icon-btn p-0" @click="abrirMenuUsuario">

        <div class="avatar-mask">

          <img :src="user?.img_perfil
            ||
            'https://picsum.photos/80'
            " class="
          w-full
          h-full
          object-cover
        " />

        </div>

        <span v-if="favoritosCount > 0" class="notif-badge">

          {{ favoritosCount }}

        </span>

      </div>

    </div>

    <!-- MODALES -->
    <ModalUsuario v-model="showModalUsuario" />
    <ModalMenuUsuario v-model="showMenuUsuario" />
    <CompartirNegocioDialog v-model="showCompartir" :slug="data?.negocio?.slug
      ||
      ''
      " />

  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useUsuario } from '../../services/usuarioService.js'
import { useMercado } from '../../services/useMercado.js'
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

import {
  cssToObject
}
  from '../../services/useCss.js'

const { data } = useTienda()

const {
  anonimo,
  setNegocio
} = useAnonimo()

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

const showCompartir =
  ref(false)

const carritoCountLocal = ref(0)
const favoritosCountLocal = ref(0)

const showModalUsuario = ref(false)
const showMenuUsuario = ref(false)

const titulo = computed(() => {

  return route.query.titulo
    || data.value?.negocio?.nombre
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
const headerStyle = computed(() => {

  const tema_id = Number(
    data.value?.tema?.tema_id || 0
  )

  if (

    tema_id > 0

    &&

    data.value?.tema?.topnavbar

  ) {

    return {

      ...cssToObject(

        data.value.tema.topnavbar

      ),

      '--header-color': '#FD7635'

    }

  }

  return {

    background:

      mercado.value?.topnavbar_color

      ||

      '#FD7635',

    '--header-color':

      mercado.value?.topnavbar_color

      ||

      '#FD7635'

  }

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

  router.push({

    path: '/Adfj_mis_favoritos',

    query: {

      titulo: 'Favoritos'

    }

  })

}

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

<style scoped>
.icon-btn {

  width: 36px;
  height: 36px;

  position: relative;

  background: white;

  border-radius: 50%;

  overflow: visible;
  /* SOLO PARA EL BADGE */

}

.avatar-mask {

  width: 100%;
  height: 100%;

  border-radius: 50%;

  overflow: hidden;
  /* SOLO LA FOTO */

}



.icon-btn:active {
  transform: scale(0.9);
}

.icon-btn i {
  font-size: 14px;
}

.notif-badge {

  position: absolute;

  top: -7px;

  right: -8px;

  min-width: 20px;

  height: 20px;

  padding: 0 4px;

  background: #EF4444;

  color: white;

  font-size: 10px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 9999px;

  font-weight: 700;

  z-index: 100;

  box-shadow:
    0 2px 8px rgba(0, 0, 0, .25);

}

.icon-btn {

  overflow: visible;

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