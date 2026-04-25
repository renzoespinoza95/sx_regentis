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
                @focus="$emit('focus')"
                @blur="$emit('blur')"
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
              @mousedown="$emit('selectSuggestion', s)"
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

      <!-- 🔵 DROPDOWN PUESTOS -->
      <div class="mt-3">
        <select
          v-model="selectedPuesto"
          @change="emitPuesto"
          class="w-full bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-sm"
        >
          <option disabled value="">Seleccionar puesto (1 - 44)</option>
          <option
            v-for="n in 44"
            :key="n"
            :value="n"
          >
            Puesto {{ n }}
          </option>
        </select>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: { type: String, default: '' },
  showSuggestions: { type: Boolean, default: false },
  suggestions: { type: Array, default: () => [] }
})

const emit = defineEmits([
  'update:modelValue',
  'selectSuggestion',
  'cancel',
  'selectPuesto',
  'focus',
  'blur'
])

const selectedPuesto = ref('')

function emitPuesto() {
  if (!selectedPuesto.value) return
  emit('selectPuesto', selectedPuesto.value)
}
</script>