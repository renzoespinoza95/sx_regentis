<template>
  <div
    class="absolute z-30"
    :style="style"
  >
    <div class="bg-white rounded-2xl shadow-xl w-56 overflow-hidden border">
      <button
        class="w-full flex items-center justify-between px-3 py-2 bg-orange-50"
        @click="$emit('close')"
        title="Cerrar"
      >
        <div class="flex items-center gap-2">
          <span class="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center">
            <i class="fa fa-map-marker"></i>
          </span>
          <div class="text-left">
            <div class="text-sm font-semibold text-gray-800">{{ stall.name }}</div>
            <div class="text-xs text-gray-500">{{ stall.subtitle }}</div>
          </div>
        </div>
        <i class="fa fa-angle-right text-gray-400"></i>
      </button>

      <div class="px-3 py-2 text-xs text-gray-500">
        Toca para ver productos
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stall: { type: Object, required: true },
  style: { type: Object, default: () => ({}) }
})
defineEmits(['close'])
</script>