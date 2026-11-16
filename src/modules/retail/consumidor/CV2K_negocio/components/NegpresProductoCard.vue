<template>

  <article class="tn-prod">

    <!-- FOTO FESTONEADA -->
    <div class="tn-blob-wrap">

      <button type="button" class="tn-blob" :aria-label="'Ver ' + title" @click="irDetalle">

        <img :src="img || IMG_DEFAULT" :alt="title" loading="lazy">

        <span v-if="etiqueta" class="tn-prod-tag">{{ etiqueta }}</span>

      </button>

    </div>

    <!-- NOMBRE -->
    <h3 class="tn-prod-name" @click="irDetalle">
      {{ title }}
    </h3>

    <!-- PRECIO + CHIPS -->
    <div class="tn-prod-meta">

      <span class="tn-prod-price">S/ {{ precioTexto }}</span>

      <span v-if="rating" class="tn-chip">
        <i class="fa fa-star"></i>{{ rating }}
      </span>

      <span v-if="reviews" class="tn-chip">
        <i class="fa fa-comment"></i>{{ reviews }}
      </span>

    </div>

    <!-- BOTON -->
    <button type="button" class="tn-btn-pill" @click="irDetalle">
      <i class="fa fa-eye"></i> Ver
    </button>

  </article>

</template>

<script setup>

import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const IMG_DEFAULT =
  'https://barsi-img.b-cdn.net/recursos/6qz5.png'

const props = defineProps({

  product_id: Number,

  title: String,

  price: [Number, String],

  rating: [Number, String],

  reviews: [Number, String],

  img: String,

  etiqueta: String

})

const precioTexto = computed(() => {

  return Number(
    props.price || 0
  ).toFixed(2)

})

function irDetalle() {

  router.push(`/QZMq_detalle_prod/${props.product_id}`)

}

</script>