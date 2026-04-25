<template>
    <div class="rounded-2xl shadow-md p-3 flex items-center justify-between hover:scale-[1.02] transition"
        :style="cardStyle">

        <!-- LEFT -->
        <div class="flex items-center gap-3">

            <img src="https://picsum.photos/60?random=10" class="w-12 h-12 rounded-xl object-cover" />

            <div>
                <div class="font-semibold text-sm">
                    {{ item.name }}
                </div>

                <div class="text-xs text-gray-500">
                    Stock: {{ item.stock }}
                </div>
            </div>

        </div>

        <!-- RIGHT -->
        <div class="text-right">

            <div class="font-semibold text-sm">
                S/{{ item.price }}
            </div>

            <div class="text-xs text-gray-400">
                Ref: S/{{ item.precio }}
            </div>

        </div>

    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    item: Object
})

// 🔥 COLOR DINÁMICO SEGÚN STOCK
const cardStyle = computed(() => {

    if (props.item.stock < 10) {
        return {
            background: '#E1A2B7'
        }
    }

    return {
        background: 'white'
    }

})
</script>