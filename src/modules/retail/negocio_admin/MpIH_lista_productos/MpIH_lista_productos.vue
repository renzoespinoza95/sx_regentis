<template>
    <div class="min-h-screen flex flex-col" :style="fondoStyle">

        <HeaderBar @openOptions="openDialog" @nuevo="openNuevoProducto" />

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
                <ProductoItem v-for="item in productos" :key="item.product_id" :item="item" @click="openProducto" />
            </div>

        </div>

        <BottomNav />
        <OptionsDialog ref="dialogRef" @categoria-created="
            openNuevaCategoria
        " @mis-categorias="
            openMisCategorias
        " />

        <NuevaCategoriaDialog ref="nuevaCategoriaRef" @created="
            onCategoriaCreated
        " />

        <ProductoOpcionesDialog ref="productoDialogRef" @stock-updated="
            onStockUpdated

        " @visible-updated="
            onVisibleUpdated
        " @deleted="
            onProductoDeleted
        " @edit="
            onEditarProducto
        " @foto="
            onProductoFotos
        " @calculadora="
            openCalculadora
        " />

        <ProductoFotosDialog ref="productoFotosRef" @uploaded="
            onProductoImagenUploaded
        " />
        <CalculadoraPrecioDialog ref="calculadoraRef" v-if="true" />

        <GsapToast ref="toastRef" />
        <NuevoProductoDialog ref="nuevoProductoRef" @created="
            onProductoCreated
        " />
        <MisCategoriasDialog ref="misCategoriasRef" @deleted="
            onCategoriaDeleted
        " @edit="
            onEditarCategoria
        " />

    </div>
</template>

<script setup>
import { watch, computed, onMounted, ref } from 'vue'

import axios from 'axios'
import HeaderBar from './components/HeaderBar.vue'
import SearchBar from './components/SearchBar.vue'
import ProductoItem from './components/ProductoItem.vue'
import { useUsuario } from '../../../../services/usuarioService'

import {
    firma
}
    from '../../../../services/security'
import CatCarousel from './components/CatCarousel.vue'
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'
import OptionsDialog
    from './components/OptionsDialog.vue'
import ProductoOpcionesDialog
    from './components/ProductoOpcionesDialog.vue'
import NuevaCategoriaDialog
    from './components/NuevaCategoriaDialog.vue'

import GsapToast
    from '../../../../components/layout/GsapToast.vue'
import NuevoProductoDialog
    from './components/NuevoProductoDialog.vue'
import MisCategoriasDialog
    from './components/MisCategoriasDialog.vue'
import ProductoFotosDialog
    from './components/ProductoFotosDialog.vue'

import CalculadoraPrecioDialog
    from './components/CalculadoraPrecioDialog.vue'

console.log(
    'CalculadoraPrecioDialog',
    CalculadoraPrecioDialog
)

let timeout = null

const productos = ref([])
const loading = ref(false)
const categorias = ref([])
const activeCat = ref(null)
const productoDialogRef =
    ref(null)
// 🔥 MERCADO
const { mercado } = useMercado()

// 🔥 FONDO DINÁMICO
const fondoStyle = computed(() => {

    if (!mercado.value?.patron_fondo) {
        return {}
    }

    return cssToObject(mercado.value.patron_fondo)

})
const nuevaCategoriaRef =
    ref(null)
const nuevoProductoRef =
    ref(null)
const toastRef =
    ref(null)

const productoFotosRef =
    ref(null)
const { getNegId, getUsuId } = useUsuario()

const dialogRef = ref(null)
const productosOriginales =
    ref([])

const listaBaseBusqueda =
    ref([])

const calculadoraRef =
    ref(null)

const misCategoriasRef =
    ref(null)

function openDialog() {

    dialogRef.value?.open()

}

function openProducto(item) {

    productoDialogRef.value?.open(
        item
    )

}

function openNuevoProducto() {

    nuevoProductoRef.value?.open()

}

/* =========================================
   🔥 STOCK UPDATED
========================================= */

function onStockUpdated(payload) {

    console.log(
        '📦 actualizar listado',
        payload
    )

    const item =
        productos.value.find(

            p =>

                Number(
                    p.product_id
                )

                ===

                Number(
                    payload.product_id
                )

        )

    if (!item) {
        return
    }

    item.stock =
        payload.stock

}

/* =========================================
   🔥 PRODUCTO CREATED
========================================= */

async function onProductoCreated() {

    loading.value = true

    /* =========================================
       🔥 RECARGAR TODO
    ========================================= */

    await cargarCategorias()

    loading.value = false

    toastRef.value?.show({

        text:
            'Producto guardado ✨',

        type:
            'success'

    })

}

/* =========================================
🔥 OPEN NUEVA CATEGORIA
========================================= */

function openNuevaCategoria() {

    nuevaCategoriaRef.value?.open()

}

/* =========================================
🔥 CREATED
========================================= */

async function onCategoriaCreated() {

    loading.value = true

    await cargarCategorias()

    loading.value = false

    toastRef.value?.show({

        text:
            'Categoría guardada ✨',

        type:
            'success'

    })

}


