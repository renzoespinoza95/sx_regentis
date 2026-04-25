<script setup>
import { ref } from 'vue'

const qty = ref(1)

function plus() {
  qty.value++
}

function minus() {
  if (qty.value > 1) qty.value--
}
</script>

<template>
  <div class="min-h-screen bg-[#F2F2F2] relative overflow-hidden">

    <!-- =========================
         TOP GREEN AREA
    ========================== -->
<!-- =========================
     TOP AREA
========================== -->
<div class="absolute top-0 left-0 w-full h-[220px] relative">

  <svg
    class="absolute top-0 left-1/2 -translate-x-1/2 w-[160%] h-[220px]"
    viewBox="0 0 1400 400"
    preserveAspectRatio="none"
  >
    <!-- Verde recto arriba -->
    <rect width="1400" height="200" fill="#9BE000" />

    <!-- Arco hacia abajo -->
    <path
      d="M0,200 C350,350 1050,350 1400,200 L1400,0 L0,0 Z"
      fill="#9BE000"
    />
  </svg>

</div>



    <!-- =========================
         HEADER ICONS
    ========================== -->
    <div class="absolute top-0 left-0 right-0 flex justify-between items-center px-4 pt-4 text-white z-20">
      <i class="fa fa-arrow-left text-lg"></i>
      <i class="fa fa-heart-o text-lg"></i>
    </div>

    <!-- =========================
         PROFILE IMAGE
    ========================== -->
<div class="relative z-10 flex justify-center -mt-24">
  <div class="bg-white p-2 rounded-full shadow-xl">
    <img
      src="https://picsum.photos/300"
      class="w-32 h-32 rounded-full object-cover"
    />
  </div>
</div>


    <!-- =========================
         CONTENT
    ========================== -->
    <div class="relative z-10 px-5 pb-24">

      <!-- TITLE -->
      <div class="text-center mt-4">
        <h1 class="text-lg font-semibold text-gray-800">
          Chicken salad
        </h1>

        <p class="text-gray-500 text-xs mt-1 flex items-center justify-center gap-2">
          <i class="fa fa-fire"></i>
          198 cal · 300 g
        </p>
      </div>

      <!-- PRICE CAPSULE -->
      <div class="flex justify-center mt-5">
        <div class="flex items-center gap-6 bg-[#E5E5E5] rounded-full px-6 py-2 shadow-inner">

          <span class="text-sm font-semibold text-gray-800">
            $5.60
          </span>

          <div class="flex items-center gap-4">
            <button @click="minus">
              <i class="fa fa-minus text-gray-700 text-xs"></i>
            </button>

            <span class="text-gray-800 text-sm">
              {{ qty }}
            </span>

            <button @click="plus">
              <i class="fa fa-plus text-gray-700 text-xs"></i>
            </button>
          </div>

        </div>
      </div>

      <!-- INGREDIENTS -->
      <div class="mt-8">
        <h2 class="text-sm font-semibold text-gray-800">
          Ingredients
        </h2>

        <div class="flex gap-3 mt-3">
          <img src="https://picsum.photos/40?1" class="w-10 h-10 rounded-xl object-cover" />
          <img src="https://picsum.photos/40?2" class="w-10 h-10 rounded-xl object-cover" />
          <img src="https://picsum.photos/40?3" class="w-10 h-10 rounded-xl object-cover" />
          <img src="https://picsum.photos/40?4" class="w-10 h-10 rounded-xl object-cover" />
          <img src="https://picsum.photos/40?5" class="w-10 h-10 rounded-xl object-cover" />
        </div>
      </div>

      <!-- DESCRIPTION -->
      <div class="mt-6">
        <h2 class="text-sm font-semibold text-gray-800">
          Description
        </h2>

        <p class="text-gray-500 text-xs mt-2 leading-relaxed">
          The combination of fresh and juicy vegetables gives this salad an invigorating flavor.
          Chicken fillet marinated in lemon juice with various herbs has an unusual piquant taste.
        </p>
      </div>

    </div>

    <!-- FLOATING BUTTON -->
    <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
      <button
        class="w-12 h-12 bg-[#9BE000] rounded-full shadow-xl
               flex items-center justify-center text-white text-lg
               active:scale-95 transition"
      >
        <i class="fa fa-plus"></i>
      </button>
    </div>

  </div>
</template>
