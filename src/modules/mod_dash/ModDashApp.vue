<template>

    <div class="min-h-screen" :style="fondoStyle">

        <!-- NAVBAR -->
        <RegHeader />

        <!-- CONTENIDO -->
        <div class="content-container">

            <DashScreenList :screens="screens" :titulo="tipoDescripcion" />

        </div>

    </div>

</template>

<script setup>

import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

import RegHeader from '../../../reg_principal/components/RegHeader.vue'
import DashScreenList from './components/DashScreenList.vue'

import { useUsuario } from '../../../../services/usuarioService.js'

// 🔥 IMPORTS CONSISTENTES
import { useMercado } from '../../../../services/useMercado.js'
import { cssToObject } from '../../../../services/useCss.js'

const router = useRouter()
const { usuario } = useUsuario()

const screens = ref([])

// =========================
// 🔥 FONDO DINÁMICO
// =========================

const { mercado } = useMercado()

const fondoStyle = computed(() => {

    if (!mercado.value?.patron_fondo) {
        return {}
    }

    return cssToObject(mercado.value.patron_fondo)

})

// =========================
// INIT
// =========================

onMounted(() => {

    // 🔥 VALIDAR LOGIN
    if (!usuario.value || !usuario.value.user) {

        router.replace('/login')
        return
    }

    // ✅ cargar screens
    screens.value = usuario.value.screens || []

})

const tipoDescripcion = computed(() => {
    const u = usuario.value?.user

    return (
        u?.tipoxusu_descripcion ||
        u?.tipoxusu?.descripcion ||
        'Tus módulos'
    )
})
</script>

<style scoped>
.content-container {
    width: 100%;
    max-width: 1400px;
    margin: auto;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 40px;
}
</style>