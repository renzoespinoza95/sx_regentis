<template>

    <div class="xxv1-bg min-h-screen pt-20">

        <HeaderBar @openOptions="openDialog" @openNuevoCliente="openNuevoClienteDialog" />

        <div class="content-container">

            <SearchBar v-model="search" />

            <div class="flex mt-4">

                <CatSidebar :categorias="categorias" :active="activeIndex" @change="setCategoria" />

                <div class="flex-1">

                    <MercadoGrid v-if="mercadosFiltrados.length" :mercados="mercadosFiltrados" />

                    <EmptyLetter v-else titulo="Sin resultados" texto="No encontramos mercados con ese nombre 😕" />

                </div>

            </div>

        </div>

    </div>
    <PromoApkModal ref="promoApkModalRef" />

</template>

<script setup>
import {
    ref,
    computed,
    onMounted,
    watch
}
    from 'vue'

import {
    useRoute,
    useRouter
}
    from 'vue-router'

import axios from 'axios'

import HeaderBar
    from './components/HeaderBar.vue'

import CatSidebar
    from './components/CatSidebar.vue'

import MercadoGrid
    from './components/MercadoGrid.vue'

import SearchBar
    from './components/SearchBar.vue'

import {
    setMercadoId
}
    from '../../../../services/usePrincipal.js'
import EmptyLetter
    from '../../../../components/layout/EmptyLetter.vue'
import PromoApkModal
    from '../../../reg_principal/components/PromoApkModal.vue'
import {
    useUsuario
}
    from '../../../../services/usuarioService.js'

/* =========================================
   🔥 DATA
========================================= */

const lista =
    ref([])

const activeCatId =
    ref(0)


const route =
    useRoute()

const router =
    useRouter()

const promoApkModalRef =
    ref(null)

const search =
    ref('')

const {
    isLogged
} = useUsuario()
/* =========================================
   🔥 FETCH
========================================= */

async function loadData() {

    try {

        const res =
            await axios.post(

                `${import.meta.env.VITE_PUBLIC_URL_BASE}/NE5F/origen`

            )

        lista.value =
            res.data?.data
            ||
            []

        /* =========================================
           🔥 AUTO SELECT
        ========================================= */

        if (lista.value.length) {

            activeCatId.value =
                lista.value[0].cat_mercado_id

        }

        /* =========================================
           🔥 AUTO ENTRAR POR URL
        ========================================= */

        const mercado_id =
            Number(
                route.params.mercado_id
            )

        if (
            mercado_id > 0
        ) {

            console.log(
                '🚀 AUTO MERCADO:',
                mercado_id
            )

            /* =========================================
               🔥 SAVE
            ========================================= */

            setMercadoId(
                mercado_id
            )

            /* =========================================
               🔥 CLEAR CACHE
            ========================================= */

            localStorage.removeItem(
                'regentis_principal_cache'
            )

            /* =========================================
               🔥 GO
            ========================================= */

            router.replace(
                '/principal'
            )

        }

    } catch (err) {

        console.error(
            'Error cargando origen',
            err
        )

    }

}

onMounted(async () => {

    await loadData()

    if (!isLogged.value) {

        setTimeout(() => {

            promoApkModalRef.value?.open()

        }, 500)

    }

})
/* =========================================
   🔥 CATEGORIAS
========================================= */

const categorias =
    computed(() => {

        return lista.value

    })

/* =========================================
   🔥 ACTIVE INDEX
========================================= */

const activeIndex =
    computed(() => {

        return categorias.value.findIndex(

            c =>

                Number(c.cat_mercado_id)

                ===

                Number(activeCatId.value)

        )

    })

/* =========================================
   🔥 MERCADOS
========================================= */

const mercadosFiltrados =
    computed(() => {

        const cat =
            categorias.value.find(

                x =>

                    Number(x.cat_mercado_id)

                    ===

                    Number(activeCatId.value)

            )

        const listaMercados =
            cat?.lista_mercado
            ||
            []

        const texto =
            search.value
                .trim()
                .toLowerCase()

        if (texto.length < 3) {

            return listaMercados

        }

        return listaMercados.filter(

            m =>

                String(
                    m.nombre || ''
                )
                    .toLowerCase()
                    .includes(texto)

                ||

                String(
                    m.ciudad || ''
                )
                    .toLowerCase()
                    .includes(texto)

                ||

                String(
                    m.departamento || ''
                )
                    .toLowerCase()
                    .includes(texto)

        )

    })

/* =========================================
   🔥 CAMBIAR
========================================= */

function setCategoria(index) {

    const cat =
        categorias.value[index]

    if (!cat) {
        return
    }

    activeCatId.value =
        cat.cat_mercado_id

}

</script>
<style scoped>
/* =========================================
   🔥 FONDO PRINCIPAL
========================================= */

.xxv1-bg {

    background-color: #6d1025;

    background-image:

        linear-gradient(45deg,
            rgba(255, 255, 255, 0.05) 25%,
            transparent 25%,
            transparent 75%,
            rgba(255, 255, 255, 0.05) 75%,
            rgba(255, 255, 255, 0.05)),

        linear-gradient(45deg,
            rgba(255, 255, 255, 0.035) 25%,
            transparent 25%,
            transparent 75%,
            rgba(255, 255, 255, 0.035) 75%,
            rgba(255, 255, 255, 0.035)),

        linear-gradient(180deg,
            rgba(255, 255, 255, 0.03),
            rgba(0, 0, 0, 0.08));

    background-size:
        34px 34px,
        34px 34px,
        100% 100%;

    background-position:
        0 0,
        17px 17px,
        0 0;

}

/* =========================================
   🔥 CONTENT
========================================= */

.content-container {

    width: 100%;

    max-width: 1600px;

    margin: auto;

    padding-bottom: 80px;
    padding-left: 2px;
    padding-right: 2px;

}
</style>