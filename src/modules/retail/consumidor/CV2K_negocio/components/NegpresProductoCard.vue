<template>
  <div class="bg-white rounded-2xl shadow-md overflow-hidden" @click="irDetalle">

    <div class="relative">
      <img :src="img

        ||

        'https://barsi-img.b-cdn.net/recursos/6qz5.png'

        " class="
        w-full
        h-32

        object-cover
    " />

      <span class="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
        {{ badge }}
      </span>
    </div>

    <div class="p-3">
      <h3 class="text-sm font-medium line-clamp-2 h-[42px] leading-tight">
        {{ title }}
      </h3>

      <p class="text-orange-500 font-semibold mt-1">
        S/{{ price }}
      </p>

      <div class="flex items-center gap-1 mt-1 text-yellow-400 text-xs">
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <span class="text-gray-500 ml-2">
          {{ rating }}
        </span>
      </div>

    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  product_id: Number,  // 🔥 FALTA ESTO
  title: String,
  price: String,
  rating: String,
  img: String,
  badge: String
})

function irDetalle() {
  router.push(`/QZMq_detalle_prod/${props.product_id}`)
}
</script>