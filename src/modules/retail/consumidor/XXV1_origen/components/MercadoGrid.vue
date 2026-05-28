<template>

    <div ref="gridRef" class="
            flex-1

            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5

            gap-4

            px-3

            overflow-y-auto

            no-scrollbar
        " style="
            max-height:
                calc(100vh - 160px);
        ">

        <div v-for="m in mercados" :key="m.mercado_id" class="card-item">

            <MercadoCard :mercado="m" />

        </div>

    </div>

</template>

<script setup>

import MercadoCard
    from './MercadoCard.vue'

import {
    ref,
    watch,
    nextTick
}
    from 'vue'

import {
    gsap
}
    from 'gsap'

const gridRef =
    ref(null)

const props =
    defineProps({

        mercados: Array

    })

watch(

    () => props.mercados,

    async () => {

        await nextTick()

        const items =
            gridRef.value?.querySelectorAll(
                '.card-item'
            )

        if (!items) {
            return
        }

        gsap.fromTo(

            items,

            {

                x: -50,

                opacity: 0,

                rotate: -5

            },

            {

                x: 0,

                opacity: 1,

                rotate: 0,

                duration: 0.5,

                stagger: 0.05,

                ease: "power2.out"

            }

        )

    }

)

</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {

    display: none;

}

.no-scrollbar {

    scrollbar-width: none;

}
</style>