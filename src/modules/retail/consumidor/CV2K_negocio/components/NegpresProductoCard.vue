<template>
  <div class="
        bg-white
        rounded-2xl
        shadow-md
        overflow-hidden
    ">

    <div class="relative">
      <img :src="img

        ||

        'https://barsi-img.b-cdn.net/recursos/6qz5.png'

        " class="
        w-full
        h-32

        object-cover
    " />

      <button class="
        absolute

        top-2
        right-2

        w-9
        h-9

        rounded-full

        bg-[#FD7635]/85

        backdrop-blur-sm

        text-white

        shadow-lg

        hover:scale-105

        active:scale-95

        transition

        z-10
    " @click.stop="irDetalle">

        <i class="
            fa
            fa-eye
            text-sm
        ">
        </i>

      </button>
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