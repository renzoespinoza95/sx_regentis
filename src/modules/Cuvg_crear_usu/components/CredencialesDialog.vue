<template>
    <TransitionRoot :show="show" as="template">
        <Dialog as="div" class="fixed inset-0 z-50" @close="$emit('close')">

            <div class="fixed inset-0 bg-black/40"></div>

            <div class="fixed inset-0 flex items-center justify-center p-4">

                <DialogPanel class="w-full max-w-md bg-white rounded-2xl shadow-xl p-5">
                    <DialogTitle class="text-lg font-semibold mb-4 text-center">
                        Datos del usuario
                    </DialogTitle>

                    <div class="space-y-3 text-sm">
                        <div class="rounded-xl bg-gray-50 p-3">
                            <div class="text-gray-500">DNI</div>
                            <div class="font-medium">{{ datos.dni }}</div>
                        </div>

                        <div class="rounded-xl bg-gray-50 p-3">
                            <div class="text-gray-500">Celular</div>
                            <div class="font-medium">{{ datos.celular }}</div>
                        </div>

                        <div class="rounded-xl bg-gray-50 p-3">
                            <div class="text-gray-500">Nombres apellidos</div>
                            <div class="font-medium">{{ datos.nombre }}</div>
                        </div>

                        <div class="rounded-xl bg-gray-50 p-3">
                            <div class="text-gray-500">Sobrenombre</div>
                            <div class="font-medium">{{ datos.sobrenombre }}</div>
                        </div>

                        <div class="rounded-xl bg-orange-50 p-3 border border-orange-200">
                            <div class="text-gray-500">Clave</div>
                            <div class="font-bold text-lg tracking-widest">{{ datos.clave }}</div>
                        </div>
                    </div>

                    <div class="mt-5 flex gap-3">
                        <button @click="copiarDatos"
                            class="flex-1 bg-[#FD7635] text-white py-3 rounded-xl font-semibold">
                            Copiar
                        </button>

                        <button @click="$emit('close')"
                            class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold">
                            Cerrar
                        </button>
                    </div>

                </DialogPanel>

            </div>

        </Dialog>
    </TransitionRoot>
</template>

<script setup>
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot
} from '@headlessui/vue'

const props = defineProps({
    show: Boolean,
    datos: {
        type: Object,
        default: () => ({
            dni: '',
            celular: '',
            nombre: '',
            sobrenombre: '',
            clave: ''
        })
    }
})

const emit = defineEmits(['close', 'copied'])

function textoPlano() {
    return [
        `DNI: ${props.datos.dni}`,
        `Celular: ${props.datos.celular}`,
        `Nombres apellidos: ${props.datos.nombre}`,
        `Sobrenombre: ${props.datos.sobrenombre}`,
        `Clave: ${props.datos.clave}`
    ].join('\n')
}

async function copiarDatos() {
    const texto = textoPlano()

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(texto)
        } else {
            const textarea = document.createElement('textarea')
            textarea.value = texto
            textarea.style.position = 'fixed'
            textarea.style.left = '-9999px'
            textarea.style.top = '0'
            document.body.appendChild(textarea)
            textarea.focus()
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
        }

        emit('copied')
    } catch (e) {
        console.error('No se pudo copiar', e)
    }
}
</script>
