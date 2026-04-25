<template>
  <div class="flex items-center justify-between">

    <div class="flex items-center gap-3">
      <img :src="img" class="w-16 h-16 rounded-xl object-cover" />

      <div>
        <h3 class="font-medium">
          {{ title }}
        </h3>

        <p class="text-gray-500 text-sm">
          ${{ price }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2">

      <button class="w-7 h-7 border rounded-full text-xs flex items-center justify-center">
        <i class="fa fa-minus"></i>
      </button>

      <span class="text-sm">01</span>

      <button class="w-7 h-7 bg-[#FD7635] text-white rounded-full text-xs flex items-center justify-center">
        <i class="fa fa-plus"></i>
      </button>

    </div>

  </div>
</template>

<script setup>
defineProps({
  title: String,
  price: String,
  img: String
})
</script>