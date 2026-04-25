<template>

    <div>
        <label class="text-sm text-gray-600">Fecha</label>

        <div class="relative mt-1">

            <input :value="model" readonly class="w-full border rounded-md px-3 py-2 text-sm" />

            <!-- 🔥 BOTON CALENDARIO -->
            <div class="absolute right-2 top-2 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                :style="{ background: mercado.topnavbar_color }" @click="openCalendar">
                <i class="fa fa-calendar text-white text-xs"></i>
            </div>

        </div>

        <CalendarDialog ref="calendarRef" @select="setFecha" />

    </div>

</template>

<script setup>
import { ref } from 'vue'
import { useMercado } from '../../../../../services/useMercado.js'
import CalendarDialog from './CalendarDialog.vue'

const model = defineModel()
const { mercado } = useMercado()

const calendarRef = ref(null)

function openCalendar() {
    calendarRef.value.open()
}

function setFecha(fecha) {
    model.value = fecha
}
</script>