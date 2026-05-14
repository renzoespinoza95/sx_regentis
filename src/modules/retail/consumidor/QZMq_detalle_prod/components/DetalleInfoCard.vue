<template>

  <div class="relative -mt-16 mx-auto max-w-md bg-white rounded-3xl p-5 shadow-xl">

    <!-- 🔥 HEADER (TÍTULO + CORAZÓN) -->
    <div class="relative">

      <!-- ❤️ CORAZÓN (SIEMPRE FIJO ARRIBA DERECHA) -->
      <div class="absolute top-0 right-0 w-10 h-10 rounded-full flex items-center justify-center shadow cursor-pointer"
        :style="{ background: '#FD7635' }" @click.stop="onFavoritoClick($event)">
        <i class="fa fa-heart text-white text-sm"></i>
      </div>

      <!-- 📝 TÍTULO -->
      <h2 class="text-lg font-semibold text-gray-800 pr-12 leading-tight min-h-[44px]">
        {{ producto?.name || 'Cargando...' }}
      </h2>

    </div>

    <!-- ⭐ RATING -->
    <DetalleRating />

    <!-- 💰 PRECIO -->
    <div class="mt-3 text-gray-800 font-semibold text-lg">
      S/ {{ producto?.price || '--' }}
    </div>

    <!-- 🔢 CANTIDAD -->
    <DetalleCounter ref="counterRef" />

    <!-- 📄 DESCRIPCIÓN -->
    <p class="mt-4 text-gray-500 text-sm leading-relaxed">
      Producto seleccionado del catálogo
    </p>

    <!-- 🛒 BOTÓN -->
    <!-- 🟢 DISPONIBLE -->
    <button v-if="Number(producto?.stock) > 0"
      class="mt-6 w-full py-3 rounded-full text-white font-semibold shadow-lg active:scale-95 hover:scale-[1.01] transition"
      :style="btnStyle" @click="onPedirAhora($event)">
      Pedir ahora
    </button>

    <!-- 🔴 AGOTADO -->
    <div v-else class="mt-6 w-full py-3 rounded-full text-center font-bold tracking-wider
         bg-gradient-to-r from-red-50 via-red-100 to-red-50
         border border-red-200
         text-red-500
         shadow-inner">

      ✦ PRODUCTO AGOTADO ✦

    </div>

  </div>
  <GsapConfetti ref="confettiRef" />
</template>
<script setup>
import { ref, computed } from 'vue'
import { useMercado } from '../../../../../services/useMercado.js'
import { gsap } from 'gsap'
import GsapConfetti from '../../../../../components/layout/GsapConfetti.vue'
import { useUsuario } from '../../../../../services/usuarioService.js'
import DetalleRating from './DetalleRating.vue'
import DetalleCounter from './DetalleCounter.vue'


const confettiRef = ref(null)
const counterRef = ref(null)

const { usuario } = useUsuario()
const user = computed(() => usuario.value?.user || null)

const props = defineProps({
  producto: Object
})

const emit = defineEmits(['toast'])

const neg_id = computed(() => user.value?.neg_id || 0)

const { mercado } = useMercado()

const btnStyle = computed(() => ({
  background: mercado.value?.topnavbar_color || '#f97316'
}))

/* =========================
   🔥 EFECTO VOLAR AL CORAZÓN
========================= */

function flyToHeart(e) {

  const card = e.target.closest('.bg-white')
  const heart = document.getElementById('icon-heart-header')

  if (!card || !heart) {
    emit('toast', {
      text: 'No se pudo animar ❌',
      type: 'error'
    })
    return
  }

  const clone = card.cloneNode(true)

  const rect = card.getBoundingClientRect()
  const heartRect = heart.getBoundingClientRect()

  Object.assign(clone.style, {
    position: 'fixed',
    top: rect.top + 'px',
    left: rect.left + 'px',
    width: rect.width + 'px',
    zIndex: 9999,
    pointerEvents: 'none'
  })

  document.body.appendChild(clone)

  gsap.to(clone, {
    x: heartRect.left - rect.left,
    y: heartRect.top - rect.top,
    scale: 0.2,
    opacity: 0.5,
    duration: 0.7,
    ease: "power2.inOut",
    onComplete: () => clone.remove()
  })
}

/* =========================
   🔥 FAVORITO
========================= */

async function onFavoritoClick(e) {

  flyToHeart(e)

  const usu_id = user.value?.usu_id

  if (!usu_id) {
    emit('toast', {
      text: 'Debes iniciar sesión ❌',
      type: 'error'
    })
    return
  }

  try {

    const res = await fetch(
      `${import.meta.env.VITE_PUBLIC_URL_BASE}/DzCy/agregarFavorito`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usu_id: usu_id,
          product_id: props.producto.product_id
        })
      }
    )

    const data = await res.json()

    if (data.status === 'ok') {

      emit('toast', {
        text: data.msg || 'Agregado a favoritos ❤️',
        type: 'success'
      })

    } else {

      emit('toast', {
        text: data.msg || 'Error al guardar ❌',
        type: 'error'
      })

    }

  } catch (err) {

    emit('toast', {
      text: 'Error de conexión ❌',
      type: 'error'
    })

  }
}

/* =========================
   🔥 PEDIR AHORA (AQUÍ ESTÁ LO NUEVO)
========================= */
async function onPedirAhora(e) {

  flyToHeart(e)

  const usu_id = user.value?.usu_id
  const negocio_id =
    props.producto?.neg_id

  if (!usu_id || !negocio_id) {
    emit('toast', {
      text: 'Datos de usuario incompletos ❌',
      type: 'error'
    })
    return
  }

  try {

    const res = await fetch(
      `${import.meta.env.VITE_PUBLIC_URL_BASE}/M0Jk/carritoCompras`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usu_id: usu_id,
          neg_id: negocio_id, // 🔥 AQUÍ EL FIX REAL
          product_id: props.producto.product_id,
          cantidad: counterRef.value?.qty || 1,
          fecha_entrega: null
        })
      }
    )

    const data = await res.json()

    if (data.status === 'ok') {

      emit('toast', {
        text: 'Agregado al carrito 🛒',
        type: 'success'
      })

      confettiRef.value?.show()

    } else {

      emit('toast', {
        text: data.msg || 'Error al agregar ❌',
        type: 'error'
      })

    }

  } catch (err) {

    emit('toast', {
      text: 'Error de conexión ❌',
      type: 'error'
    })

  }
}

</script>
