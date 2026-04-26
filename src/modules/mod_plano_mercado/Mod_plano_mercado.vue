<template>
  <div :class="wrapperClass">
    <div :class="containerClass" class="bg-gray-100 relative">

      <HeaderBar v-model="search" @selectPuesto="handlePuestoSeleccionado" />

      <PlanoMapa ref="planoMapaRef" :selected="selected" :markers="markers" :destino="destino"
        @selectMarker="onSelectMarker" @closePopup="closePopup" />

      <!-- 🔥 FAB Negocio Seleccionado -->
      <div v-if="selected" class="absolute bottom-24 right-6 z-50">
        <button @click="sheetOpen = true"
          class="bg-white shadow-xl rounded-2xl px-4 py-3 text-left border border-gray-200 active:scale-95 transition">
          <div class="font-semibold text-sm text-gray-800">
            {{ selected.name }}
          </div>
          <div class="text-xs text-gray-500">
            {{ selected.subtitle }}
          </div>
        </button>
      </div>

      <PlanoBottomSheet :open="sheetOpen" :stall="selected" @close="closeSheet" />

      <!-- 🔥 FAB Reset Center -->
      <button @click="resetMap"
        class="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-orange-500 text-white shadow-lg flex items-center justify-center text-2xl z-50 active:scale-95 transition">
        ⌖
      </button>

    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import HeaderBar from './components/HeaderBar.vue'
import PlanoHeader from './components/PlanoHeader.vue'
import PlanoSearch from './components/PlanoSearch.vue'
import PlanoMapa from './components/PlanoMapa.vue'
import PlanoBottomSheet from './components/PlanoBottomSheet.vue'
import { watch } from 'vue'

const planoMapaRef = ref(null)

const destino = ref(null)
const isSearchFocused = ref(false)

const wrapperClass = 'min-h-screen'
const containerClass = 'w-full min-h-screen'
const search = ref('')

