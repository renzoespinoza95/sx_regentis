<template>

  <div ref="raiz" class="ns-wrap">

    <!-- Caja de búsqueda -->
    <form class="ns-box" role="search" @submit.prevent="buscar">

      <button type="submit" class="ns-btn" aria-label="Buscar">
        <i class="fa fa-search"></i>
      </button>

      <input ref="inputRef" v-model="texto" type="text" class="ns-input" placeholder="Buscar productos..."
        autocomplete="off" enterkeyhint="search" role="combobox" aria-autocomplete="list" :aria-expanded="mostrarPanel"
        @focus="abierto = true" @keydown.down.prevent="mover(1)" @keydown.up.prevent="mover(-1)"
        @keydown.esc="abierto = false" />

      <button v-if="texto" type="button" class="ns-clear" aria-label="Limpiar búsqueda" @click="limpiar(true)">
        <i class="fa fa-times"></i>
      </button>

    </form>

    <!-- Sugerencias -->
    <ul v-if="mostrarPanel" ref="panelRef" class="ns-panel" role="listbox">

      <li v-for="(p, i) in resultados" :key="p.product_id" role="option" :aria-selected="i === activo" class="ns-item"
        :class="{ 'is-active': i === activo }" @mouseenter="activo = i" @click="irProducto(p)">

        <img class="ns-img" :src="p.img" alt="" loading="lazy">

        <div class="ns-info">
          <span class="ns-name">{{ p.name }}</span>
          <span v-if="p.categoria" class="ns-cat">{{ p.categoria }}</span>
        </div>

        <span class="ns-price">S/ {{ p.precio }}</span>

      </li>

      <li v-if="!resultados.length" class="ns-empty">
        No encontramos productos con “{{ consulta }}”.
      </li>

      <li v-else-if="total > resultados.length" class="ns-more">
        Mostrando {{ resultados.length }} de {{ total }}. Escribe más para afinar la búsqueda.
      </li>

    </ul>

  </div>

</template>

<script setup>

import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

/* =========================================
   PROPS
========================================= */

const props = defineProps({

  /* Categorías de la tienda (cada una trae sus productos) */
  categorias: {
    type: Array,
    default: () => []
  }

})

/* =========================================
   CONSTANTES
========================================= */

const MIN_CARACTERES = 2
const MAX_RESULTADOS = 8
const IMG_DEFAULT = 'https://barsi-img.b-cdn.net/recursos/6qz5.png'

/* =========================================
   ESTADO
========================================= */

const router = useRouter()

const raiz = ref(null)
const inputRef = ref(null)
const panelRef = ref(null)

const texto = ref('')
const consulta = ref('')
const abierto = ref(false)
const activo = ref(-1)

let timer = null

/* =========================================
   UTILIDADES
========================================= */

function normalizar(valor = '') {

  return String(valor)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

}

function imgDe(p) {

  return p.imagenes?.find(x => Number(x.orden) === 1)?.img
    || p.imagenes?.[0]?.img
    || IMG_DEFAULT

}

/* =========================================
   ÍNDICE DE PRODUCTOS (sin repetidos)
========================================= */

const indice = computed(() => {

  const mapa = new Map()

  props.categorias.forEach(cat => {

    (cat.productos || []).forEach(p => {

      if (mapa.has(p.product_id)) {
        return
      }

      mapa.set(p.product_id, {
        product_id: p.product_id,
        name: p.name || '',
        precio: Number(p.price || 0).toFixed(2),
        img: imgDe(p),
        categoria: cat.name || '',
        nombreNorm: normalizar(p.name),
        busqueda: normalizar(
          [p.name, p.description, p.cod_producto, p.marca_des, cat.name]
            .filter(Boolean)
            .join(' ')
        )
      })

    })

  })

  return [...mapa.values()]

})

/* =========================================
   RESULTADOS
========================================= */

const coincidencias = computed(() => {

  const q = normalizar(consulta.value)

  if (q.length < MIN_CARACTERES) {
    return []
  }

  const palabras = q.split(/\s+/).filter(Boolean)

  /* 0 = empieza igual · 1 = lo contiene en el nombre · 2 = otros campos */
  const puntaje = (item) => {

    if (item.nombreNorm.startsWith(q)) return 0
    if (item.nombreNorm.includes(q)) return 1

    return 2

  }

  return indice.value
    .filter(item => palabras.every(w => item.busqueda.includes(w)))
    .sort((a, b) =>
      puntaje(a) - puntaje(b)
      || a.nombreNorm.localeCompare(b.nombreNorm)
    )

})

const total = computed(() => coincidencias.value.length)

