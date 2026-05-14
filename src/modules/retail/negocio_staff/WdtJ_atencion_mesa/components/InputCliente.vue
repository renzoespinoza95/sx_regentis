<template>

    <div>
        <label class="text-sm text-gray-600">Cliente</label>

        <!-- 🔥 INPUT PREMIUM -->
        <div class="mt-1 border rounded-md px-3 py-2 text-sm cursor-pointer bg-white flex items-center justify-between shadow-sm hover:shadow transition"
            @click="openDialog">

            <!-- TEXTO -->
            <span :class="model ? 'text-gray-800' : 'text-gray-400'">
                {{ model || 'Seleccionar cliente...' }}
            </span>

            <!-- 🔥 ICONO CHEVRON -->
            <div class="ml-2 flex items-center">

                <div class="w-6 h-6 rounded-full flex items-center justify-center bg-gray-100">
                    <i class="fa fa-chevron-down text-xs text-gray-500"></i>
                </div>

            </div>

        </div>

        <ClienteDialog ref="dialogRef" @select="setCliente" />

    </div>

</template>

<script setup>
import { ref } from 'vue'
import ClienteDialog from './ClienteDialog.vue'

const model = defineModel()
const dialogRef = ref(null)

function openDialog() {
    dialogRef.value.open()
}

function setCliente(cliente) {
    model.value = cliente.nombre
}
</script>