<template>

    <div ref="gridRef"
        class="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 px-3 overflow-y-auto no-scrollbar"
        style="max-height: calc(100vh - 160px);">

        <div v-for="p in productos" :key="p.product_id" class="card-item">
            <ProductCard :producto="p" :neg_id="props.neg_id" @toast="handleToast" @confetti="handleConfetti" />
        </div>

    </div>

</template>

<script setup>
import ProductCard from './ProductCard.vue'
import { ref, watch, nextTick } from 'vue'
import { gsap } from 'gsap'

const gridRef = ref(null)

const props = defineProps({
    productos: Array,
    neg_id: Number
})

// 🔥 AGREGA ESTO
const emit = defineEmits(['toast', 'confetti'])

// 🔥 AGREGA ESTO
function handleToast(msg) {
    console.log('GRID RECIBE', msg)
    emit('toast', msg)
}

watch(() => props.productos, async () => {
    await nextTick()

    const items = gridRef.value?.querySelectorAll('.card-item')

    if (!items) return

    gsap.fromTo(items,
        {
            x: -50,
            opacity: 0,
            rotate: -5
        },
        {
            x: 0,
            opacity: 1,
            rotate: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out"
        }
    )
})

function handleConfetti() {
    emit('confetti')
}
</script>