const resultados = computed(() => coincidencias.value.slice(0, MAX_RESULTADOS))

const mostrarPanel = computed(() =>
  abierto.value && consulta.value.length >= MIN_CARACTERES
)

/* =========================================
   ESCRITURA (con pequeña espera)
========================================= */

watch(texto, (valor) => {

  clearTimeout(timer)

  abierto.value = true

  timer = setTimeout(() => {
    consulta.value = valor.trim()
  }, 150)

})

watch(consulta, () => {
  activo.value = -1
})

/* =========================================
   ACCIONES
========================================= */

function buscar() {

  /* Con un elemento marcado, Enter lo abre */
  const elegido = resultados.value[activo.value]

  if (elegido) {
    irProducto(elegido)
    return
  }

  /* Sin elegir: aplica la búsqueda y muestra la lista */
  clearTimeout(timer)

  consulta.value = texto.value.trim()

  abierto.value = true

}

function limpiar(enfocar = false) {

  clearTimeout(timer)

  texto.value = ''
  consulta.value = ''
  activo.value = -1
  abierto.value = false

  if (enfocar) {
    inputRef.value?.focus()
  }

}

function irProducto(p) {

  limpiar()

  router.push(`/QZMq_detalle_prod/${p.product_id}`)

}

/* =========================================
   TECLADO
========================================= */

async function mover(direccion) {

  const n = resultados.value.length

  if (!n) {
    return
  }

  abierto.value = true

  activo.value = activo.value === -1
    ? (direccion > 0 ? 0 : n - 1)
    : (activo.value + direccion + n) % n

  await nextTick()

  panelRef.value
    ?.querySelector('.is-active')
    ?.scrollIntoView({ block: 'nearest' })

}

/* =========================================
   CERRAR AL TOCAR FUERA
========================================= */

function alTocarFuera(e) {

  if (raiz.value && !raiz.value.contains(e.target)) {
    abierto.value = false
  }

}

onMounted(() => {
  document.addEventListener('click', alTocarFuera)
})

onUnmounted(() => {

  document.removeEventListener('click', alTocarFuera)

  clearTimeout(timer)

})

</script>

<style scoped>
.ns-wrap {
  position: relative;
  z-index: 30;
  margin: 1rem 0 0.5rem;
}

/* ---------- Caja ---------- */

.ns-box {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.6rem 0.25rem 0.25rem;
  background: #fff;
  border: 2px solid var(--primary, #fd7635);
  border-radius: 50rem;
  box-shadow: var(--shadow, 0 8px 24px rgba(0, 0, 0, 0.12));
}

.ns-btn {
  display: grid;
  flex: 0 0 40px;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  background: var(--primary, #fd7635);
  color: var(--on-primary, #fff);
  cursor: pointer;
  transition: filter 0.2s;
}

.ns-btn:hover {
  filter: brightness(1.1);
}

.ns-input {
  flex: 1;
  min-width: 0;
  padding: 0.4rem 0.3rem;
  border: 0;
  outline: 0;
  background: transparent;
  font: inherit;
  font-size: 0.95rem;
  color: var(--text, #1f2937);
}

.ns-clear {
  display: grid;
  flex: 0 0 28px;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--ink-soft, #6b7280);
  cursor: pointer;
  transition: 0.2s;
}

.ns-clear:hover {
  background: var(--soft, #f3f4f6);
  color: var(--primary, #fd7635);
}

/* ---------- Panel de sugerencias ---------- */

.ns-panel {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  left: 0;
  max-height: min(60vh, 420px);
  margin: 0;
  padding: 0.4rem;
  overflow-y: auto;
  list-style: none;
  background: #fff;
  border: 2px solid var(--primary, #fd7635);
  border-radius: 20px;
  box-shadow: var(--shadow, 0 12px 30px rgba(0, 0, 0, 0.18));
}

.ns-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.6rem;
  border-radius: 14px;
  cursor: pointer;
}

.ns-item.is-active {
  background: var(--soft, #fff4ee);
}

.ns-img {
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  object-fit: cover;
  border: 2px solid var(--line, #eee);
  border-radius: 50%;
  background: var(--soft, #f3f4f6);
}

.ns-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.ns-name {
  overflow: hidden;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text, #1f2937);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ns-cat {
  font-size: 0.72rem;
  color: var(--ink-soft, #6b7280);
}

.ns-price {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--primary, #fd7635);
  white-space: nowrap;
}

.ns-empty,
.ns-more {
  padding: 0.8rem 0.6rem;
  font-size: 0.85rem;
  text-align: center;
  color: var(--ink-soft, #6b7280);
}
</style>