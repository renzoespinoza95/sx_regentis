<template>

    <div v-if="visible" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]"
        @click.self="close">

        <div ref="box"
            class="relative bg-white w-[90%] max-w-md h-[85vh] rounded-2xl shadow-2xl p-5 overflow-visible flex flex-col space-y-3">

            <!-- 🔥 CERRAR -->
            <div class="absolute top-3 right-3 z-10">

                <button @click="close"
                    class="w-8 h-8 rounded-full bg-red-500 text-white shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition">

                    <i class="fa fa-times text-sm"></i>

                </button>

            </div>

            <!-- 🔥 SEARCH -->
            <!-- 🔥 SEARCH -->
            <div class="flex items-center bg-gray-100 px-3 py-2 rounded-md gap-2">

                <!-- 🔍 SEARCH -->
                <i class="fa fa-search text-gray-400"></i>

                <!-- ❌ LIMPIAR -->
                <i v-if="texto" @click="limpiarBusqueda" class="
            fa
            fa-times
            text-gray-400
            cursor-pointer
            hover:text-red-500
            transition
        ">

                </i>

                <!-- INPUT -->
                <input v-model="texto" placeholder="Buscar producto..." class="
            flex-1
            bg-transparent
            outline-none
            text-sm
        " @input="onBuscar" />

            </div>

            <!-- 🔥 CATEGORIAS -->
            <div ref="categoriasScroll"
                class="overflow-x-auto pb-2 no-scrollbar cursor-grab active:cursor-grabbing select-none"
                @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp" @mouseleave="onMouseUp"
                @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">

                <div class="grid grid-rows-2 grid-flow-col gap-2 w-max">

                    <!-- TODOS -->
                    <div @click="selectCategoria(null)"
                        class="flex-shrink-0 px-3 py-2 rounded-full text-xs flex items-center gap-1 cursor-pointer transition active:scale-95"
                        :class="activeCat === null
                            ? 'bg-orange-500 text-white'
                            : 'bg-orange-100 text-orange-600'
                            ">

                        🔥 Todos

                    </div>

                    <!-- CATEGORIAS -->
                    <div v-for="cat in categorias" :key="cat.category_id" @click="selectCategoria(cat.category_id)"
                        class="flex-shrink-0 px-3 py-2 rounded-full text-xs flex items-center gap-1 cursor-pointer transition active:scale-95"
                        :class="activeCat === cat.category_id
                            ? 'bg-orange-500 text-white'
                            : 'bg-orange-100 text-orange-600'
                            ">

                        <span class="text-base leading-none">

                            {{ cat.icon || '📦' }}

                        </span>

                        <span>

                            {{ cat.descripcion }}

                        </span>

                    </div>

                </div>

            </div>

            <!-- 🔥 LISTA -->
            <div class="space-y-2 overflow-y-auto flex-1 min-h-0 pr-1">

                <div v-for="p in productosFiltrados" :key="p.product_id" @click="selectProducto(p)"
                    class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer active:scale-[0.98] transition">

                    <!-- IMG -->
                    <img :src="p.img
                        ||
                        'https://picsum.photos/40'
                        " class="w-8 h-8 rounded object-cover" />

                    <!-- NOMBRE -->
                    <div class="flex-1 text-sm">

                        {{ p.name }}

                    </div>

                    <!-- PRECIO -->
                    <span class="text-xs text-gray-500">

                        S/
                        {{
                            Number(
                                p.price
                            ).toFixed(2)
                        }}

                    </span>

                </div>

                <!-- 🔥 CANTIDAD -->
                <EditarCantidadDialog ref="cantRef" @update="agregarProducto" />

            </div>

        </div>

    </div>

</template>
<script setup>

import {
    ref,
    nextTick,
    computed,
    watch
} from 'vue'
import {
    bus
}
    from '../../../../../services/eventBus.js'
import axios from 'axios'

import gsap from 'gsap'

import {
    enc_barsi,
    des_barsi,
    firma
}
    from '../../../../../services/security'

import {
    useUsuario
}
    from '../../../../../services/usuarioService'

import EditarCantidadDialog
    from './EditarCantidadDialog.vue'

const visible = ref(false)

const box = ref(null)

const texto = ref('')

const productos = ref([])

const categorias = ref([])

const activeCat = ref(null)

const cantRef = ref(null)

const emit = defineEmits([
    'add'
])

const categoriasScroll =
    ref(null)

const isDragging =
    ref(false)

let startX = 0

let scrollLeft = 0

const {
    getNegId,
    getUsuId
} = useUsuario()

const API =
    import.meta.env.VITE_PUBLIC_URL_BASE

/* ======================================
   🔥 FILTRADOS
====================================== */

const productosFiltrados = computed(() => {

    let lista = productos.value

    /* ======================================
       🔥 SEARCH GLOBAL
    ====================================== */

    if (texto.value.trim()) {

        return lista.filter(p =>

            p.name
                .toLowerCase()
                .includes(
                    texto.value.toLowerCase()
                )

        )

    }

    /* ======================================
       🔥 TODOS
    ====================================== */

    if (activeCat.value === null) {

        return lista

    }

    /* ======================================
       🔥 FILTRO CATEGORY
    ====================================== */

    return lista.filter(p => {

        if (!p.categories_ids) {

            return false

        }

        return p.categories_ids.some(id =>

            Number(id) === Number(activeCat.value)

        )

    })

})

/* ======================================
   🔥 OPEN
====================================== */

