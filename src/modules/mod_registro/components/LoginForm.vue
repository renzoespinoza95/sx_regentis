<template>

  <div class="w-full max-w-sm relative">

    <!-- CARD -->
    <div class="card relative overflow-hidden">

      <!-- 🌊 WAVE -->
      <div class="absolute top-0 left-0 w-full z-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" class="w-full h-28" preserveAspectRatio="none">

          <path fill="#EA6223"
            d="M0,192L40,181.3C80,171,160,149,240,138.7C320,128,400,128,480,149.3C560,171,640,213,720,245.3C800,277,880,299,960,298.7C1040,299,1120,277,1200,250.7C1280,224,1360,192,1400,176L1440,160L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z" />

        </svg>
      </div>

      <!-- GLOW -->
      <div class="absolute inset-0 z-0 pointer-events-none orange-glow"></div>

      <!-- CONTENT -->
      <div class="relative z-10">

        <!-- LOGO -->
        <div class="logo-header">

          <img src="/logo-final02.png" class="logo-img w-48 h-auto" alt="Logo" />

        </div>

        <!-- COD USUARIO -->
        <div class="input-group">

          <label class="label-title">

            Código usuario

          </label>

          <input v-model="codUsu" readonly type="text" class="input-style readonly-input" />

        </div>

        <!-- CELULAR -->
        <div class="input-group">

          <label class="label-title">

            Celular

          </label>

          <input v-model="celular" type="text" maxlength="15" inputmode="numeric" placeholder="Ingresa tu celular"
            class="input-style" />

        </div>

        <!-- SOBRENOMBRE -->
        <div class="input-group">

          <label class="label-title">

            Sobrenombre

          </label>

          <input v-model="sobrenombre" type="text" class="input-style" />

        </div>

        <!-- NOMBRE -->
        <div class="input-group">

          <label class="label-title">

            Nombres y apellidos

          </label>

          <input v-model="nombre" type="text" placeholder="Ingresa tu nombre completo" class="input-style" />

        </div>
        <!-- BOTON -->
        <button class="btn-login" :disabled="loading || !usuarioExiste" :class="{
          'opacity-50 cursor-not-allowed':
            !usuarioExiste
        }" @click="login">

          <span v-if="!loading">

            Ingresar

          </span>

          <span v-else>

            Procesando...

          </span>

        </button>

        <AppSnackbar ref="snackbarRef" />
        <GsapToast ref="toastRef" />


      </div>

    </div>

  </div>
  <AppLoader :show="showLoader" text="Procesando registro..." />
</template>

<script setup>

import {
  onMounted,
  ref,
  watch
} from 'vue'

import axios from 'axios'
import {
  useRoute,
  useRouter
} from 'vue-router'

import AppSnackbar
  from '../../../components/layout/AppSnackbar.vue'
import GsapToast
  from '../../../components/layout/GsapToast.vue'
import AppLoader
  from '../../../components/layout/AppLoader.vue'
import {
  useUsuario
} from '../../../services/usuarioService.js'
import {
  firma
} from '../../../services/security.js'

/* ======================================
   🔥 DEMO
====================================== */

const loading = ref(false)

const nombre = ref('')
const celular = ref('')
const tipo = ref('CLIENTE')

const API =
  import.meta.env.VITE_PUBLIC_URL_BASE

const route = useRoute()
const router = useRouter()

const snackbarRef = ref(null)

const showNegocianteDialog =
  ref(false)
const toastRef = ref(null)
const showLoader = ref(false)
const {
  setLoginData
} = useUsuario()

const usuarioExiste = ref(true)

/* ======================================
   🔥 GENERAR CODIGO
====================================== */

function generarCodigo() {

  const n =
    Math.floor(
      100 + Math.random() * 900
    )

  return `USR${n}`

}

/* ======================================
   🔥 GENERAR NICK
====================================== */