const suggestions = [
  { id: 1, name: 'Don Emiliano', subtitle: 'Pasillo 2 · Puesto 24', puesto: 24 },
  { id: 2, name: 'Pollos Don Marcelo', subtitle: 'Pasillo 1 · Puesto 12', puesto: 12 },
  { id: 3, name: 'Bodega Don Jorge', subtitle: 'Pasillo 3 · Puesto 08', puesto: 8 },
  { id: 4, name: 'Frutitos La Huerta', subtitle: 'Pasillo 4 · Puesto 05', puesto: 5 },
  { id: 5, name: 'Abarrotes Roxana', subtitle: 'Pasillo 2 · Puesto 30', puesto: 30 },
  { id: 6, name: 'Quesos & Jamones Deli', subtitle: 'Pasillo 5 · Puesto 19', puesto: 19 },
  { id: 7, name: 'Ceviches El Puerto', subtitle: 'Pasillo 6 · Puesto 14', puesto: 14 },
  { id: 8, name: 'Panadería San Luis', subtitle: 'Pasillo 1 · Puesto 03', puesto: 3 },
  { id: 9, name: 'Jugos Tropical', subtitle: 'Pasillo 7 · Puesto 21', puesto: 21 },
  { id: 10, name: 'Verduras Express', subtitle: 'Pasillo 4 · Puesto 27', puesto: 27 },

  { id: 11, name: 'Carnicería El Toro', subtitle: 'Pasillo 2 · Puesto 01', puesto: 1 },
  { id: 12, name: 'Mariscos La Ola', subtitle: 'Pasillo 6 · Puesto 02', puesto: 2 },
  { id: 13, name: 'Dulcería Caramelo', subtitle: 'Pasillo 3 · Puesto 04', puesto: 4 },
  { id: 14, name: 'Hierbas Naturales Anita', subtitle: 'Pasillo 5 · Puesto 06', puesto: 6 },
  { id: 15, name: 'Granos El Campesino', subtitle: 'Pasillo 2 · Puesto 07', puesto: 7 },
  { id: 16, name: 'Embutidos La Casita', subtitle: 'Pasillo 4 · Puesto 09', puesto: 9 },
  { id: 17, name: 'Especias Doña Rosa', subtitle: 'Pasillo 3 · Puesto 10', puesto: 10 },
  { id: 18, name: 'Minimarket Central', subtitle: 'Pasillo 1 · Puesto 11', puesto: 11 },
  { id: 19, name: 'Pescados El Faro', subtitle: 'Pasillo 6 · Puesto 13', puesto: 13 },
  { id: 20, name: 'Chifles El Norteño', subtitle: 'Pasillo 7 · Puesto 15', puesto: 15 },

  { id: 21, name: 'La Esquina Criolla', subtitle: 'Pasillo 2 · Puesto 16', puesto: 16 },
  { id: 22, name: 'Huevos La Granja', subtitle: 'Pasillo 5 · Puesto 17', puesto: 17 },
  { id: 23, name: 'Refrescos El Sol', subtitle: 'Pasillo 4 · Puesto 18', puesto: 18 },
  { id: 24, name: 'La Canasta Feliz', subtitle: 'Pasillo 1 · Puesto 20', puesto: 20 },
  { id: 25, name: 'Sazón Peruano', subtitle: 'Pasillo 3 · Puesto 22', puesto: 22 },
  { id: 26, name: 'Helados La Nieve', subtitle: 'Pasillo 7 · Puesto 23', puesto: 23 },
  { id: 27, name: 'Comidas El Buen Sabor', subtitle: 'Pasillo 6 · Puesto 25', puesto: 25 },
  { id: 28, name: 'Tienda La Económica', subtitle: 'Pasillo 2 · Puesto 26', puesto: 26 },
  { id: 29, name: 'Frutos Secos El Árbol', subtitle: 'Pasillo 4 · Puesto 28', puesto: 28 },
  { id: 30, name: 'Abarrotes La 32', subtitle: 'Pasillo 3 · Puesto 29', puesto: 29 },

  { id: 31, name: 'La Despensa Real', subtitle: 'Pasillo 1 · Puesto 31', puesto: 31 },
  { id: 32, name: 'Lácteos Santa Clara', subtitle: 'Pasillo 5 · Puesto 32', puesto: 32 },
  { id: 33, name: 'Carnes Selectas Don Pepe', subtitle: 'Pasillo 2 · Puesto 33', puesto: 33 },
  { id: 34, name: 'Productos Andinos', subtitle: 'Pasillo 6 · Puesto 34', puesto: 34 },
  { id: 35, name: 'Salsas & Conservas', subtitle: 'Pasillo 3 · Puesto 35', puesto: 35 },
  { id: 36, name: 'Café Aroma Norte', subtitle: 'Pasillo 7 · Puesto 36', puesto: 36 },
  { id: 37, name: 'Tienda El Ahorro', subtitle: 'Pasillo 4 · Puesto 37', puesto: 37 },
  { id: 38, name: 'La Casa del Queso', subtitle: 'Pasillo 5 · Puesto 38', puesto: 38 },
  { id: 39, name: 'Delicias Caseras', subtitle: 'Pasillo 1 · Puesto 39', puesto: 39 },
  { id: 40, name: 'La Bodeguita Feliz', subtitle: 'Pasillo 2 · Puesto 40', puesto: 40 },

  { id: 41, name: 'Sabores del Mercado', subtitle: 'Pasillo 3 · Puesto 41', puesto: 41 },
  { id: 42, name: 'Tortas & Pasteles Mary', subtitle: 'Pasillo 6 · Puesto 42', puesto: 42 },
  { id: 43, name: 'Verduras Don Lucho', subtitle: 'Pasillo 4 · Puesto 43', puesto: 43 },
  { id: 44, name: 'La Esquinita Andina', subtitle: 'Pasillo 7 · Puesto 44', puesto: 44 }
]

