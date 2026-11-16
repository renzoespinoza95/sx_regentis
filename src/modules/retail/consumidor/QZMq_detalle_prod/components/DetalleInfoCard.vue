<template>

  <div class="relative -mt-16 mx-auto max-w-md bg-white rounded-3xl p-5 shadow-xl">

    <div class="relative">

      <div class="absolute top-0 right-0 w-10 h-10 rounded-full flex items-center justify-center shadow cursor-pointer"
        :style="{ background: '#FD7635' }" @click.stop="onFavoritoClick($event)">
        <i class="fa fa-heart text-white text-sm"></i>
      </div>

      <h2 class="text-lg font-semibold text-gray-800 pr-12 leading-tight min-h-[44px]">
        {{ producto?.name || 'Cargando...' }}
      </h2>

      <div v-if="categoriasDelProducto.length" class="flex flex-wrap gap-2 mt-1">
        <button v-for="cat in categoriasDelProducto" :key="cat.category_id" @click="irACategoria(cat)"
          class="text-white text-xs px-2.5 py-0.5 rounded-full font-medium shadow-sm transition active:scale-95 select-none"
          style="background: #f97316;">
          📁 <span class="capitalize">{{ cat.name }}</span>
        </button>
      </div>

    </div>

    <DetalleRating />

    <div class="mt-3 text-gray-800 font-semibold text-lg">
      S/ {{ producto?.price || '--' }}
    </div>

    <DetalleCounter ref="counterRef" />

    <div class="
        mt-4
        text-center
        text-gray-700
        font-semibold
    ">

      S/

      {{
        precioActual.toFixed(2)
      }}

      ×

      {{

        counterRef?.qty || 1

      }}

      =

      <span class="text-green-600">

        S/{{ total }}

      </span>

    </div>

    <div v-if="
      producto?.precio_volumen?.length
    " class="
        mt-4
        text-left
        bg-gray-50
        rounded-xl
        p-3
        text-xs
    ">

      <div class="
            font-semibold
            mb-2
        ">

        💰 Precios por volumen

      </div>

      <div v-for="r in producto.precio_volumen" :key="r.cantidad_desde" class="
            flex
            justify-between
            py-1
        ">

        <span>

          {{ r.nombre_rango }}

          <span class="text-gray-500">

            (

            {{ r.cantidad_desde }}

            und.

            )

          </span>

        </span>

        <span class="
                font-semibold
                text-green-600
            ">

          S/

          {{

            Number(
              r.precio_unitario_calculado
            ).toFixed(2)

          }}

        </span>

      </div>

    </div>

    <div class="mt-4">

      <div class="
    text-xs
    font-bold
    text-gray-400
    uppercase
    tracking-wide
    mb-1
  ">
        Descripción
      </div>

      <p class="
    text-gray-500
    text-sm
    leading-relaxed
  ">
        {{
          producto?.description
          ||
          'Producto seleccionado del catálogo'
        }}
      </p>

    </div>

    <div v-if="variantesOpciones.length > 0" class="
mt-4
rounded-2xl
overflow-hidden
border
border-yellow-200
bg-gradient-to-br
from-yellow-50
via-white
to-orange-50
shadow-sm
">

      <div class="