function generarNick() {

  const nombres = [

    'rose',
    'tulip',
    'orchid',
    'lily',
    'violet',
    'daisy',
    'lotus',
    'sunflower',
    'lavender',
    'peony',
    'dragon',
    'jasmine',
    'camelia',
    'iris',
    'magnolia',
    'azalea',
    'gardenia',
    'bamboo',
    'cedar',
    'maple',
    'oak',
    'fenix',
    'falcon',
    'eagle',
    'tiger',
    'panther',
    'lynx',
    'wolf',
    'fox',
    'hawk',
    'cobra',
    'viper',

    'raven',
    'phoenix',
    'otter',
    'whale',
    'orca',
    'dolphin',
    'jaguar',
    'leopard',
    'rhino',
    'buffalo',

    'sakura',
    'everest',
    'amazon',
    'sahara',
    'alaska',
    'denali',
    'bali',
    'kyoto',
    'osaka',
    'tokyo',

    'andes',
    'atlas',
    'himalaya',
    'arizona',
    'nevada',
    'utah',
    'dakota',
    'brooklyn',
    'paris',
    'berlin',

    'aurora',
    'nebula',
    'comet',
    'meteor',
    'eclipse',
    'galaxy',
    'cosmos',
    'saturn',
    'venus',
    'pluto',

    'mist',
    'rain',
    'storm',
    'thunder',
    'shadow',
    'blizzard',
    'frost',
    'ember',
    'flame',
    'river',
    'puma',
    'forest',
    'canyon',
    'valley',
    'island',
    'lagoon',
    'reef',
    'volcano',
    'desert',
    'jungle',
    'oasis',

    'crystal',
    'onyx',
    'ruby',
    'sapphire',
    'opal',
    'pearl',
    'silver',
    'golden',
    'diamond',
    'jade',

    'lotusfox',
    'wildrose',
    'moonwolf',
    'stormhawk',
    'crystalbay',
    'silverlake',
    'emeraldsky',
    'nightpanther',
    'sunsetreef',
    'frozenpeak'

  ]

  const n =
    Math.floor(Math.random() * 999)

  const nombre =
    nombres[
    Math.floor(
      Math.random() * nombres.length
    )
    ]

  return `${nombre}${n}`

}

watch(celular, (v) => {

  celular.value = (v || '')
    .replace(/\D/g, '')
    .slice(0, 15)

})

const codUsu = ref(
  generarCodigo()
)

const sobrenombre = ref(
  generarNick()
)


/* ======================================
   🔥 SOLO LETRAS NUMEROS _ -
====================================== */

function limpiarTexto(v) {

  return (v || '')
    .replace(/[^a-zA-Z0-9_\-]/g, '')

}

/* ======================================
   🔥 WATCH
====================================== */

watch(sobrenombre, (v) => {

  sobrenombre.value =
    limpiarTexto(v)

})

watch(nombre, (v) => {

  nombre.value = (v || '')
    .replace(/[^a-zA-Z0-9_\-\s]/g, '')

})

watch(tipo, (v) => {

  // 🔥 NEGOCIANTE
  if (v === 'NEGOCIANTE') {

    showNegocianteDialog.value = true

  }

})

/* ======================================
   🔥 CARGAR USUARIO
====================================== */

async function cargarUsuario() {

  try {

    const usu_id =
      route.params.usu_id

    if (!usu_id) return

    const r = await axios.post(

      `${API}/ZYhL/detalleUsu`,

      {
        usu_id
      }

    )

    if (r.data.ok) {

      usuarioExiste.value = true

      const u =
        r.data.usuario

      codUsu.value =
        u.cod_usu || ''

      nombre.value =
        (u.nombres_apellidos || '')
          .replace(/[^a-zA-Z0-9_\-\s]/g, '')

      celular.value =
        (u.celular || '')
          .replace(/\D/g, '')
          .slice(0, 15)

      // 🔥 DEFAULT
      tipo.value = 'CLIENTE'

    } else {

      usuarioExiste.value = false

      snackbarRef.value?.open(
        'Usuario no encontrado'
      )

    }

  } catch (e) {

    console.error(e)
    usuarioExiste.value = false
    snackbarRef.value?.open(
      'Error cargando usuario'
    )

  }

}

/* ======================================
   🔥 INIT
====================================== */

onMounted(() => {

  cargarUsuario()

})

/* ======================================
   🔥 LOGIN DEMO
====================================== */
/* ======================================
   🔥 LOGIN DEMO
====================================== */

