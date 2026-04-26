<template>

    <div>

        <div class="text-sm font-semibold mb-2">
            Mesas
        </div>

        <div class="flex gap-2 overflow-x-auto pb-2">

            <div v-for="m in mesas" :key="m.id"
                class="flex-shrink-0 px-3 py-2 rounded-full text-xs flex items-center gap-1 transition" :class="[
                    m.disabled
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-green-500 text-white cursor-pointer active:scale-95'
                ]">
                <!-- 🔥 EMOJI MÁS VIVO -->
                <span class="text-base leading-none">
                    🍽️
                </span>

                <span>
                    {{ m.nombre }}
                </span>
            </div>

        </div>

    </div>

</template>

<script setup>
import { ref } from 'vue'

// 🔥 GENERAR MESAS
const mesas = ref(
    Array.from({ length: 20 }, (_, i) => {
        const num = i + 1

        return {
            id: num,
            nombre: `Mesa ${String(num).padStart(2, '0')}`,
            disabled: num === 3 || num === 8
        }
    })
)
</script>
