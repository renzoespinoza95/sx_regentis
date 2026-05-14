<template>

  <div class="header-wrapper" :style="{ '--header-color': mercadoData.topnavbar_color || '#FD7635' }">

    <div class="header-inner">

      <!-- LOGO -->
      <div class="logo-box">

        <img :src="mercadoData.logo || 'https://barsi-img.b-cdn.net/recursos/logo-regentis.png'" class="logo-img" />

        <span class="logo-text">

          {{ tituloHeader }}

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
              1
            </span>
          </div>

          <!-- AVATAR -->
          <img :src="user?.img_perfil || 'https://picsum.photos/80'" class="avatar cursor-pointer"
            @click="openUserModal" />

        </template>

      </div>

    </div>
  </div>

  <!-- 🔥 MODAL USUARIO -->
  <ModalUsuario v-model="showUserModal" />

  <!-- 🔥 MODAL MENU USUARIO -->
  <ModalMenuUsuario v-model="showMenuModal" />
  <AppSnackbar ref="snackbarRef" />

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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

import {
  auth,
  provider
} from '../../../services/firebase.js'

const router = useRouter()
const {
  isLogged,
  usuario,
  setLoginData
} = useUsuario()

const props = defineProps({

  titulo: {
    type: String,
    default: ''
  }

})

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

const tituloHeader = computed(() => {

  return (
    props.titulo
    ||
    mercadoData.value.nombre
    ||
    'Regentis'
  )

})

async function irLogin() {

  try {

    // 🔥 LOGIN GOOGLE
    const result = await signInWithPopup(
      auth,
      provider
    )

    const user = result.user

    // 🔐 TOKEN FIREBASE
    const idToken =
      await user.getIdToken()

    // 🚀 BACKEND
    const res = await api.post(

      '/coral/crearUsuarioFirebase',

      {
        token: idToken
      }

    )

    // 🔥 LOGIN OK
    // 🔥 LOGIN OK
    if (res.data.status === 'ok') {

      setLoginData(
        res.data
      )

      // 🔥 USUARIO
      const usu_id =
        res.data?.data?.usu_id

      // 🚀 REDIRECT
      router.replace(
        `/registroBasico/${usu_id}`
      )

    } else {

      snackbarRef.value?.open(
        res.data.msg
        || 'Error al iniciar sesión'
      )

    }

  } catch (e) {

    console.error(
      'Error login Google',
      e
    )

    snackbarRef.value?.open(

      e?.response?.data?.msg
      ||
      'Error al iniciar sesión'

    )

  }

}

/* =========================
   🔥 FIX REAL DEL ERROR
========================= */
onMounted(() => {

  // 👇 SOLO carga si aún no existe
  if (!mercado.value) {
    principal.refetch?.()
  }

})
</script>

<style scoped>
.header-wrapper {

  width: 100%;

  position: fixed;

  top: 0;

  left: 0;

  right: 0;

  z-index: 9999;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);

  padding: 16px 0;

  background: var(--header-color, #FD7635);

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
  background: white;
}
</style>