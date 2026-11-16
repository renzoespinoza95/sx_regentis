<template>

    <section v-if="productos.length" class="tn-sec">

        <div class="tn-container">

            <div class="tn-sec-head">

                <span class="tn-deco">Lo más pedido</span>

                <h2 class="tn-sec-title">Más vendidos</h2>

            </div>

        </div>

        <div class="tn-rail-wrap">

            <!-- IZQUIERDA -->
            <button class="tn-arrow prev" type="button" aria-label="Anterior" @click="scrollLeftBtn">

                <i class="fa fa-chevron-left"></i>

            </button>

            <!-- DERECHA -->
            <button class="tn-arrow next" type="button" aria-label="Siguiente" @click="scrollRightBtn">

                <i class="fa fa-chevron-right"></i>

            </button>

            <!-- CARRUSEL -->
            <div ref="container" class="tn-rail" @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag"
                @mouseleave="stopDrag" @click.capture="onClickCapture">

                <div v-for="(p, index) in productos" :key="p.product_id" :ref="el => itemsRef[index] = el"
                    class="tn-rail-item">

                    <NegpresProductoCard :product_id="p.product_id" :title="p.name" :price="p.price" :img="p.imagenes?.find(
                        x => Number(x.orden) === 1
                    )?.img
                        || p.imagenes?.[0]?.img
                        || 'https://barsi-img.b-cdn.net/recursos/6qz5.png'
                        " :etiqueta="p.variantes?.etiqueta" :rating="p.variantes?.rating"
                        :reviews="p.variantes?.reviews" />

                </div>

            </div>

        </div>

    </section>

</template>

<script setup>

import NegpresProductoCard from './NegpresProductoCard.vue'

import {
    ref,
    watch,
    nextTick
}
    from 'vue'

import gsap
    from 'gsap'

const props = defineProps({

    productos: {
        type: Array,
        default: () => []
    }

})

const container = ref(null)

const itemsRef =
    ref([])

/* =========================================
   DRAG (MOUSE)
========================================= */

let isDown = false
let moved = false
let startX = 0
let startScroll = 0

function startDrag(e) {

    if (!container.value) return

    isDown = true
    moved = false

    startX = e.pageX
    startScroll = container.value.scrollLeft

}

function onDrag(e) {

    if (!isDown || !container.value) return

    const walk = (e.pageX - startX) * 1.2

    if (Math.abs(walk) > 5) {
        moved = true
    }

    e.preventDefault()

    container.value.scrollLeft = startScroll - walk

}

function stopDrag() {

    isDown = false

}

/* Si se arrastro, no dejar pasar el click a la tarjeta */
function onClickCapture(e) {

    if (moved) {

        e.stopPropagation()

        e.preventDefault()

        moved = false

    }

}

/* =========================================
   FLECHAS
========================================= */

function scrollLeftBtn() {

    container.value?.scrollBy({

        left: -300,

        behavior: 'smooth'

    })

}

function scrollRightBtn() {

    container.value?.scrollBy({

        left: 300,

        behavior: 'smooth'

    })

}

/* =========================================
   ANIMACION
========================================= */

async function animarItems() {

    await nextTick()

    const els = itemsRef.value.filter(Boolean)

    if (!els.length)
        return

    gsap.fromTo(

        els,

        {

            x: -80,
            opacity: 0

        },

        {

            x: 0,
            opacity: 1,

            duration: 0.6,

            stagger: 0.08,

            ease: 'power3.out'

        }

    )

}

watch(

    () => props.productos,

    (v) => {

        if (!v?.length)
            return

        animarItems()

    },

    {

        immediate: true

    }

)

</script>