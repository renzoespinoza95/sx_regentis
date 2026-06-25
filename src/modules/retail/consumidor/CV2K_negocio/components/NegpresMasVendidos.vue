<template>

    <div class="mt-6">

        <div class="px-4 mb-3 font-semibold" :style="subtituloStyle">

            Mas Vendidos

        </div>

        <div class="relative">

            <!-- IZQUIERDA -->
            <button class="
                    absolute

                    left-1
                    top-1/2

                    -translate-y-1/2

                    z-20

                    w-10
                    h-10

                    rounded-full

                    bg-black/20

                    backdrop-blur-sm

                    text-white

                    hover:bg-black/40

                    transition
                " @click="scrollLeftBtn">

                <i class="fa fa-chevron-left"></i>

            </button>

            <!-- DERECHA -->
            <button class="
                    absolute

                    right-1
                    top-1/2

                    -translate-y-1/2

                    z-20

                    w-10
                    h-10

                    rounded-full

                    bg-black/20

                    backdrop-blur-sm

                    text-white

                    hover:bg-black/40

                    transition
                " @click="scrollRightBtn">

                <i class="fa fa-chevron-right"></i>

            </button>

            <!-- CAROUSEL -->
            <div ref="container" class="
                    flex
                    gap-4
                    overflow-x-auto
                    no-scrollbar
                    px-4
                    cursor-grab
                " @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag">

                <div v-for="(p, index) in productos" :key="p.product_id" :ref="el => itemsRef[index] = el"
                    class="w-[180px] flex-shrink-0">

                    <NegpresProductoCard :product_id="p.product_id" :title="p.name" :price="p.price" :rating="5" :img="p.imagenes?.find(

                        x =>

                            Number(
                                x.orden
                            ) === 1

                    )?.img

                        ||

                        p.imagenes?.[0]?.img

                        ||

                        'https://barsi-img.b-cdn.net/recursos/6qz5.png'
                        " badge="👁️" />

                </div>

            </div>

        </div>

    </div>

</template>

<script setup>
import { useTienda }
    from '../../../../../services/useTienda.js'
import NegpresProductoCard from './NegpresProductoCard.vue'
import {
    ref,
    watch,
    nextTick,
    computed
}
    from 'vue'

import gsap
    from 'gsap'

const props = defineProps({
    productos: Array
})

const container = ref(null)

let isDown = false
let startX
let scrollLeft

const itemsRef =
    ref([])

const { data } = useTienda()

function startDrag(e) {
    isDown = true
    const pageX = e.touches ? e.touches[0].pageX : e.pageX
    startX = pageX - container.value.offsetLeft
    scrollLeft = container.value.scrollLeft
}

function onDrag(e) {
    if (!isDown) return
    e.preventDefault()

    const pageX = e.touches ? e.touches[0].pageX : e.pageX
    const x = pageX - container.value.offsetLeft
    const walk = (x - startX) * 1.2
    container.value.scrollLeft = scrollLeft - walk
}

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

const subtituloStyle = computed(() => {

    const tema_id = Number(
        data.value?.tema?.tema_id || 0
    )

    if (

        tema_id > 0

        &&

        data.value?.tema?.subtitulo

    ) {

        return {

            color:
                data.value.tema.subtitulo

        }

    }

    return {}

})

async function animarItems() {

    await nextTick()

    if (!itemsRef.value?.length)
        return

    gsap.fromTo(

        itemsRef.value,

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

    async (v) => {

        if (!v?.length)
            return

        await animarItems()

    },

    {

        immediate: true

    }

)

function stopDrag() {
    isDown = false
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    scrollbar-width: none;
}
</style>