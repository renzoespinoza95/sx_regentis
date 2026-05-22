<template>

    <div class="mt-8">

        <div class="px-4 mb-3 font-semibold text-gray-700">
            Categorias
        </div>

        <div class="px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">

            <div v-for="(cat, index) in categorias" :key="cat.category_id" :ref="el => itemsRef[index] = el" class="
        bg-white
        rounded-2xl
        shadow-md
        p-3
        text-center
        cursor-pointer
    " @click="
        irCategoria(cat)
        ">
                <img :src="getImg(cat, index)" class="w-full h-24 object-cover rounded-xl" />

                <div class="mt-2 text-sm font-semibold">
                    {{ cat.name }}
                </div>

            </div>

        </div>

    </div>

</template>

<script setup>
import { useRouter } from 'vue-router'
import {
    ref,
    watch,
    nextTick
}
    from 'vue'

import gsap
    from 'gsap'

const router = useRouter()
const itemsRef =
    ref([])

function irCategoria(cat) {
    router.push(`/MmZU_productos_categoria/${cat.category_id}`)
}

function getImg(cat, index) {

    // si viene imagen del backend
    if (cat.img) return cat.img

    // fallback con picsum (random bonito)
    return `https://picsum.photos/300/200?random=${cat.category_id || index}`
}

const props = defineProps({
    categorias: Array
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

    () => props.categorias,

    async (v) => {

        if (!v?.length)
            return

        await animarItems()

    },

    {

        immediate: true

    }

)
</script>
