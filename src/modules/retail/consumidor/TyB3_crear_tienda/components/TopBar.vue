<template>

  <div class="
        h-[72px]

        bg-white/90
        backdrop-blur-xl

        border-b
        border-white/40

        flex
        flex-col

        items-center
        justify-center
py-5
        px-4

        shrink-0
    ">

    <!-- TITULO -->
    <div class="
            text-[22px]
            font-black
            text-gray-800
            text-center
        ">

      Crear tu tienda virtual

    </div>


  </div>

</template>

<script setup>

import {
  ref,
  onMounted
}
  from 'vue'

import gsap from 'gsap'

const logoRef = ref(null)

onMounted(() => {

  gsap.to(

    logoRef.value,

    {

      y: -10,

      duration: 2,

      repeat: -1,

      yoyo: true,

      ease: 'sine.inOut'

    }

  )

})

</script>