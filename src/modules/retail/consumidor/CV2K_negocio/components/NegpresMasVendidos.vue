<template>

    <div class="mt-6">

        <div class="px-4 mb-3 font-semibold text-gray-700">
            Mas Vendidos
        </div>

        <!-- CAROUSEL -->
        <div ref="container" class="flex gap-4 overflow-x-auto no-scrollbar px-4 cursor-grab" @mousedown="startDrag"
            @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag" @touchstart="startDrag" @touchmove="onDrag"
            @touchend="stopDrag">

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

                    " badge="🔥" />
            </div>

        </div>

    </div>

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
    productos: Array
})

const container = ref(null)

let isDown = false
let startX
let scrollLeft

const itemsRef =
    ref([])

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