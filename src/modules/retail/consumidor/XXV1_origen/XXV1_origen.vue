<template>

    <div class="xxv1-bg min-h-screen pt-20">

        <HeaderBar @openOptions="openDialog" @openNuevoCliente="openNuevoClienteDialog" />

        <div class="content-container">

            <SearchBar />

            <div class="flex mt-4">

                <CatSidebar :categorias="categorias" :active="activeIndex" @change="setCategoria" />

                <MercadoGrid :mercados="mercadosFiltrados" />

            </div>

        </div>

    </div>

</template>

<script setup>

import {
    ref,
    computed,
    onMounted
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

onMounted(() => {

    loadData()

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

        return (
            cat?.lista_mercado
            ||
            []
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

    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 40px;

}
</style>