async function cargarCategorias() {

    try {

        const seguridad = firma()

        const res = await axios.post(

            '/MylW/listar_categorias',

            {

                neg_id: getNegId(),

                xin: seguridad.xin,

                yuan: seguridad.yuan

            }

        )

        if (res.data.status === 'ok') {

            categorias.value = res.data.data

            /* =========================================
            🔥 TODOS LOS PRODUCTOS
            ========================================= */

            const todos = categorias.value.flatMap(

                c => c.productos || []

            )

            productos.value = [
                ...todos
            ]

            productosOriginales.value = [
                ...todos
            ]

            listaBaseBusqueda.value = [
                ...todos
            ]

        }

    } catch (e) {

        console.error(e)

        toastRef.value?.show({

            text:
                'Error cargando categorías 😢',

            type:
                'error'

        })

    }

}

function onSelectCategoria(cat) {

    /* =========================================
       🔥 TODOS
    ========================================= */

    if (!cat.category_id) {

        activeCat.value = null

        const todos =

            categorias.value.flatMap(

                c => c.productos || []

            )

        productos.value = [
            ...todos
        ]

        listaBaseBusqueda.value = [
            ...todos
        ]

        return

    }

    /* =========================================
       🔥 CATEGORIA
    ========================================= */

    activeCat.value =
        cat.category_id

    const lista =
        cat.productos || []

    productos.value = [
        ...lista
    ]

    listaBaseBusqueda.value = [
        ...lista
    ]

}

// 🔥 INPUT
function onBuscar(texto) {

    clearTimeout(timeout)

    timeout = setTimeout(() => {

        const txt =

            normalizeText(
                texto || ''
            )

        /* =========================================
           🔥 VACIO
        ========================================= */

        if (!txt) {

            productos.value = [

                ...listaBaseBusqueda.value

            ]

            return

        }

        /* =========================================
           🔥 FILTRO
        ========================================= */

        productos.value =

            listaBaseBusqueda.value.filter(p => {

                return (

                    normalizeText(
                        p.name || ''
                    )

                        .includes(txt)

                    ||

                    normalizeText(
                        p.description || ''
                    )

                        .includes(txt)

                    ||

                    normalizeText(
                        p.cod_producto || ''
                    )

                        .includes(txt)

                )

            })

    }, 250)

}

// 🔥 LIMPIAR
function onLimpiar() {

    productos.value = [

        ...listaBaseBusqueda.value

    ]

}

/* =========================================
🔥 NORMALIZAR
========================================= */

function normalizeText(txt = '') {

    return String(txt)

        .normalize('NFD')

        .replace(/[\u0300-\u036f]/g, '')

        .toLowerCase()

}

onMounted(async () => {

    loading.value = true

    await cargarCategorias()

    loading.value = false

})

/* =========================================
🔥 FOTOS PRODUCTO
========================================= */

function onProductoFotos(item) {

    productoFotosRef.value?.open(
        item
    )

}

function openCalculadora(producto) {

    console.log(
        'CLICK CALCULADORA'
    )

    console.log(
        'REF',
        calculadoraRef.value
    )

    console.log(
        'OPEN',
        calculadoraRef.value?.open
    )

    try {

        calculadoraRef.value?.open(
            producto
        )

        console.log(
            'OPEN EJECUTADO'
        )

    }
    catch (e) {

        console.error(
            e
        )

    }

}

/* =========================================
   👁️ VISIBLE UPDATED
========================================= */

function onVisibleUpdated(payload) {

    console.log(
        '👁️ actualizar visible',
        payload
    )

    const item =
        productos.value.find(

            p =>

                Number(
                    p.product_id
                )

                ===

                Number(
                    payload.product_id
                )

        )

    if (!item) {
        return
    }

    item.is_visible =
        payload.is_visible

}

/* =========================================
🔥 MIS CATEGORIAS
========================================= */

function openMisCategorias() {

    misCategoriasRef.value?.open(

        categorias.value

    )

}

/* =========================================
🔥 IMAGEN SUBIDA
========================================= */

function onProductoImagenUploaded({

    product_id,
    imagen

}) {

    for (

        const categoria
        of categorias.value

    ) {

        const producto =

            categoria.productos.find(

                x =>

                    Number(
                        x.product_id
                    )

                    ===

                    Number(
                        product_id
                    )

            )

        if (producto) {

            if (

                !Array.isArray(
                    producto.imagenes
                )

            ) {

                producto.imagenes = []

            }

            producto.imagenes.unshift(
                imagen
            )

            break

        }

    }

}

/* =========================================
🔥 ELIMINADA
========================================= */

async function onCategoriaDeleted() {

    await cargarCategorias()

}

/* =========================================
🔥 EDITAR CATEGORIA
========================================= */

function onEditarCategoria(categoria) {

    nuevaCategoriaRef.value?.open(
        categoria
    )

}


/* =========================================
   🗑️ PRODUCTO ELIMINADO
========================================= */

function onProductoDeleted(payload) {

    productos.value =

        productos.value.filter(

            p =>

                Number(
                    p.product_id
                )

                !==

                Number(
                    payload.product_id
                )

        )

    productosOriginales.value =

        productosOriginales.value.filter(

            p =>

                Number(
                    p.product_id
                )

                !==

                Number(
                    payload.product_id
                )

        )

}

/* =========================================
   ✏️ EDITAR PRODUCTO
========================================= */

function onEditarProducto(item) {

    nuevoProductoRef.value?.open(

        item

    )

}


watch(
    calculadoraRef,
    v => {
        console.log(
            'CALCULADORA REF CAMBIO',
            v
        )
    },
    {
        immediate: true
    }
)
</script>