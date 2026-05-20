<template>

    <div class="min-h-screen flex flex-col pt-20" :style="fondoStyle">

        <HeaderBar @openOptions="openDialog" @openNuevoCliente="openNuevoClienteDialog" />

        <div class="flex-1 flex justify-center p-4">

            <div class="w-full max-w-md md:max-w-4xl space-y-3">

                <SearchBar v-model="buscar" />

                <ClientePills v-model="filtroLetra" />

                <ClienteItem v-for="c in filtrados" :key="c.id" :item="c" @edit="openClienteOptions" />

            </div>

        </div>

        <OptionsDialog ref="dialogRef" />
        <NuevoClienteDialog ref="nuevoClienteDialogRef" @created="cargarClientes" />
        <ClienteOptionsDialog ref="clienteOptionsRef" @edit="editarCliente" @deuda="openDeudaDialog" />
        <DeudaDialog ref="deudaDialogRef" />

    </div>

</template>

<script setup>

import {
    ref,
    computed,
    onMounted
} from 'vue'
import NuevoClienteDialog
    from './components/NuevoClienteDialog.vue'
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

import ClientePills
    from './components/ClientePills.vue'

import ClienteOptionsDialog
    from './components/ClienteOptionsDialog.vue'
import {
    firma
}
    from '../../../../services/security'

import DeudaDialog
    from './components/DeudaDialog.vue'

const API =
    import.meta.env.VITE_PUBLIC_URL_BASE

const {
    mercado
} = useMercado()

const {
    getNegId
} = useUsuario()

const filtroLetra =
    ref(null)

const clienteOptionsRef =
    ref(null)

const deudaDialogRef =
    ref(null)

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

const nuevoClienteDialogRef =
    ref(null)

function openNuevoClienteDialog() {

    nuevoClienteDialogRef.value?.open()

}

/* ======================================
   🔍 FILTRADOS
====================================== */

const filtrados =
    computed(() => {

        let lista =
            clientes.value

        /* ======================================
           💸 POR PAGAR
        ====================================== */

        if (
            filtroLetra.value
            ===
            'POR_PAGAR'
        ) {

            lista =
                lista.filter(c =>

                    !!c.por_pagar

                )

        }

        /* ======================================
           ❤️ FAVORITOS
        ====================================== */

        else if (
            filtroLetra.value
            ===
            'FAVORITOS'
        ) {

            lista = []

        }

        /* ======================================
           🔠 LETRA
        ====================================== */

        else if (
            filtroLetra.value
        ) {

            lista =
                lista.filter(c => {

                    const nombre =

                        String(
                            c.nombre || ''
                        )
                            .trim()
                            .toUpperCase()

                    return nombre.startsWith(
                        filtroLetra.value
                    )

                })

        }

        /* ======================================
           🔎 SEARCH
        ====================================== */

        if (buscar.value) {

            lista =
                lista.filter(c =>

                    (c.nombre || '')
                        .toLowerCase()
                        .includes(
                            buscar.value.toLowerCase()
                        )

                )

        }

        return lista

    })

function openDeudaDialog(
    cliente
) {

    deudaDialogRef.value?.open(
        cliente
    )

}
/* ======================================
   📦 CARGAR CLIENTES
====================================== */

async function cargarClientes() {

    try {

        /* ======================================
           🔐 FIRMA
        ====================================== */

        const seguridad =
            firma()

        /* ======================================
           🚀 REQUEST
        ====================================== */

        const r = await axios.post(

            `${API}/FjeU/clienteListar`,

            {

                neg_id:
                    getNegId(),

                xin:
                    seguridad.xin,

                yuan:
                    seguridad.yuan

            }

        )

        /* ======================================
           ✅ OK
        ====================================== */

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

function editarCliente(cliente) {

    nuevoClienteDialogRef.value?.open(
        cliente
    )

}

function openClienteOptions(
    cliente
) {

    clienteOptionsRef.value?.open(
        cliente
    )

}
/* ======================================
   🚀 INIT
====================================== */

onMounted(() => {

    cargarClientes()

})

</script>