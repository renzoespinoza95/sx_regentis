<template>

  <section v-if="categorias.length" class="tn-sec tn-sec-pattern">

    <div class="tn-container">

      <div class="tn-sec-head">

        <span class="tn-deco">Explora</span>

        <h2 class="tn-sec-title">Categorías</h2>

      </div>

      <div class="tn-cat-grid">

        <article v-for="(cat, index) in categorias" :key="cat.category_id" :ref="el => itemsRef[index] = el"
          class="tn-prod" @click="irCategoria(cat)">

          <div class="tn-blob-wrap">

            <button type="button" class="tn-blob" :aria-label="'Ver ' + cat.name">

              <img v-if="cat.img" :src="cat.img" :alt="cat.name" loading="lazy">

              <span v-else class="tn-blob-icon">{{ cat.icon || '📦' }}</span>

            </button>

          </div>

          <h3 class="tn-prod-name">
            {{ cat.name }}
          </h3>

          <div class="tn-prod-meta">

            <span class="tn-chip">
              <i class="fa fa-th-large"></i>{{ cat.productos?.length || 0 }} productos
            </span>

          </div>

        </article>

      </div>

    </div>

  </section>

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

const props = defineProps({

  categorias: {
    type: Array,
    default: () => []
  }

})

function irCategoria(cat) {

  router.push(`/MmZU_productos_categoria/${cat.category_id}`)

}

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

  () => props.categorias,

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