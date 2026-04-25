<template>
  <div class="w-full max-w-sm relative">

    <!-- TARJETA -->
    <div class="card relative overflow-hidden">

      <!-- 🌊 WAVE SUPERIOR EN #EA6223 -->
      <div class="absolute top-0 left-0 w-full z-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" class="w-full h-28" preserveAspectRatio="none">
          <path fill="#EA6223"
            d="M0,192L40,181.3C80,171,160,149,240,138.7C320,128,400,128,480,149.3C560,171,640,213,720,245.3C800,277,880,299,960,298.7C1040,299,1120,277,1200,250.7C1280,224,1360,192,1400,176L1440,160L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z" />
        </svg>
      </div>

      <!-- 🍊 GLOW -->
      <div class="absolute inset-0 z-0 pointer-events-none orange-glow"></div>

      <!-- CONTENIDO -->
      <div class="relative z-10">

        <!-- LOGO -->
        <div class="logo-header">
          <img src="/logo-final02.png" class="logo-img" alt="Logo" />
        </div>

        <div class="input-group">
          <input v-model="sobrenombre" type="text" placeholder="Usuario" class="input-style" />
        </div>

        <div class="input-group">
          <input v-model="clavel" type="password" placeholder="Clave" class="input-style" @keyup.enter="login" />
        </div>

        <!-- BOTÓN INGRESAR -->
        <button @click="login" class="btn-login" :disabled="loading">
          <span v-if="!loading">Ingresar</span>
          <span v-else>Procesando...</span>
        </button>

        <!-- BOTÓN GOOGLE -->
        <button class="btn-google" @click="loginWithGoogle">
          <i class="fa fa-google google-icon"></i>
          <span>Ingresar con Google</span>
        </button>

        <div class="text-center mt-4">
          <a @click.prevent="irRegistro" class="link-orange cursor-pointer">
            Registrarse manualmente
          </a>
        </div>

      </div>
    </div>
  </div>

  <!-- TOAST -->
  <div v-if="toast.show" ref="toastRef"
    class="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full text-white font-medium shadow-lg z-50"
    :class="toast.ok ? 'bg-green-500' : 'bg-red-500'">
    {{ toast.msg }}
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, nextTick } from 'vue'
import { gsap } from 'gsap'
import { signInWithPopup, signInWithRedirect } from "firebase/auth"
import { auth, provider } from '../../../services/firebase.js'

import { useUsuario } from '../../../services/usuarioService.js'
import { api, enc_barsi } from '../../../services/api.js'

const router = useRouter()
const { setLoginData } = useUsuario()
const { push } = useRouter()

const sobrenombre = ref('')
const clavel = ref('')
const loading = ref(false)

const toast = ref({
  show: false,
  msg: '',
  ok: false
})

const toastRef = ref(null)

function showToast(msg, ok = false) {
  toast.value.msg = msg
  toast.value.ok = ok
  toast.value.show = true

  nextTick(() => {
    gsap.fromTo(
      toastRef.value,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    )

    setTimeout(() => {
      gsap.to(toastRef.value, {
        y: 80,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.in',
        onComplete: () => {
          toast.value.show = false
        }
      })
    }, 2000)
  })
}

async function login() {
  if (!sobrenombre.value || !clavel.value) {
    showToast('Completa los campos')
    return
  }

  try {
    loading.value = true

    const encSobrenombre = await enc_barsi(sobrenombre.value)
    const encClavel = await enc_barsi(clavel.value)

    const res = await api.post('/coral/login', {
      sobrenombre: encSobrenombre,
      clavel: encClavel
    })

    if (res.data.status === 'ok') {

      // 🔥 GUARDAR TODO EN SERVICE
      setLoginData(res.data)

      // 🔥 REDIRECCIÓN
      router.replace('/principal')

    } else {
      showToast(res.data.msg || 'Error al iniciar sesión')
    }

  } catch (error) {
    showToast(error.response?.data?.msg || 'Error de conexión')
  } finally {
    loading.value = false
  }
}

function irRegistro() {
  router.push('/Cuvg_crear_usu')
}

async function loginWithGoogle() {
  try {

    loading.value = true

    // 🔥 usa esto si estás en TWA (recomendado)
    const result = await signInWithPopup(auth, provider)

    const user = result.user

    // 🔐 token Firebase
    const idToken = await user.getIdToken()

    // 🚀 enviar a tu backend
    const res = await api.post('/coral/crearUsuarioFirebase', {
      token: idToken
    })

    if (res.data.status === 'ok') {
      setLoginData(res.data.data)
      router.replace('/principal')
    }

    if (res.data.status === 'ok') {

      setLoginData(res.data)

      router.replace('/principal')

    } else {
      showToast(res.data.msg || 'Error con Google')
    }

  } catch (error) {
    console.error(error)
    showToast('Error al iniciar con Google')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* LOGO */
.logo-header {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 35px;
}

.logo-img {
  width: 300px;
  height: auto;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.25));
  animation: float 5s ease-in-out infinite;
}

/* ANIMACIÓN FLOTANTE */
@keyframes float {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(10px);
  }

  100% {
    transform: translateY(0px);
  }
}

/* CARD */
.card {
  background: linear-gradient(180deg, #EA6223 0%, #ffffff 100%);
  border-radius: 28px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
  padding: 60px 30px 35px 30px;
  position: relative;
}

/* INPUT */
.input-group {
  margin-bottom: 22px;
}

.input-style {
  width: 100%;
  padding: 12px 5px;
  background: transparent;
  border: none;
  border-bottom: 2px solid #EA6223;
  font-size: 16px;
  outline: none;
  transition: 0.3s;
}

.input-style:focus {
  border-bottom: 2px solid #c44e16;
}

/* BOTÓN INGRESAR */
.btn-login {
  width: 100%;
  padding: 14px;
  border-radius: 999px;
  background: linear-gradient(90deg, #EA6223, #c44e16);
  color: white;
  font-weight: 600;
  box-shadow: 0 8px 20px rgba(234, 98, 35, 0.4);
  transition: 0.3s;
  margin-top: 10px;
}

.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(234, 98, 35, 0.5);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* BOTÓN GOOGLE */
.btn-google {
  width: 100%;
  padding: 14px;
  margin-top: 15px;
  border-radius: 6px;
  background-color: #4285F4;
  color: white;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  transition: 0.3s;
}

.btn-google:hover {
  background-color: #357ae8;
}

.google-icon {
  font-size: 18px;
}

/* LINKS */
.link-orange {
  color: #EA6223;
  font-weight: 500;
}

/* GLOW */
.orange-glow {
  background-image: radial-gradient(140% 140% at 50% 0%,
      rgba(255, 255, 255, 0.85) 25%,
      rgba(234, 98, 35, 0.55) 70%,
      rgba(234, 98, 35, 0.75) 100%);
  background-size: 100% 100%;
}
</style>