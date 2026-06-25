<template>

  <div class="header-wrapper" :style="headerStyle">

    <div class="header-inner">

      <!-- LOGO -->
      <!-- LEFT -->
      <div class="flex items-center gap-3">

        <!-- 🔙 BACK -->
        <button @click="goBack" class="
    w-10
    h-10

    flex
    items-center
    justify-center

    active:scale-95

    transition
  ">

          <i class="fa fa-arrow-left text-lg" :style="{

            color:

              Number(
                tema?.tema_id || 0
              ) > 0

                ?

                '#FFFFFF'

                :

                (

                  mercadoData.topnavbar_color

                  ||

                  '#FD7635'

                )

          }">
          </i>

        </button>

        <!-- LOGO -->
        <div class="logo-box">

          <img :src="mercadoData.logo || 'https://barsi-img.b-cdn.net/recursos/logo-regentis.png'" class="logo-img" />

          <span class="logo-text">

            {{ tituloHeader }}

          </span>

        </div>

      </div>

      <!-- RIGHT SIDE -->
      <div class="header-actions">

        <!-- CARRITO -->
        <!-- CARRITO -->
        <div class="relative icon-btn p-0" @click="irCarritoAnonimo">

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
        <div v-else class="relative icon-btn p-0">

          <div class="avatar-mask">

            <img :src="user?.img_perfil
              ||
              'https://picsum.photos/80'
              " class="
          w-full
          h-full
          object-cover
        " @click="openUserModal" />

          </div>

        </div>

      </div>

    </div>
  </div>

  <!-- 🔥 MODAL USUARIO -->
  <ModalUsuario v-model="showUserModal" />

  <!-- 🔥 MODAL MENU USUARIO -->
  <ModalMenuUsuario v-model="showMenuModal" />
  <AppSnackbar ref="snackbarRef" />

  <LoginSelectorDialog v-model="showLoginSelector
    " @registrarse="
      loginFirebase
    " @pin="
      showPinDialog = true
      " />

  <PinCodeDialog v-model="showPinDialog
    " />

  <CompartirNegocioDialog v-model="showCompartir" :slug="data?.negocio?.slug
    ||
    ''
    " />

</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  useRouter,
  useRoute
}
  from 'vue-router'
import { useUsuario } from '../../../services/usuarioService.js'
import { useMercado } from '../../../services/useMercado.js'
import { usePrincipal } from '../../../services/usePrincipal.js'
import AppSnackbar
  from '../../../components/layout/AppSnackbar.vue'
import ModalUsuario from '../../../components/ModalUsuario.vue'
import ModalMenuUsuario from '../../../components/ModalMenuUsuario.vue'
import {
  signInWithPopup
} from "firebase/auth"
import axios
  from 'axios'

import {
  auth,
  provider
} from '../../../services/firebase.js'

import LoginSelectorDialog
  from '../../retail/consumidor/XXV1_origen/components/LoginSelectorDialog.vue'

import PinCodeDialog
  from '../../retail/consumidor/XXV1_origen/components/PinCodeDialog.vue'
import { useTienda } from '../../../services/useTienda.js'
import CompartirNegocioDialog
  from '../../../components/layout/CompartirNegocioDialog.vue'
import { useAnonimo }
  from '../../../services/anonimoService.js'


const router = useRouter()

const api = axios.create({

  baseURL:
    import.meta.env.VITE_PUBLIC_URL_BASE

})


const {
  isLogged,
  usuario,
  setLoginData
} = useUsuario()

const route = useRoute()
const showCompartir = ref(false)
const {

  data,

  tema

} = useTienda()



const props = defineProps({

  titulo: {
    type: String,
    default: ''
  }

})

const {

  anonimo,

  setNegocio

} = useAnonimo()

const showLoginSelector =
  ref(false)

const showPinDialog =
  ref(false)

const user = computed(() => {
  return usuario.value?.user || null
})

// 🔥 estado global
const { mercado } = useMercado()

// 🔥 inicializador global
const principal = usePrincipal()

// 🔥 fallback seguro (CLAVE)
const mercadoData = computed(() => mercado.value || {})

/* 🔥 MODALES */
const showUserModal = ref(false)
const showMenuModal = ref(false)

const snackbarRef = ref(null)

function openUserModal() {
  showUserModal.value = true
}

