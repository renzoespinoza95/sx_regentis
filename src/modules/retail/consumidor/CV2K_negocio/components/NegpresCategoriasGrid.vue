<template>

    <!-- ==========================================================
       CON TEMA: categorías con el diseño de las tarjetas
  =========================================================== -->
    <section v-if="tematizado && categorias.length" ref="raiz" class="tn-sec tn-sec-pattern">

        <div class="tn-container">

            <!-- Encabezado -->
            <div class="tn-sec-head">
                <span class="tn-deco">{{ TEXTOS.kicker }}</span>
                <h2 class="tn-sec-title">{{ TEXTOS.titulo }}</h2>
                <p class="tn-sec-desc">{{ TEXTOS.descripcion }}</p>
            </div>

            <!-- Categorías -->
            <div class="tn-prod-grid">

                <div v-for="cat in categorias" :key="cat.category_id" class="tn-prod-cell" data-anim>

                    <article class="tn-prod" @click="irCategoria(cat)">

                        <!-- Foto festoneada -->
                        <div class="tn-blob-wrap">

                            <button type="button" class="tn-blob" :aria-label="'Ver ' + cat.name">

                                <img v-if="cat.img" :src="cat.img" :alt="cat.name" loading="lazy">

                                <span v-else class="tn-blob-icon">{{ cat.icon || '📦' }}</span>

                            </button>

                        </div>

                        <!-- Nombre -->
                        <h3 class="tn-prod-name">
                            {{ cat.name }}
                        </h3>

                        <!-- Cantidad de productos (sin precio) -->
                        <div class="tn-prod-meta">

                            <span class="tn-chip">
                                <i class="fa fa-th-large"></i>{{ cat.productos?.length || 0 }} productos
                            </span>

                        </div>

                        <!-- Botón -->
                        <button type="button" class="tn-btn-pill">
                            <i class="fa fa-eye"></i> Ver
                        </button>

                    </article>

                </div>

            </div>

        </div>

    </section>

    <!-- ==========================================================
       SIN TEMA: rejilla sencilla de categorías
  =========================================================== -->
    <div v-else-if="categorias.length" ref="raiz" class="mt-8">

        <div class="px-4 mb-3 font-semibold text-gray-700">
            Categorias
        </div>

        <div class="px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">

            <div v-for="cat in categorias" :key="cat.category_id" data-anim
                class="bg-white rounded-2xl shadow-md p-3 text-center cursor-pointer" @click="irCategoria(cat)">

                <img :src="cat.img || IMG_CATEGORIA" :alt="cat.name" class="w-full h-24 object-cover rounded-xl" />

                <div class="mt-2 text-sm font-semibold">
                    {{ cat.name }}
                </div>

            </div>

        </div>

    </div>

</template>

<script setup>

import { nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

/* =========================================
   PROPS
========================================= */

const props = defineProps({

    categorias: {
        type: Array,
        default: () => []
    },

    /* true cuando el negocio tiene un tema con base_css */
    tematizado: {
        type: Boolean,
        default: false
    }

})

/* =========================================
   TEXTOS Y RECURSOS
========================================= */

const TEXTOS = {
    kicker: 'Explora por categoría',
    titulo: 'Categorías',
    descripcion: 'Toca una categoría para ver sus productos.'
}

const IMG_CATEGORIA = 'https://barsi-img.b-cdn.net/recursos/ffc1.png'

/* =========================================
   ESTADO
========================================= */

const router = useRouter()

const raiz = ref(null)

/* =========================================
   NAVEGACIÓN
========================================= */

function irCategoria(cat) {

    router.push(`/MmZU_productos_categoria/${cat.category_id}`)

}

/* =========================================
   ANIMACIÓN
========================================= */

async function animarItems() {

    await nextTick()

    const els = raiz.value?.querySelectorAll('[data-anim]')

    if (!els?.length) {
        return
    }

    gsap.fromTo(
        els,
        { x: -60, opacity: 0 },
        {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: 'power3.out',
            clearProps: 'transform,opacity'
        }
    )

}

watch(
    [() => props.categorias, () => props.tematizado],
    () => {

        if (props.categorias.length) {
            animarItems()
        }

    },
    { immediate: true }
)

</script>