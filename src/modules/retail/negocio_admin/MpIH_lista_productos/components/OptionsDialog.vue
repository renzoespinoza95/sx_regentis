<template>

    <div v-if="visible" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div ref="box" class="bg-white rounded-xl p-5 w-72 space-y-3">

            <button class="
                w-full
                text-left
                px-3
                py-2
                rounded-lg
                hover:bg-gray-100
                transition
                flex
                items-center
                gap-2
            " @click="abrirNuevaCategoria">

                <i class="
                    fa
                    fa-folder-open
                    text-orange-500
                ">
                </i>

                <span>
                    Nueva categoría
                </span>

            </button>

            <button class="
                w-full
                text-left
                px-3
                py-2
                rounded-lg
                hover:bg-gray-100
                transition
                flex
                items-center
                gap-2
            " @click="abrirMisCategorias">

                <i class="
                    fa
                    fa-tags
                    text-green-500
                ">
                </i>

                <span>
                    Mis categorías
                </span>

            </button>

            <button class="
                w-full
                text-left
                px-3
                py-2
                rounded-lg
                hover:bg-gray-100
                transition
                flex
                items-center
                gap-2
                disabled:opacity-50
            " :disabled="cargandoReporte" @click="generarReporteCatalogo">

                <i class="
                    fa
                    fa-file-pdf-o
                    text-purple-600
                ">
                </i>

                <span>
                    {{ cargandoReporte ? 'Generando PDF...' : 'Reporte Catálogo' }}
                </span>

            </button>

            <button class="w-full text-white py-2 rounded-md bg-red-500 mt-2" @click="close">

                Cerrar

            </button>

        </div>

    </div>

</template>

<script setup>

import { ref, nextTick } from 'vue'
import gsap from 'gsap'
import axios from 'axios'
import { firma } from '../../../../../services/security.js'
import { useUsuario } from '../../../../../services/usuarioService.js'

const visible = ref(false)
const box = ref(null)
const cargandoReporte = ref(false)

const { getNegId } = useUsuario()

const emit = defineEmits([
    'categoria-created',
    'mis-categorias'
])

function open() {
    visible.value = true

    nextTick(() => {
        gsap.fromTo(
            box.value,
            { scale: 0.7, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
        )
    })
}

function abrirNuevaCategoria() {
    close()
    emit('categoria-created')
}

function abrirMisCategorias() {
    close()
    emit('mis-categorias')
}

/* ======================================
🔥 SOLICITAR Y ABRIR REPORTE PDF DESDE EL BACKEND
====================================== */

async function generarReporteCatalogo() {
    try {
        cargandoReporte.value = true

        const seguridad = firma() // Inyecta xin y yuan para la firma de seguridad
        const neg_id = getNegId() || 8

        // Petición POST enviando neg_id y firma de seguridad
        const res = await axios.post('/crear_catalogo', {
            neg_id: neg_id,
            xin: seguridad.xin,
            yuan: seguridad.yuan
        })

        if (res.data?.status === 'ok' && res.data?.url) {
            // Abre la URL directa del PDF generado por WkHtmlToPdf en una pestaña nueva
            window.open(res.data.url, '_blank')
            close()
        } else {
            console.error('Error al generar el catálogo:', res.data?.msg)
        }
    } catch (e) {
        console.error('Error enviando solicitud de reporte:', e)
    } finally {
        cargandoReporte.value = false
    }
}

function close() {
    gsap.to(box.value, {
        scale: 0.7,
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
            visible.value = false
        }
    })
}

defineExpose({ open })

</script>