<template>

    <div class="min-h-screen flex flex-col pt-20" :style="fondoStyle">

        <HeaderBar @openNuevoTrabajador="openNuevoTrabajadorDialog" @openOptions="openOptionsDialog" />

        <!-- CONTENIDO -->
        <div class="flex-1 flex justify-center p-4">

            <div class="w-full max-w-md md:max-w-4xl space-y-3">

                <SearchBar v-model="buscar" />

                <!-- LISTA -->
                <div class="space-y-3">

                    <WorkerItem v-for="item in filtrados" :key="item.id" :item="item" />

                </div>

            </div>

        </div>

    </div>
    <NuevoTrabajadorDialog ref="nuevoTrabajadorDialogRef" @created="cargarTrabajadores" />
    <OptionsDialog ref="dialogRef" />
</template>
<script setup>

import {
    ref,
    computed,
    onMounted
} from 'vue'

import NuevoTrabajadorDialog
    from './components/NuevoTrabajadorDialog.vue'

import axios from 'axios'

import {
    useMercado
} from '../../../../services/useMercado.js'

import {
    cssToObject
} from '../../../../services/useCss.js'

import {
    useUsuario
} from '../../../../services/usuarioService.js'

import HeaderBar
    from './components/HeaderBar.vue'

import SearchBar
    from './components/SearchBar.vue'

import WorkerItem
    from './components/WorkerItem.vue'

import OptionsDialog
    from './components/OptionsDialog.vue'

/* ======================================
   🔥 API
====================================== */

const API =
    import.meta.env.VITE_PUBLIC_URL_BASE

/* ======================================
   🔥 MERCADO
====================================== */

const {
    mercado
} = useMercado()

/* ======================================
   🔥 USUARIO
====================================== */

const {
    getNegId
} = useUsuario()

/* ======================================
   🔥 FONDO
====================================== */

const fondoStyle = computed(() => {

    if (!mercado.value?.patron_fondo)
        return {}

    return cssToObject(
        mercado.value.patron_fondo
    )

})

const nuevoTrabajadorDialogRef =
    ref(null)

function openNuevoTrabajadorDialog() {

    nuevoTrabajadorDialogRef.value?.open()

}

const dialogRef =
    ref(null)

function openOptionsDialog() {

    dialogRef.value?.open()

}

/* ======================================
   🔍 SEARCH
====================================== */

const buscar = ref('')

/* ======================================
   👥 TRABAJADORES
====================================== */

const trabajadores = ref([])

/* ======================================
   🔍 FILTRO
====================================== */

const filtrados = computed(() => {

    if (!buscar.value) {

        return trabajadores.value

    }

    return trabajadores.value.filter(t =>

        (
            t.nombres_apellidos ||
            t.sobrenombre ||
            ''
        )
            .toLowerCase()
            .includes(
                buscar.value.toLowerCase()
            )

    )

})

/* ======================================
   📦 CARGAR
====================================== */

async function cargarTrabajadores() {

    try {

        const r = await axios.post(

            `${API}/N3GT/contactosNeg`,

            {
                neg_id:
                    getNegId()
            }

        )

        if (r.data.status === 'ok') {

            trabajadores.value =
                r.data.data || []

        }

    } catch (e) {

        console.error(
            'Error cargando trabajadores',
            e
        )

    }

}

/* ======================================
   🚀 INIT
====================================== */

onMounted(() => {

    cargarTrabajadores()

})

</script>