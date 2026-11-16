<template>
    <div v-if="sugerencias.length > 0 && query.trim() !== ''"
        class="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto z-[100] no-scrollbar divide-y divide-gray-50">
        <button v-for="p in sugerencias" :key="p.product_id" type="button" @click="seleccionarProducto(p.product_id)"
            class="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-orange-50/50 active:bg-orange-50 transition flex items-center gap-2 font-medium">
            🔍
            <span class="line-clamp-1 flex-1">
                {{ p.name }}
                <span v-if="p.cod_producto" class="italic ml-1" style="color: #FD7635;">
                    ({{ p.cod_producto }})
                </span>
            </span>
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
    query: {
        type: String,
        default: ''
    },
    productos: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['clear'])
const router = useRouter()

/* ============================================================
    🔥 FUNCIÓN PARA NORMALIZAR TEXTO (Remueve tildes de forma limpia)
============================================================ */
function limpiarTexto(str) {
    return String(props.query || '')
        .normalize('NFD') // Descompone los caracteres combinados
        .replace(/[\u0300-\u036f]/g, '') // Elimina los acentos y tildes
        .toLowerCase()
        .trim();
}

// Filtrar los productos ignorando mayúsculas y acentos (buscando por nombre o código)
const sugerencias = computed(() => {
    const txt = limpiarTexto(props.query)
    if (!txt) return []

    return props.productos.filter(p => {
        if (!p.name) return false

        const nombreProducto = String(p.name)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

        const codigoProducto = String(p.cod_producto || '').toLowerCase();

        return nombreProducto.includes(txt) || codigoProducto.includes(txt)
    }).slice(0, 10) // Mantenemos el límite de 10 por rendimiento
})

function seleccionarProducto(productId) {
    emit('clear')
    router.push(`/QZMq_detalle_prod/${productId}`)
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    scrollbar-width: none;
}
</style>