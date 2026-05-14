<template>

    <div class="min-h-screen flex flex-col pt-20" :style="fondoStyle">

        <HeaderBar @openOptions="openDialog" />

        <div class="flex-1 flex justify-center p-4">

            <div class="w-full max-w-md md:max-w-4xl space-y-3">

                <SearchBar v-model="buscar" />

                <ClienteItem v-for="c in filtrados" :key="c.id" :item="c" />

            </div>

        </div>

        <OptionsDialog ref="dialogRef" />

    </div>

</template>

<script setup>

import {
    ref,
    computed,
    onMounted
} from 'vue'

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

import ClienteItem
    from './components/ClienteItem.vue'

import OptionsDialog
    from './components/OptionsDialog.vue'

const API =
    import.meta.env.VITE_PUBLIC_URL_BASE

const {
    mercado
} = useMercado()

const {
    getNegId
} = useUsuario()

/* ======================================
   🎨 FONDO
====================================== */

const fondoStyle = computed(() => {

    if (!mercado.value?.patron_fondo)
        return {}

    return cssToObject(
        mercado.value.patron_fondo
    )

})

/* ======================================
   🔥 DIALOG
====================================== */

const dialogRef = ref(null)

function openDialog() {

    dialogRef.value.open()

}

/* ======================================
   🔍 SEARCH
====================================== */

const buscar = ref('')

/* ======================================
   👥 CLIENTES
====================================== */

const clientes = ref([])

/* ======================================
   🔍 FILTRADOS
====================================== */

const filtrados = computed(() => {

    if (!buscar.value) {

        return clientes.value

    }

    return clientes.value.filter(c =>

        (c.nombre || '')
            .toLowerCase()
            .includes(
                buscar.value.toLowerCase()
            )

    )

})

/* ======================================
   📦 CARGAR CLIENTES
====================================== */

async function cargarClientes() {

    try {

        const r = await axios.post(

            `${API}/FjeU/clienteListar`,

            {
                neg_id:
                    getNegId()
            }

        )

        if (r.data.status === 'ok') {

            clientes.value =
                r.data.data || []

        }

    } catch (e) {

        console.error(
            'Error cargando clientes',
            e
        )

    }

}

/* ======================================
   🚀 INIT
====================================== */

onMounted(() => {

    cargarClientes()

})

</script>