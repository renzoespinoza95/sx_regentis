<template>

    <div class="mt-8">

        <div class="px-4 mb-3 font-semibold text-gray-700">
            Categorias
        </div>

        <div class="px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">

            <div v-for="cat in categorias" :key="cat.category_id"
                class="bg-white rounded-2xl shadow-md p-3 text-center cursor-pointer" @click="irCategoria(cat)">
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

const router = useRouter()

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
</script>
