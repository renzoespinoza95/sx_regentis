<template>

    <div class="min-h-screen pt-20" :style="fondoStyle">

        <NegpresHeader />

        <div class="content-container">

            <SearchBar />

            <div class="flex mt-4">

                <CatSidebar :categorias="categorias" :active="activeIndex" @change="setCategoria" />

                <ProductGrid :productos="productosFiltrados" :neg_id="neg_id" @toast="showToast"
                    @confetti="showConfetti" />

                <GsapToast ref="toastRef" />
                <GsapConfetti ref="confettiRef" />

            </div>

        </div>



    </div>
    <GsapToast ref="toastRef" />
</template>

<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useTienda } from '../../../../services/useTienda.js'

import NegpresHeader from '../../../../components/layout/NegpresHeaderBack.vue'
import CatSidebar from './components/CatSidebar.vue'
import ProductGrid from './components/ProductGrid.vue'
import SearchBar from './components/SearchBar.vue'

import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'
import GsapToast from '../../../../components/layout/GsapToast.vue'
import GsapConfetti from '../../../../components/layout/GsapConfetti.vue'


/* =========================
   🔥 REFS
========================= */

const toastRef = ref(null)
const confettiRef = ref(null)


/* =========================
   🔥 ROUTE
========================= */

const route = useRoute()

/* =========================
   🔥 DATA TIENDA
========================= */

const { data } = useTienda()

// 🔥 DEBUG REACTIVO (importante)
watchEffect(() => {
    console.log("data→", data.value)
})

/* =========================
   🔥 NEG_ID CORRECTO (BLINDADO)
========================= */

const neg_id = computed(() => {
    return data.value?.negocio?.neg_id
        ? Number(data.value.negocio.neg_id)
        : 0
})

/* =========================
   🔥 TOAST / CONFETTI
========================= */

function showToast(payload) {
    toastRef.value?.show(payload)
}

function showConfetti() {
    confettiRef.value?.show()
}

/* =========================
   🔥 CATEGORÍAS
========================= */

const categorias = computed(() => {
    return data.value?.categorias || []
})

/* =========================
   🔥 CATEGORÍA ACTIVA
========================= */

const activeCatId = ref(Number(route.params.category_id) || 0)

// 🔥 cuando cambia URL
watch(() => route.params.category_id, (val) => {
    activeCatId.value = Number(val)
})

/* =========================
   🔥 ÍNDICE ACTIVO
========================= */

const activeIndex = computed(() => {
    return categorias.value.findIndex(c => c.category_id == activeCatId.value)
})

/* =========================
   🔥 PRODUCTOS FILTRADOS
========================= */

const productosFiltrados = computed(() => {

    const cat = categorias.value.find(c => c.category_id == activeCatId.value)

    if (!cat) return []

    return cat.productos || []
})

/* =========================
   🔥 CAMBIAR CATEGORÍA
========================= */

function setCategoria(index) {
    const cat = categorias.value[index]
    if (!cat) return

    activeCatId.value = cat.category_id
}

/* =========================
   🔥 MERCADO (FONDO)
========================= */

const { mercado } = useMercado()

const fondoStyle = computed(() => {
    if (!mercado.value?.patron_fondo) return {}
    return cssToObject(mercado.value.patron_fondo)
})
</script>