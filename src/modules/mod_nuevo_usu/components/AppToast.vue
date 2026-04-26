<template>
    <div v-if="show" ref="toast" class="fixed top-0 left-0 w-full flex justify-center z-50 pointer-events-none">
        <div class="mt-4 px-6 py-3 rounded-xl shadow-lg font-semibold text-white" :class="bgColor">
            {{ message }}
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
    show: Boolean,
    message: String,
    type: {
        type: String,
        default: 'success' // success | error
    }
})

const emit = defineEmits(['update:show'])

const toast = ref(null)

const bgColor = computed(() => {
    return props.type === 'success'
        ? 'bg-green-500'
        : 'bg-red-500'
})

// 🔥 animación
watch(() => props.show, async (val) => {
    if (val) {
        await nextTick()

        gsap.fromTo(toast.value,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
        )

        setTimeout(() => {
            gsap.to(toast.value, {
                y: -100,
                opacity: 0,
                duration: 0.3,
                onComplete: () => emit('update:show', false)
            })
        }, 2500)
    }
})
</script>