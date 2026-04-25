<template>

    <div class="mt-8">

        <div class="px-4 mb-3 font-semibold text-gray-700">
            Categorias
        </div>

        <div class="px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">

            <div v-for="cat in categorias" :key="cat.nombre"
                class="bg-white rounded-2xl shadow-md p-3 text-center cursor-pointer" @click="irCategoria(cat)">
                <img :src="cat.img" class="w-full h-24 object-cover rounded-xl" />

                <div class="mt-2 text-sm font-semibold">
                    {{ cat.nombre }}
                </div>

            </div>

        </div>

    </div>

</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function irCategoria(cat) {
    router.push({
        path: '/MmZU_productos_categoria',
        query: {
            categoria: cat.nombre
        }
    })
}

const categorias = [
    { nombre: 'Abarrotes', img: 'https://picsum.photos/200?random=401' },
    { nombre: 'Verduras', img: 'https://picsum.photos/200?random=402' },
    { nombre: 'Carnes', img: 'https://picsum.photos/200?random=403' },
    { nombre: 'Bebidas', img: 'https://picsum.photos/200?random=404' }
]
</script>
