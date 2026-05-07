<template>

    <div ref="gridRef" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 px-3">

        <div v-for="p in productos" :key="p.fav_id" class="card-item">
            <FavoriteCard :producto="p" @eliminar="handleEliminar" />
        </div>

    </div>

</template>

<script setup>
import FavoriteCard from './FavoriteCard.vue'
import { ref, watch, nextTick } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
    productos: Array
})

const emit = defineEmits(['eliminar'])

const gridRef = ref(null)

function handleEliminar(id) {
    emit('eliminar', id)
}

/* =========================
   🔥 ANIMACIÓN
========================= */

watch(() => props.productos, async () => {

    await nextTick()

    const items = gridRef.value?.querySelectorAll('.card-item')

    if (!items) return

    gsap.fromTo(items,
        {
            x: -60,
            opacity: 0,
            rotate: -6,
            scale: 0.95
        },
        {
            x: 0,
            opacity: 1,
            rotate: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: "power2.out"
        }
    )

}, { immediate: true }) // 👈 importante para animar al cargar

</script>