function open() {

    visible.value = true
    bus.emit(
        'bottomnav:toggle',
        true
    )

    nextTick(() => {

        gsap.fromTo(
            box.value,
            {
                scale: 0.7,
                opacity: 0
            },
            {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                ease: 'back.out(1.7)'
            }
        )

    })

}

/* ======================================
   🔥 CLOSE
====================================== */

function close() {

    bus.emit(
        'bottomnav:toggle',
        false
    )

    gsap.to(box.value, {

        scale: 0.7,

        opacity: 0,

        duration: 0.2,

        onComplete: () => {

            visible.value = false

        }

    })

}

function limpiarBusqueda() {

    texto.value = ''

    activeCat.value = null

}

/* ======================================
   🔥 CARGAR PRODUCTOS
====================================== */

async function cargarProductos() {

    try {

        const neg_id =
            getNegId()

        console.log(
            'NEG_ID >>>',
            neg_id
        )

        if (!neg_id) {

            console.warn(
                'NEG_ID VACIO'
            )

            return

        }

        /* ======================================
           🔥 FIRMA
        ====================================== */

        const seguridad =
            firma()

        console.log(
            'FIRMA PRODUCTOS >>>',
            seguridad
        )

        /* ======================================
           🔥 REQUEST
        ====================================== */

        const res = await axios.post(

            `${API}/MpIH/product/listar`,

            {

                neg_id:
                    neg_id,

                xin:
                    seguridad.xin,

                yuan:
                    seguridad.yuan

            }

        )

        console.log(
            'PRODUCTOS >>>',
            res.data
        )

        /* ======================================
           🔥 OK
        ====================================== */

        if (res.data.status === 'ok') {

            productos.value =
                res.data.data || []

        }

    } catch (e) {

        console.error(
            'ERROR PRODUCTOS >>>',
            e
        )

    }

}

/* ======================================
   🔥 CARGAR CATEGORIAS
====================================== */

async function cargarCategorias() {

    try {

        const neg_id =
            getNegId()

        console.log(
            'NEG_ID CATEGORIAS >>>',
            neg_id
        )

        if (!neg_id) {

            console.warn(
                'NEG_ID VACIO CATEGORIAS'
            )

            return

        }

        /* ======================================
           🔥 FIRMA
        ====================================== */

        const seguridad =
            firma()

        console.log(
            'FIRMA CATEGORIAS >>>',
            seguridad
        )

        /* ======================================
           🔥 REQUEST
        ====================================== */

        const res = await axios.get(

            `${API}/MylW/listar_categorias/${neg_id}`,

            {

                params: {

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            }

        )

        console.log(
            'CATEGORIAS >>>',
            res.data
        )

        /* ======================================
           🔥 OK
        ====================================== */

        if (res.data.status === 'ok') {

            categorias.value =
                res.data.data || []

        }

    } catch (e) {

        console.error(
            'ERROR CATEGORIAS >>>',
            e
        )

    }

}

/* ======================================
   🖱️ DRAG SCROLL
====================================== */

function onMouseDown(e) {

    isDragging.value = true

    startX =
        e.pageX
        -
        categoriasScroll.value.offsetLeft

    scrollLeft =
        categoriasScroll.value.scrollLeft

}

function onMouseMove(e) {

    if (!isDragging.value)
        return

    e.preventDefault()

    const x =
        e.pageX
        -
        categoriasScroll.value.offsetLeft

    const walk =
        (x - startX) * 1.2

    categoriasScroll.value.scrollLeft =
        scrollLeft - walk

}

function onMouseUp() {

    isDragging.value = false

}

/* ======================================
   📱 TOUCH
====================================== */

function onTouchStart(e) {

    isDragging.value = true

    startX =
        e.touches[0].pageX
        -
        categoriasScroll.value.offsetLeft

    scrollLeft =
        categoriasScroll.value.scrollLeft

}

function onTouchMove(e) {

    if (!isDragging.value)
        return

    const x =
        e.touches[0].pageX
        -
        categoriasScroll.value.offsetLeft

    const walk =
        (x - startX) * 1.2

    categoriasScroll.value.scrollLeft =
        scrollLeft - walk

}

function onTouchEnd() {

    isDragging.value = false

}

/* ======================================
   🔥 SELECT CAT
====================================== */

function selectCategoria(id) {

    activeCat.value = id

}

/* ======================================
   🔥 BUSCAR
====================================== */

function onBuscar() {

    // 🔥 AL BUSCAR:
    // desactivar pills

    if (texto.value.trim()) {

        activeCat.value = null

    }

}

/* ======================================
   🔥 SELECT PRODUCTO
====================================== */

function selectProducto(p) {

    cantRef.value.open({

        nombre:
            p.name,

        precio:
            p.price,

        unidad:
            'und',

        cantidad:
            1,

        product_id:
            p.product_id

    })

}

/* ======================================
   🔥 AGREGAR
====================================== */

function agregarProducto(p) {

    emit('add', p)

}

/* ======================================
   🔥 INIT
====================================== */

/* ======================================
   🔥 INIT
====================================== */

setTimeout(() => {

    console.log(
        'NEG_ID INIT >>>',
        getNegId()
    )

    cargarProductos()

    cargarCategorias()

}, 500)

defineExpose({
    open
})

</script>
<style scoped>
.no-scrollbar::-webkit-scrollbar {

    display: none;

}

.no-scrollbar {

    scrollbar-width: none;

}
</style>