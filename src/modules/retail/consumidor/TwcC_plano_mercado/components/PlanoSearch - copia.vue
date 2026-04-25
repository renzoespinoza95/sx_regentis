<template>
  <div class="bg-white">
    <div class="px-4 pb-3">
      <div class="flex items-center gap-2">
        <div class="flex-1 relative">

          <div class="bg-gray-100 rounded-xl px-3 py-2 flex items-center gap-2">
            <i class="fa fa-search text-gray-400"></i>
            <input
              :value="modelValue"
              @input="$emit('update:modelValue', $event.target.value)"
              type="text"
              placeholder="Buscar negocio..."
              class="bg-transparent outline-none w-full text-sm"
            />
          </div>

          <!-- SUGERENCIAS -->
          <div
            v-if="showSuggestions"
            class="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden z-40"
          >
            <button
              v-for="s in suggestions.slice(0, 10)"
              :key="s.id"
              class="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"
              @click="$emit('selectSuggestion', s)"
            >
              <div class="font-semibold text-sm text-gray-800">{{ s.name }}</div>
              <div class="text-xs text-gray-500">{{ s.subtitle }}</div>
            </button>
          </div>

        </div>

        <button
          class="text-sm text-gray-600 px-2"
          @click="$emit('cancel')"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  showSuggestions: { type: Boolean, default: false },
  suggestions: { type: Array, default: () => [] }
})

defineEmits(['update:modelValue', 'selectSuggestion', 'cancel'])
</script>