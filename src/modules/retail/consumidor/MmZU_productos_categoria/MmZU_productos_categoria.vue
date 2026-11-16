<template>

    <div class="tn-page min-h-screen pt-[66px]" :class="temaActivo ? ['tienda-theme', 'tn-fondo-patron'] : []"
        :style="fondoStyle">

        <NegpresHeader />

        <div class="content-container p-4">

            <SearchBar />

            <div class="flex mt-4 gap-4">

                <!-- Categorías (lateral) -->
                <CatSidebar :categorias="categorias" :active="activeIndex" :tematizado="temaActivo"
                    @change="setCategoria" />

                <div class="flex-1 flex flex-col gap-2 min-w-0">

                    <!-- Subcategorías (encima de los productos) -->
                    <SubCatCarousel :subcategorias="subcategoriasList" :active="activeSubCatId" :tematizado="temaActivo"
                        @change="setSubCategoria" />

                    <!-- Productos (sin cambios de diseño) -->
                    <ProductGrid class="mz-productos" :productos="productosFiltrados" :neg_id="neg_id"
                        @toast="showToast" @confetti="showConfetti" />

                </div>

            </div>

        </div>

        <GsapToast ref="toastRef" />
        <GsapConfetti ref="confettiRef" />

    </div>

</template>

<script setup>

import { ref, computed, watch, watchEffect, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTienda } from '../../../../services/useTienda.js'

import NegpresHeader from '../../../../components/layout/NegpresHeaderBack.vue'
import CatSidebar from './components/CatSidebar.vue'
import SubCatCarousel from './components/SubCatCarousel.vue'
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

watchEffect(() => {
    console.log('data→', data.value)
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

watch(() => route.params.category_id, (val) => {
    activeCatId.value = Number(val)
    activeSubCatId.value = 'recomendado' // Resetear a recomendado al cambiar de categoría
})

const activeIndex = computed(() => {
    return categorias.value.findIndex(c => c.category_id == activeCatId.value)
})

const categoriaActual = computed(() => {
    return categorias.value.find(c => c.category_id == activeCatId.value) || null
})


/* =========================
   🔥 SUBCATEGORÍAS Y FILTRADO
========================= */

const activeSubCatId = ref('recomendado')

const subcategoriasList = computed(() => {

    const subs = categoriaActual.value?.subcategorias || []

    if (subs.length > 0) {
        return [
            { subcategoria_id: 'recomendado', nombre: 'Recomendado', img: categoriaActual.value?.img || '' },
            ...subs
        ]
    }

    return [
        { subcategoria_id: 'todos', nombre: 'Todos', img: categoriaActual.value?.img || '' }
    ]

})

const productosFiltrados = computed(() => {

    const cat = categoriaActual.value

    if (!cat) return []

    const productos = cat.productos || []

    if (activeSubCatId.value === 'recomendado') {

        // Muestra productos sin subcategoría asignada (subcategoria_id == 0 o null)
        const conSub = productos.filter(p => Number(p.subcategoria_id) > 0)

        if (conSub.length === 0) {
            return productos // Si ningún producto tiene subcategoría, muestra todos por defecto
        }

        return productos.filter(p => !p.subcategoria_id || Number(p.subcategoria_id) === 0)

    }

    if (activeSubCatId.value === 'todos') {
        return productos
    }

    // Filtrar estrictamente por el ID de la subcategoría seleccionada
    return productos.filter(p => Number(p.subcategoria_id) === Number(activeSubCatId.value))

})

function setSubCategoria(subId) {
    activeSubCatId.value = subId
}


/* =========================
   🔥 CAMBIAR CATEGORÍA
========================= */

function setCategoria(index) {

    const cat = categorias.value[index]

    if (!cat) return

    activeCatId.value = cat.category_id
    activeSubCatId.value = 'recomendado'

}


/* =========================
   🎨 TEMA (base_css + estilo_css)
========================= */

const STYLE_BASE_ID = 'tn-theme-base'
const STYLE_ESTILO_ID = 'tn-theme-estilo'

const temaActivo =
    computed(() => !!data.value?.tema?.base_css)

function setStyle(id, css) {

    let el = document.getElementById(id)

    if (!el) {
        el = document.createElement('style')
        el.id = id
        document.head.appendChild(el)
    }

    if (el.textContent !== css) {
        el.textContent = css
    }

}

watch(
    () => [
        data.value?.tema?.base_css,
        data.value?.tema?.estilo_css
    ],
    ([base, estilo]) => {

        if (!base) return

        setStyle(STYLE_BASE_ID, base)
        setStyle(STYLE_ESTILO_ID, estilo || '')

    },
    { immediate: true }
)

onUnmounted(() => {
    document.getElementById(STYLE_BASE_ID)?.remove()
    document.getElementById(STYLE_ESTILO_ID)?.remove()
})


/* =========================
   🔥 MERCADO (FONDO LEGACY)
========================= */

const { mercado } = useMercado()

const fondoStyle = computed(() => {

    // Con tema, el fondo lo pone la clase tn-fondo-patron
    if (temaActivo.value) {
        return {}
    }

    const tema_id = Number(
        data.value?.tema?.tema_id || 0
    )

    if (
        tema_id > 0
        &&
        data.value?.tema?.fondo
    ) {
        return cssToObject(
            data.value.tema.fondo
        )
    }

    if (
        mercado.value?.patron_fondo
    ) {
        return cssToObject(
            mercado.value.patron_fondo
        )
    }

    return {}

})

</script>

<style scoped>
/*
 * El tema cambia la fuente y el color base de la página.
 * Las tarjetas de producto conservan su tipografía y colores originales.
 */
.mz-productos {
    font-family: var(--font-sans, "Montserrat", ui-sans-serif, system-ui, sans-serif);
    line-height: 1.5;
    color: initial;
}
</style>