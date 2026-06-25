<template>

    <div class="
        min-h-screen
        flex
        items-center
        justify-center
    ">

        <div class="
            text-center
            text-gray-500
        ">

            Cargando tienda...

        </div>

    </div>

</template>

<script setup>

import {

    onMounted

}
    from 'vue'

import {

    useRoute,

    useRouter

}
    from 'vue-router'

import axios
    from 'axios'

const route =
    useRoute()

const router =
    useRouter()

onMounted(

    async () => {

        try {

            const slug =

                route.params.slug

            if (

                !slug

            ) {

                router.replace(
                    '/mod_404'
                )

                return

            }

            const r =

                await axios.post(

                    '/negocio/buscar_slug',

                    {

                        slug

                    }

                )

            if (

                r.data?.status !== 'ok'

            ) {

                router.replace(
                    '/mod_404'
                )

                return

            }

            router.replace(

                `/CV2K_negocio/${r.data.neg_id

                }`

            )

        }

        catch (

        e

        ) {

            console.error(
                e
            )

            router.replace(
                '/mod_404'
            )

        }

    }

)

</script>
