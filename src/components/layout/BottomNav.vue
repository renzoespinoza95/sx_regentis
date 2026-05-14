<template>
  <div v-show="!hideBottomNav" class="bottom-nav fixed bottom-0 left-0 w-full h-20
           flex items-center
           bg-white
           shadow-[0_-5px_20px_rgba(0,0,0,0.08)]
           rounded-t-3xl
           z-50">

    <!-- INICIO -->
    <button class="flex-1 h-full flex flex-col items-center justify-center relative" @click="goInicio">
      <i class="fa fa-home text-xl" :class="isActiveInicio() ? 'text-orange-500' : 'text-gray-800'"></i>

      <span class="text-xs mt-1" :class="isActiveInicio() ? 'text-orange-500 font-medium' : 'text-gray-800'">
        Inicio
      </span>
    </button>

    <!-- CHATS -->
    <button class="flex-1 h-full flex flex-col items-center justify-center relative" @click="go('/Wvn1_mis_mensajes')">

      <i class="fa fa-list-alt text-xl" :class="isActive('/chat') ? 'text-orange-500' : 'text-gray-800'"></i>

      <!-- 🔥 BADGE MENSAJES -->
      <span v-if="cantMensajes > 0" class="absolute top-3 right-8
         bg-red-500 text-white text-xs
         w-5 h-5 rounded-full
         flex items-center justify-center">
        {{ cantMensajes }}
      </span>

      <span class="text-xs mt-1" :class="isActive('/mis-modelos') ? 'text-orange-500 font-medium' : 'text-gray-800'">
        Chats
      </span>

    </button>

    <!-- PEDIDOS -->
    <button class="flex-1 h-full flex flex-col items-center justify-center relative" @click="go('/mod_pedidos')">

      <i class="fa fa-shopping-basket text-xl"
        :class="isActive('/mod_pedidos') ? 'text-orange-500' : 'text-gray-800'"></i>

      <!-- 🔥 BADGE PEDIDOS -->
      <span v-if="cantPedidos > 0" class="absolute top-3 right-8
         bg-red-500 text-white text-xs
         w-5 h-5 rounded-full
         flex items-center justify-center">
        {{ cantPedidos }}
      </span>

      <span class="text-xs mt-1" :class="isActive('/mod_pedidos') ? 'text-orange-500 font-medium' : 'text-gray-800'">
        Pedidos
      </span>

    </button>

    <!-- UBICACIONES -->
    <button class="flex-1 h-full flex flex-col items-center justify-center" @click="go('/PCJj_mapa_ubicacion')">

      <i class="fa fa-map-marker text-xl"
        :class="isActive('/PCJj_mapa_ubicacion') ? 'text-orange-500' : 'text-gray-800'"></i>

      <span class="text-xs mt-1"
        :class="isActive('/PCJj_mapa_ubicacion') ? 'text-orange-500 font-medium' : 'text-gray-800'">
        Ubicaciones
      </span>

    </button>

  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { useUsuario } from '../../services/usuarioService.js'
import { bus } from '../../services/eventBus.js'
import { useTrackingQueue } from '../../services/useTrackingQueue.js'


const API = import.meta.env.VITE_PUBLIC_URL_BASE
const POLLING = Number(import.meta.env.VITE_PUBLIC_RQ_POLLING || 1)

const mercadoId = import.meta.env.VITE_PUBLIC_MERCADO_ID
const negId = import.meta.env.VITE_PUBLIC_NEG_ID

const router = useRouter()
const route = useRoute()
const hideBottomNav = ref(false)

const {

  getTracking,
  clearTracking

} = useTrackingQueue()

const currentPath = computed(() => route?.path || '')

// 👤 usuario
const { getUsuId } = useUsuario()
const usu_id = getUsuId()

// 🔴 badges
const cantMensajes = ref(0)
const cantPedidos = ref(0)

// ⏱️ interval
let interval = null

// 🔥 función principal
async function cargarCantidadMensajes() {

  if (!usu_id) return

  try {

    const res = await axios.post(`${API}/reg/tk_cant_msg`, {

      usu_id,

      tracking: getTracking()

    })

    console.log('📨 tk_cant_msg:', res.data)

    // 🔥 badge chats
    cantMensajes.value = res.data.mensajes_nuevos || 0

    // 🔥 badge pedidos
    cantPedidos.value = res.data.carritos_enviados || 0

    // 🔥 guardar cache
    localStorage.setItem('regentis_chats_cache', JSON.stringify({
      ts: Date.now(),
      data: res.data.data || []
    }))

    // 🔥 eventos
    bus.emit('chat:update', res.data.data || [])

    bus.emit('header:updateCounts', {
      mensajes: res.data.mensajes_nuevos || 0,
      carrito: res.data.carrito_count || 0,
      favoritos: res.data.favoritos_count || 0,
      pedidos: res.data.carritos_enviados || 0
    })

    if (res.data.estado === 'ok') {

      clearTracking()

    }

  } catch (e) {

    console.error('❌ error badge:', e)

  }

}

// 🚀 iniciar
onMounted(() => {

  cargarCantidadMensajes()

  // 🔁 polling
  interval = setInterval(() => {
    cargarCantidadMensajes()
  }, POLLING * 60 * 1000)

  /* ======================================
   🔥 TOGGLE GLOBAL
====================================== */

  bus.on(

    'bottomnav:toggle',

    (estado) => {

      hideBottomNav.value =
        !!estado

    }

  )

})

// 🧹 limpiar
onUnmounted(() => {
  if (interval) clearInterval(interval)
})

// 🔀 navegación
function go(path) {
  router.push(path)
}

function isActive(path) {
  return currentPath.value === path
}

function goInicio() {

  if (String(mercadoId) === '0') {
    router.push(`/CV2K_negocio/${negId}`)
  } else {
    router.push('/principal')
  }

}

function isActiveInicio() {

  if (String(mercadoId) === '0') {
    return currentPath.value.startsWith('/CV2K_negocio')
  }

  return currentPath.value === '/principal'
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

.bottom-nav i {
  color: white;
}

.bottom-nav span {
  color: white;
}

.bottom-nav button:hover i,
.bottom-nav button.active i {
  color: #FD7635;
}
</style>