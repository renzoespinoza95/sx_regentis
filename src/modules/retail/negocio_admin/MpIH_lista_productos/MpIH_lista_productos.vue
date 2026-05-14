<template>
    <div class="min-h-screen flex flex-col" :style="fondoStyle">

        <HeaderBar @openOptions="openDialog" />

        <div class="max-w-5xl w-full mx-auto px-4 pt-28 pb-24">

            <SearchBar @buscar="onBuscar" @limpiar="onLimpiar" />

            <CatCarousel :categorias="categorias" :active="activeCat" @select="onSelectCategoria" />

            <!-- 🟡 LOADING -->
            <div v-if="loading" class="flex justify-center mt-6">
                <i class="fa fa-spinner fa-spin text-2xl text-gray-400"></i>
            </div>

            <!-- 🔴 SIN RESULTADOS -->
            <div v-if="!loading && productos.length === 0"
                class="mt-10 flex flex-col items-center justify-center text-center">

                <div class="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center text-4xl">
                    😢
                </div>

                <div class="mt-4 text-xl font-bold text-gray-700">
                    Sin resultados
                </div>

                <div class="text-sm text-gray-500 mt-1 max-w-xs">
                    No encontramos productos con esa búsqueda.
                </div>

            </div>

            <!-- 🟢 LISTA -->
            <div v-if="!loading && productos.length" class="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <ProductoItem v-for="item in productos" :key="item.product_id" :item="item" />
            </div>

        </div>

        <BottomNav />
        <OptionsDialog ref="dialogRef" />

    </div>
</template>

<script setup>
import axios from 'axios'
import HeaderBar from './components/HeaderBar.vue'
import SearchBar from './components/SearchBar.vue'
import ProductoItem from './components/ProductoItem.vue'
import { useUsuario } from '../../../../services/usuarioService'
import { computed, onMounted, ref } from 'vue'
import {
    enc_barsi,
    des_barsi,
    firma
}
    from '../../../../services/security'
import CatCarousel from './components/CatCarousel.vue'
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'
import OptionsDialog
    from './components/OptionsDialog.vue'

let timeout = null

const productos = ref([])
const loading = ref(false)
const categorias = ref([])
const activeCat = ref(null)

// 🔥 MERCADO
const { mercado } = useMercado()

// 🔥 FONDO DINÁMICO
const fondoStyle = computed(() => {

    if (!mercado.value?.patron_fondo) {
        return {}
    }

    return cssToObject(mercado.value.patron_fondo)

})

const { getNegId, getUsuId } = useUsuario()

const dialogRef = ref(null)

function openDialog() {

    dialogRef.value?.open()

}

// 🔥 LISTAR
async function cargarProductos() {

    loading.value = true

    try {

        const seguridad = firma()

        const res = await axios.post(

            '/MpIH/product/listar',

            {

                neg_id: getNegId(),

                usu_id: getUsuId(),

                xin: seguridad.xin,

                yuan: seguridad.yuan

            }

        )

        if (res.data.status === 'ok') {

            productos.value = res.data.data

        }

    } catch (e) {

        console.error(e)

    } finally {

        loading.value = false

    }

}

async function cargarCategorias() {

    try {

        const res = await axios.get(`/MylW/listar_categorias/${getNegId()}`)

        if (res.data.status === 'ok') {

            categorias.value = res.data.data

            // 🔥 👉 AQUÍ VA (INICIALIZACIÓN)
            productos.value = categorias.value.flatMap(c => c.productos || [])

            activeCat.value = null

        }

    } catch (e) {
        console.error(e)
    }

}

function onSelectCategoria(cat) {

    // 🔥 TODOS
    if (!cat.category_id) {
        activeCat.value = null
        productos.value = categorias.value.flatMap(c => c.productos || [])
        return
    }

    // 🔥 FILTRADO
    activeCat.value = cat.category_id
    productos.value = cat.productos || []

}

// 🔥 BUSCAR
async function buscarProductos(texto) {
    loading.value = true

    try {
        const res = await axios.post('/MpIH/buscarProducto', {
            neg_id: getNegId(),
            usu_id: getUsuId(),
            texto
        })

        if (res.data.status === 'ok') {

            categorias.value = res.data.data

            // 🔥 TODOS los productos al inicio (seguro)
            productos.value = categorias.value.flatMap(c => c.productos || [])

            activeCat.value = null
        }

    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

// 🔥 INPUT
function onBuscar(texto) {

    clearTimeout(timeout)

    timeout = setTimeout(() => {

        if (texto.length >= 4) {
            buscarProductos(texto)
        } else {
            cargarProductos()
        }

    }, 400)
}

// 🔥 LIMPIAR
function onLimpiar() {
    cargarProductos()
}

onMounted(() => {
    cargarProductos()
    cargarCategorias()
})

</script>