const filteredSuggestions = computed(() => {
  const txt = search.value.trim().toLowerCase()
  if (!txt) return []
  return suggestions.filter(s =>
    (s.name + ' ' + s.subtitle).toLowerCase().includes(txt)
  )
})

const showSuggestions = computed(() =>
  isSearchFocused.value &&
  filteredSuggestions.value.length > 0
)

const markers = ref([
  {
    id: 'm1',
    name: 'Don Emiliano',
    subtitle: 'Pasillo 2 · Puesto 24',
    x: 68,
    y: 58,
    products: [
      { id: 1, title: 'Tacos al Pastor', price: '13.99', img: 'https://picsum.photos/300?random=801' },
      { id: 2, title: 'Quesadillas Mixtas', price: '16.99', img: 'https://picsum.photos/300?random=802' },
      { id: 3, title: 'Gringas de Pollo', price: '18.99', img: 'https://picsum.photos/300?random=803' },
      { id: 4, title: 'Burrito Power', price: '14.50', img: 'https://picsum.photos/300?random=804' },
      { id: 5, title: 'Nachos Supreme', price: '11.90', img: 'https://picsum.photos/300?random=805' }
    ]
  },
  {
    id: 'm2',
    name: 'Pollos Don Marcelo',
    subtitle: 'Pasillo 1 · Puesto 12',
    x: 30,
    y: 42,
    products: [
      { id: 1, title: 'Pollo Broaster', price: '15.90', img: 'https://picsum.photos/300?random=811' },
      { id: 2, title: 'Alitas BBQ', price: '12.50', img: 'https://picsum.photos/300?random=812' },
      { id: 3, title: 'Nuggets Kids', price: '9.90', img: 'https://picsum.photos/300?random=813' },
      { id: 4, title: 'Combo Familiar', price: '29.90', img: 'https://picsum.photos/300?random=814' }
    ]
  },
  {
    id: 'm3',
    name: 'Bodega Don Jorge',
    subtitle: 'Pasillo 3 · Puesto 08',
    x: 46,
    y: 72,
    products: [
      { id: 1, title: 'Arroz Extra', price: '6.90', img: 'https://picsum.photos/300?random=821' },
      { id: 2, title: 'Aceite 1L', price: '9.50', img: 'https://picsum.photos/300?random=822' },
      { id: 3, title: 'Azúcar 1kg', price: '4.80', img: 'https://picsum.photos/300?random=823' },
      { id: 4, title: 'Fideos', price: '3.20', img: 'https://picsum.photos/300?random=824' }
    ]
  }
])

const selected = ref(null)
const sheetOpen = ref(false)

function onSelectMarker(marker) {
  selected.value = marker
  sheetOpen.value = true
}

function closePopup() {
  selected.value = null
}

function closeSheet() {
  sheetOpen.value = false
}

function onSelectSuggestion(s) {

  search.value = s.name
  destino.value = s.puesto

  selected.value = {
    id: `dest-${s.puesto}`,
    name: s.name,
    subtitle: s.subtitle
  }

  isSearchFocused.value = false   // 🔥 esto faltaba
  sheetOpen.value = true
}

function onCancelSearch() {
  search.value = ''
}

function resetMap() {
  if (planoMapaRef.value?.resetCenter) {
    planoMapaRef.value.resetCenter()
  }
}

function handlePuestoSeleccionado(num) {

  const puesto = String(num)

  destino.value = puesto

  const found = suggestions.find(s => String(s.puesto) === puesto)

  if (found) {
    selected.value = {
      id: `dest-${puesto}`,
      name: found.name,
      subtitle: found.subtitle
    }
  }

  sheetOpen.value = true
}

watch(selected, (v) => {
  console.log('SELECTED >>>', v)
})

watch(destino, (v) => {
  console.log('DESTINO >>>', v)
})
</script>