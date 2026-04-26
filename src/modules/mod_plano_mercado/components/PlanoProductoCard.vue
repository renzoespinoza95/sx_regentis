<template>
  <div class="min-w-[140px]">
    <div class="bg-white rounded-2xl shadow-md overflow-hidden border">
      <img :src="img" class="w-full h-24 object-cover" />
      <div class="p-3">
        <div class="text-sm font-semibold text-gray-800 leading-tight">
          {{ title }}
        </div>
        <div class="mt-2 flex items-center gap-2">
          <span class="bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            S/ {{ price }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  price: { type: String, default: '' },
  img: { type: String, default: '' }
})
</script>