async function login() {

  try {

    /* ======================================
      🔥 VALIDAR CELULAR
    ====================================== */

    if (!celular.value) {

      snackbarRef.value?.open(
        'Debe ingresar celular'
      )

      return

    }

    loading.value = true

    showLoader.value = true

    /* ======================================
      🔥 FIRMA
    ====================================== */

    const seguridad =
      firma()

    /* ======================================
       🔥 PAYLOAD
    ====================================== */

    const payload = {

      usu_id:
        route.params.usu_id,

      xin:
        seguridad.xin,

      yuan:
        seguridad.yuan,

      sobrenombre:
        sobrenombre.value,

      nombres_apellidos:
        nombre.value,

      celular:
        celular.value

    }

    /* ======================================
       🔥 REQUEST DIRECTO
    ====================================== */

    const r = await axios.post(

      `${API}/EUwe/registroBasico`,

      payload

    )

    /* ======================================
       🔥 ERROR API
    ====================================== */

    if (!r.data?.ok) {

      toastRef.value?.show({

        text:
          r.data?.msg
          || 'Error registrando usuario',

        type:
          'error'

      })

      return

    }

    /* ======================================
       🔥 LOGIN REAL
    ====================================== */

    const loginRes = await axios.post(

      `${API}/coral/loginById`,

      {
        usu_id:
          route.params.usu_id
      }

    )

    /* ======================================
       🔥 LOGIN OK
    ====================================== */

    if (

      loginRes.data.status === 'ok'

    ) {

      // 🔥 SESION
      setLoginData(
        loginRes.data
      )

      const user =
        loginRes.data.data

      // 🔥 ENV
      const MERCADO_ID = Number(
        import.meta.env.VITE_PUBLIC_MERCADO_ID || 0
      )

      const NEG_ID = Number(
        import.meta.env.VITE_PUBLIC_NEG_ID || 0
      )

      showLoader.value = false

      toastRef.value?.show({

        text:
          'Usuario registrado correctamente',

        type:
          'success'

      })

      /* ======================================
         🔥 REDIRECT
      ====================================== */

      setTimeout(() => {

        // 🔥 CLIENTE
        if (

          Number(
            user.tipoxusu_id
          ) === 1

        ) {

          // 🔥 NEGOCIO DIRECTO
          if (

            MERCADO_ID === 0
            &&
            NEG_ID > 0

          ) {

            router.replace(
              `/principal`
            )

          } else {

            router.replace(
              '/principal'
            )

          }

        }

        // 🔥 ADMIN / NEGOCIANTE
        else {

          router.replace(
            '/principal'
          )

        }

      }, 1200)

    }

    /* ======================================
       🔥 LOGIN ERROR
    ====================================== */

    else {

      showLoader.value = false

      toastRef.value?.show({

        text:
          loginRes.data.msg
          ||
          'Error iniciando sesión',

        type:
          'error'

      })

    }

  } catch (e) {

    console.error(
      'ERROR LOGIN >>>',
      e
    )

    showLoader.value = false

    toastRef.value?.show({

      text:

        e?.response?.data?.msg

        ||

        'Error registrando usuario',

      type:
        'error'

    })

  } finally {

    loading.value = false

    showLoader.value = false

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

  margin-bottom: 30px;

}

.logo-img {
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.25));
  animation:
    float 5s ease-in-out infinite;
}

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

  background:
    linear-gradient(180deg,
      #EA6223 0%,
      #ffffff 100%);

  border-radius: 30px;

  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.2);

  padding:
    60px 30px 35px 30px;

  position: relative;

  backdrop-filter: blur(20px);

}

/* LABEL */
.label-title {

  display: block;

  font-size: 13px;

  font-weight: 600;

  color: #a13f15;

  margin-bottom: 6px;

}

/* INPUT */
.input-group {

  margin-bottom: 20px;

}

.input-style {

  width: 100%;

  padding: 14px 8px;

  background:
    rgba(255, 255, 255, 0.65);

  border: none;

  border-bottom:
    2px solid #EA6223;

  font-size: 15px;

  border-radius: 12px 12px 0 0;

  outline: none;

  transition: 0.3s;

  backdrop-filter: blur(10px);

}

.input-style:focus {

  border-bottom:
    2px solid #c44e16;

  background:
    rgba(255, 255, 255, 0.9);

}

.readonly-input {

  color: #666;

  font-weight: 700;

}

/* TIPO */
.tipo-box {

  margin-top: 25px;

}

.tipo-grid {

  display: grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap: 12px;

  margin-top: 10px;

}

.tipo-card {

  background:
    rgba(255, 255, 255, 0.7);

  border:
    2px solid transparent;

  border-radius: 18px;

  padding: 18px 10px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 10px;

  cursor: pointer;

  transition: 0.3s;

  font-weight: 600;

  color: #666;

  backdrop-filter: blur(10px);

}

.tipo-card i {

  font-size: 22px;

}

.tipo-card.active {

  border-color: #EA6223;

  background:
    linear-gradient(135deg,
      #EA6223,
      #ff8a50);

  color: white;

  box-shadow:
    0 10px 25px rgba(234, 98, 35, 0.35);

  transform:
    translateY(-2px);

}

/* BOTON */
.btn-login {

  width: 100%;

  padding: 15px;

  border-radius: 999px;

  background:
    linear-gradient(90deg,
      #EA6223,
      #c44e16);

  color: white;

  font-weight: 700;

  font-size: 16px;

  box-shadow:
    0 8px 20px rgba(234, 98, 35, 0.4);

  transition: 0.3s;

  margin-top: 30px;

}

.btn-login:hover {

  transform: translateY(-2px);

  box-shadow:
    0 12px 25px rgba(234, 98, 35, 0.5);

}

/* GLOW */
.orange-glow {

  background-image:
    radial-gradient(140% 140% at 50% 0%,
      rgba(255, 255, 255, 0.85) 25%,
      rgba(234, 98, 35, 0.55) 70%,
      rgba(234, 98, 35, 0.75) 100%);

  background-size: 100% 100%;

}
</style>