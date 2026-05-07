<template>
    <div class="min-h-screen" :style="fondoStyle">

        <NegpresHeader />

        <div class="content-container">

            <SectionTitle title="Tus productos favoritos 💛" />

            <!-- GRID -->
            <FavoritesGrid :productos="favoritos" @eliminar="handleEliminar" />

            <!-- VACÍO -->
            <EmptyState v-if="favoritos.length === 0" />

        </div>

        <!-- 🔥 TOAST -->
        <GsapToast ref="toastRef" />

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUsuario } from '../../../../services/usuarioService.js'

import NegpresHeader from '../../../../components/layout/NegpresHeaderBack.vue'
import FavoritesGrid from './components/FavoritesGrid.vue'
import SectionTitle from './components/SectionTitle.vue'
import EmptyState from './components/EmptyState.vue'
import GsapToast from '../../../../components/layout/GsapToast.vue'
import { computed } from 'vue'
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'

/* =========================
   STATE
========================= */

const favoritos = ref([])
const toastRef = ref(null)

/* =========================
   USUARIO
========================= */

const { usuario } = useUsuario()

const { mercado } = useMercado()

const fondoStyle = computed(() => {

    if (!mercado.value?.patron_fondo) return {}

    return cssToObject(mercado.value.patron_fondo)

})

/* =========================
   CARGAR FAVORITOS
========================= */

async function cargarFavoritos() {

    const usu_id = usuario.value?.user?.usu_id

    if (!usu_id) {

        showToast({
            text: 'Debes iniciar sesión ❌',
            type: 'error'
        })

        return
    }

    try {

        const res = await fetch(
            `${import.meta.env.VITE_PUBLIC_URL_BASE}/DzCy/misFavoritos`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usu_id })
            }
        )

        const data = await res.json()

        if (data.status === 'ok') {

            favoritos.value = data.data.map(p => ({
                fav_id: p.fav_id,
                product_id: p.product_id,
                name: p.name,
                price: p.price,
                stock: p.stock,
                img: p.img,
                descuento: 10
            }))

        } else {

            showToast({
                text: data.msg || 'Error al cargar favoritos ❌',
                type: 'error'
            })

        }

    } catch (err) {

        showToast({
            text: 'Error de conexión ❌',
            type: 'error'
        })

    }
}

/* =========================
   ELIMINAR FAVORITO
========================= */

async function handleEliminar(fav_id) {

    try {

        const res = await fetch(
            `${import.meta.env.VITE_PUBLIC_URL_BASE}/DzCy/eliminarFavoritos`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fav_id })
            }
        )

        const data = await res.json()

        if (data.status === 'ok') {

            favoritos.value = favoritos.value.filter(f => f.fav_id !== fav_id)

            showToast({
                text: 'Eliminado de favoritos ❌',
                type: 'success'
            })

        } else {

            showToast({
                text: data.msg || 'Error al eliminar ❌',
                type: 'error'
            })

        }

    } catch (err) {

        showToast({
            text: 'Error de conexión ❌',
            type: 'error'
        })

    }
}

/* =========================
   TOAST
========================= */

function showToast(payload) {
    toastRef.value?.show(payload)
}

/* =========================
   INIT
========================= */

onMounted(() => {
    cargarFavoritos()
})
</script>

<style scoped>
.content-container {
    max-width: 1400px;
    margin: auto;
    padding: 20px;
}
</style>