px-4
py-3
bg-gradient-to-r
from-[#FD7635]
to-[#ffb347]
text-white
">

        <div class="text-sm font-black tracking-wide">
          ✨ Opciones disponibles
        </div>

        <div class="text-xs opacity-90">
          Selecciona:
          {{
            variantesData.atributo || 'Variante'
          }}
        </div>

      </div>

      <div class="p-3 space-y-2">

        <button v-for="(op, index) in variantesOpciones" :key="index" type="button" class="
    relative
    w-full
    flex
    items-center
    rounded-xl
    bg-white
    border
    px-3
    py-3
    text-left
    active:scale-[0.98]
    transition
    overflow-hidden
  " :class="varianteSeleccionada === op
    ? 'border-green-400 ring-2 ring-green-200'
    : 'border-orange-100'
    " @click="seleccionarVariante(op)">

          <div v-if="varianteSeleccionada === op" class="pl-2 pr-3 flex items-center justify-center shrink-0">
            <i class="fa fa-check-circle text-green-500 text-2xl drop-shadow-sm"></i>
          </div>

          <div class="font-bold text-gray-800 text-sm flex-1">
            {{ op.valor }}
          </div>

        </button>

      </div>

    </div>

    <button v-if="Number(producto?.stock) > 0"
      class="mt-6 w-full py-3 rounded-full text-white font-semibold shadow-lg active:scale-95 hover:scale-[1.01] transition"
      :style="btnStyle" @click="onPedirAhora($event)">
      Pedir ahora
    </button>

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
import { useTienda } from '../../../../../services/useTienda.js' // 🔥 NUEVO: Importar estado de tienda
import DetalleRating from './DetalleRating.vue'
import DetalleCounter from './DetalleCounter.vue'
import { useAnonimo } from '../../../../../services/anonimoService.js'
import { useRouter } from 'vue-router'

const confettiRef = ref(null)
const counterRef = ref(null)

const router = useRouter()
const { data: tiendaData } = useTienda() // 🔥 NUEVO: Consumir la data reactiva global de la tienda 

const { usuario } = useUsuario()
const user = computed(() => usuario.value?.user || null)

const varianteSeleccionada = ref(null)

const props = defineProps({
  producto: Object
})

// 🔥 NUEVO: Propiedad computada que busca dinámicamente las categorías cruzando los datos 
const categoriasDelProducto = computed(() => {
  if (!props.producto?.product_id || !tiendaData.value?.categorias) return []

  return tiendaData.value.categorias.filter(cat => {
    return Array.isArray(cat.productos) && cat.productos.some(p => Number(p.product_id) === Number(props.producto.product_id))
  })
})

const variantesData = computed(() => {
  if (
    props.producto?.variantes &&
    typeof props.producto.variantes === 'object'
  ) {
    return props.producto.variantes
  }

  if (props.producto?.variantes_json) {
    try {
      return JSON.parse(props.producto.variantes_json)
    } catch (e) {
      return { atributo: '', opciones: [] }
    }
  }

  return { atributo: '', opciones: [] }
})

const variantesOpciones = computed(() => {
  return Array.isArray(variantesData.value?.opciones)
    ? variantesData.value.opciones
    : []
})

const emit = defineEmits(['toast', 'update:variante'])
const neg_id = computed(() => user.value?.neg_id || 0)
const { mercado } = useMercado()

const btnStyle = computed(() => ({
  background: mercado.value?.topnavbar_color || '#f97316'
}))

const { addProducto } = useAnonimo()

function flyToHeart(e) {
  const card = e.target.closest('.bg-white')
  const heart = document.getElementById('icon-heart-header')

  if (!card || !heart) {
    emit('toast', { text: 'No se pudo animar ❌', type: 'error' })
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

function flyToTarget(e, targetId) {
  const card = e.target.closest('.bg-white')
  const target = document.getElementById(targetId)

  if (!card || !target) return

  const clone = card.cloneNode(true)
  const rect = card.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()

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
    x: targetRect.left - rect.left,
    y: targetRect.top - rect.top,
    scale: 0.2,
    opacity: 0.5,
    duration: 0.7,
    ease: 'power2.inOut',
    onComplete: () => clone.remove()
  })
}

const precioActual = computed(() => {
  const cantidad = Number(counterRef.value?.qty || 1)
  const lista = props.producto?.precio_volumen || []
  let precio = Number(props.producto?.price || 0)

  lista.forEach(r => {
    if (cantidad >= Number(r.cantidad_desde)) {
      precio = Number(r.precio_unitario_calculado)
    }
  })

  return precio
})

const total = computed(() => {
  const cantidad = Number(counterRef.value?.qty || 1)
  return (precioActual.value * cantidad).toFixed(2)
})

function irACategoria(cat) {
  // Te redirige a la ruta exacta solicitada pasando el ID o slug de la categoría 
  router.push(`/MmZU_productos_categoria/${cat.category_id}`)
}

async function onFavoritoClick(e) {
  flyToTarget(e, 'icon-heart-header')
  const usu_id = user.value?.usu_id

  if (!usu_id) {
    emit('toast', { text: 'Debes iniciar sesión ❌', type: 'error' })
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
      emit('toast', { text: data.msg || 'Agregado a favoritos ❤️', type: 'success' })
    } else {
      emit('toast', { text: data.msg || 'Error al guardar ❌', type: 'error' })
    }
  } catch (err) {
    emit('toast', { text: 'Error de conexión ❌', type: 'error' })
  }
}

function seleccionarVariante(op) {
  varianteSeleccionada.value = op
  emit('update:variante', op) // 🔥 Envía la variante seleccionada al componente padre
}

async function onPedirAhora(e) {
  if (variantesOpciones.value.length > 0 && !varianteSeleccionada.value) {
    emit('toast', { text: 'Debes seleccionar una opción disponible ❌', type: 'error' })
    return
  }

  const usu_id = user.value?.usu_id
  const negocio_id = props.producto?.neg_id

  /* =========================================
       🔥 USUARIO ANÓNIMO
  ========================================= */
  if (!usu_id) {
    addProducto({
      product_id: props.producto.product_id,
      nombre: props.producto.name,
      variante: varianteSeleccionada.value,
      precio: precioActual.value,
      cantidad: counterRef.value?.qty || 1,
      img: props.producto?.imagenes?.find(x => Number(x.orden) === 1)?.img ||
        props.producto?.imagenes?.[0]?.img || '',
      neg_id: negocio_id
    })

    flyToTarget(e, 'icon-carrito-header')
    emit('toast', { text: 'Agregado al carrito 🛒', type: 'success' })
    confettiRef.value?.show()
    return
  }

  /* =========================================
       🔥 VALIDACIÓN LOGUEADO
  ========================================= */
  if (!negocio_id) {
    emit('toast', { text: 'Negocio inválido ❌', type: 'error' })
    return
  }

  /* =========================================
       🔥 USUARIO LOGUEADO
  ========================================= */
  try {
    const res = await fetch(
      `${import.meta.env.VITE_PUBLIC_URL_BASE}/M0Jk/carritoCompras`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usu_id: usu_id,
          neg_id: negocio_id,
          product_id: props.producto.product_id,
          cantidad: counterRef.value?.qty || 1,
          fecha_entrega: null
        })
      }
    )

    const data = await res.json()

    if (data.status === 'ok') {
      flyToTarget(e, 'icon-carrito-header')
      emit('toast', { text: 'Agregado al carrito 🛒', type: 'success' })
      confettiRef.value?.show()
    } else {
      emit('toast', { text: data.msg || 'Error al agregar ❌', type: 'error' })
    }
  } catch (err) {
    emit('toast', { text: 'Error de conexión ❌', type: 'error' })
  }
}
</script>