function cssToObject(cssText) {

  if (!cssText) {

    return {}

  }

  const obj = {}

  cssText
    .split(';')
    .forEach(row => {

      const parts =
        row.split(':')

      if (parts.length < 2) {

        return

      }

      const key =
        parts[0]
          .trim()
          .replace(
            /-([a-z])/g,
            (_, c) => c.toUpperCase()
          )

      const value =
        parts
          .slice(1)
          .join(':')
          .trim()

      obj[key] = value

    })

  return obj

}

const headerStyle = computed(() => {

  if (

    tema.value

    &&

    Number(
      tema.value.tema_id || 0
    ) > 0

    &&

    tema.value.topnavbar

  ) {

    return cssToObject(

      tema.value.topnavbar

    )

  }

  return {

    background:

      mercadoData.value
        ?.topnavbar_color

      ||

      '#FD7635'

  }

})

const tituloHeader = computed(() => {

  const tituloQuery =
    route.query?.titulo

  return (

    tituloQuery

    ||

    data.value?.negocio?.nombre

    ||

    props.titulo

    ||

    mercadoData.value.nombre

    ||

    'Regentis'

  )

})

function irLogin() {

  showLoginSelector.value =
    true

}

async function loginFirebase() {

  try {

    const result =
      await signInWithPopup(

        auth,
        provider

      )

    const user =
      result.user

    const idToken =
      await user.getIdToken()

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

      const usu_id =
        res.data?.data?.usu_id

      router.replace(
        `/mod_registro/${usu_id}`
      )

    }

  }

  catch (e) {

    console.error(e)

  }

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

const carritoCount =
  computed(() => {

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

function irCarritoAnonimo() {

  router.push(
    '/RF5S_anonimo_carrito'
  )

}

/* =========================================
   🔥 VERSION APP
========================================= */

const version =
  import.meta.env.VITE_PUBLIC_VERSION

const versionPrincipal = computed(() => {

  try {

    const cache = JSON.parse(
      localStorage.getItem(
        'regentis_principal_cache'
      ) || '{}'
    )

    return cache.version || '0'

  } catch (e) {

    return '0'

  }

})

const necesitaActualizar = computed(() => {

  const local =
    String(version || '0')
      .split('.')
      .map(Number)

  const remoto =
    String(versionPrincipal.value || '0')
      .split('.')
      .map(Number)

  for (let i = 0; i < Math.max(local.length, remoto.length); i++) {

    const l = local[i] || 0
    const r = remoto[i] || 0

    if (r > l) return true

    if (r < l) return false

  }

  return false

})

/* =========================
   🔥 FIX REAL DEL ERROR
========================= */
onMounted(() => {

  // 👇 SOLO carga si aún no existe
  if (!mercado.value) {
    principal.refetch?.()
  }

})

/* =========================================
   🔙 BACK
========================================= */

function goBack() {

  /* =========================================
     🔥 SI TIENE TITULO
  ========================================= */

  if (route.query?.titulo) {

    router.back()

    return

  }

  /* =========================================
     🔥 DEFAULT
  ========================================= */

  router.push(
    '/XXV1_origen'
  )

}
</script>

<style scoped>
.header-wrapper {

  width: 100%;

  position: fixed;

  top: 0;

  left: 0;

  right: 0;

  z-index: 9999;

  box-shadow:
    0 4px 12px rgba(0, 0, 0, .12);

  padding: 16px 0;

}

.header-inner {
  max-width: 1400px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.logo-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-text {
  font-weight: 600;
  color: white;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.notification {
  position: relative;
  color: white;
  font-size: 18px;
}

.notification-badge {
  position: absolute;
  top: -6px;
  right: -8px;
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
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.logo-img {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  object-fit: cover;
}

.icon-btn {

  width: 36px;
  height: 36px;

  position: relative;

  background: white;

  border-radius: 50%;

}

.avatar-mask {

  width: 100%;
  height: 100%;

  border-radius: 50%;

  overflow: hidden;

}

.notif-badge {

  position: absolute;

  top: -6px;

  right: -6px;

  min-width: 18px;

  height: 18px;

  padding: 0 4px;

  border-radius: 9999px;

  background: #ef4444;

  color: white;

  font-size: 10px;

  font-weight: 700;

  display: flex;

  align-items: center;

  justify-content: center;

  box-shadow:
    0 2px 8px rgba(0,
      0,
      0,
      .25);

}
</style>