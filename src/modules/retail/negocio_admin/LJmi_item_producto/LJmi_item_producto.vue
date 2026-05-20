<!-- =========================================
FILE:
src/modules/LJmi_item_producto/LJmi_item_producto.vue
========================================= -->

<template>

    <div class="min-h-screen" :style="patternStyle">
        <HeaderBar />

        <div class="px-4 py-6 flex justify-center">

            <div class="
                    w-full
                    max-w-md
                    lg:max-w-3xl
                ">

                <div class="
                        bg-white
                        rounded-[20px]
                        shadow-[0_8px_20px_rgba(0,0,0,0.08)]
                        p-5
                    ">

                    <ProductoForm />

                </div>

            </div>

        </div>

    </div>

</template>

<script setup>

import HeaderBar
    from './components/HeaderBar.vue'

import ProductoForm
    from './components/ProductoForm.vue'

const patternStyle = {

    backgroundColor: '#e5e5f7',

    backgroundImage: `
        linear-gradient(135deg,#FCCBB5 25%,transparent 25%),
        linear-gradient(225deg,#FCCBB5 25%,transparent 25%),
        linear-gradient(45deg,#FCCBB5 25%,transparent 25%),
        linear-gradient(315deg,#FCCBB5 25%,#e5e5f7 25%)
    `,

    backgroundPosition:
        '10px 0,10px 0,0 0,0 0',

    backgroundSize:
        '20px 20px',

    backgroundRepeat:
        'repeat'

}

</script>