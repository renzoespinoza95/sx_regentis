<template>

    <div v-if="visible" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div ref="box" class="bg-white rounded-xl p-4 w-80">

            <!-- HEADER -->
            <div class="flex justify-between items-center mb-3">

                <button @click="prevMonth">‹</button>

                <span class="font-semibold">
                    {{ months[currentMonth] }} {{ currentYear }}
                </span>

                <button @click="nextMonth">›</button>

            </div>

            <!-- DIAS -->
            <div class="grid grid-cols-7 gap-1 text-center text-sm">

                <div v-for="d in days" :key="d" class="py-2 cursor-pointer rounded hover:bg-gray-100"
                    @click="selectDay(d)">
                    {{ d }}
                </div>

            </div>

            <!-- CERRAR -->
            <button class="w-full mt-3 py-2 bg-red-500 text-white rounded" @click="close">
                Cerrar
            </button>

        </div>

    </div>

</template>

<script setup>
import { ref, nextTick } from 'vue'
import gsap from 'gsap'

const visible = ref(false)
const box = ref(null)

const currentDate = new Date()
const currentMonth = ref(currentDate.getMonth())
const currentYear = ref(currentDate.getFullYear())

const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const days = Array.from({ length: 31 }, (_, i) => i + 1)

const emit = defineEmits(['select'])

function open() {
    visible.value = true

    nextTick(() => {
        gsap.fromTo(box.value,
            { scale: 0.7, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
        )
    })
}

function close() {
    gsap.to(box.value, {
        scale: 0.7,
        opacity: 0,
        duration: 0.2,
        onComplete: () => visible.value = false
    })
}

function prevMonth() {
    currentMonth.value--
    if (currentMonth.value < 0) {
        currentMonth.value = 11
        currentYear.value--
    }
}

function nextMonth() {
    currentMonth.value++
    if (currentMonth.value > 11) {
        currentMonth.value = 0
        currentYear.value++
    }
}

function selectDay(day) {
    const fecha = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    emit('select', fecha)
    close()
}

defineExpose({ open })
</script>
