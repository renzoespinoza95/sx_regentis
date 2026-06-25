<template>

    <div v-if="visible" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div ref="box" class="bg-white rounded-2xl p-5 w-80">

            <!-- HEADER -->
            <div class="flex justify-between items-center text-sm mb-4">

                <button @click="prevMonth">
                    <i class="fa fa-chevron-left text-[#FD7635]"></i>
                </button>

                <span class="font-semibold">
                    {{ mesNombre }} {{ currentYear }}
                </span>

                <button @click="nextMonth">
                    <i class="fa fa-chevron-right text-[#FD7635]"></i>
                </button>

            </div>

            <!-- DIAS -->
            <div class="grid grid-cols-7 text-xs text-gray-500 mb-2 text-center">
                <span v-for="d in dias" :key="d">{{ d }}</span>
            </div>

            <!-- GRID -->
            <div class="grid grid-cols-7 gap-2 text-center">

                <div v-for="(d, i) in diasMes" :key="i"
                    class="w-8 h-8 flex items-center justify-center rounded-full text-sm cursor-pointer"
                    :class="getClass(d)" @click="selectDay(d)">
                    {{ d?.dia || '' }}
                </div>

            </div>

            <!-- CERRAR -->
            <button class="w-full mt-4 py-2 bg-red-500 text-white rounded" @click="close">
                Cerrar
            </button>

        </div>

    </div>

</template>

<script setup>
import { ref, nextTick, computed } from 'vue'
import gsap from 'gsap'

const visible = ref(false)
const box = ref(null)

const today = new Date()

const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())

const selected = ref({
    dia: today.getDate(),
    mes: today.getMonth(),
    anio: today.getFullYear()
})

const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const mesNombre = computed(() => meses[currentMonth.value])

// 🔥 GENERAR CALENDARIO REAL
const diasMes = computed(() => {

    const primerDia = new Date(currentYear.value, currentMonth.value, 1).getDay()
    const diasEnMes = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()

    const lista = []

    // 🔥 espacios vacíos antes
    for (let i = 0; i < primerDia; i++) {
        lista.push(null)
    }

    // 🔥 días reales
    for (let d = 1; d <= diasEnMes; d++) {
        lista.push({
            dia: d,
            mes: currentMonth.value,
            anio: currentYear.value
        })
    }

    return lista
})

// 🔥 CLASES DINÁMICAS
function getClass(d) {
    if (!d) return ''

    const isToday =
        d.dia === today.getDate() &&
        d.mes === today.getMonth() &&
        d.anio === today.getFullYear()

    const isSelected =
        d.dia === selected.value.dia &&
        d.mes === selected.value.mes &&
        d.anio === selected.value.anio

    if (isSelected) return 'bg-[#FD7635] text-white'
    if (isToday) return 'border-2 border-[#FD7635] text-[#FD7635]'

    return 'text-gray-700 hover:bg-gray-100'
}

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

function selectDay(d) {
    if (!d) return

    selected.value = d

    const fecha = `${d.anio}-${String(d.mes + 1).padStart(2, '0')}-${String(d.dia).padStart(2, '0')}`

    emit('select', fecha)
    close()
}

defineExpose({ open })
</script>