<template>
  <div class="relative flex-1">

    <div ref="mapEl" class="h-full w-full relative z-0"></div>

    <!-- FAB -->
    <button
      @click="volverInicio"
      class="absolute bottom-6 right-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-xl transition active:scale-90"
    >
      <i class="fa fa-location-arrow"></i>
    </button>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { gsap } from 'gsap'

const props = defineProps(['lugares', 'initialCenter'])

const mapEl = ref(null)
let map
let currentMarker = null
let currentLat = props.initialCenter[0]
let currentLng = props.initialCenter[1]

onMounted(() => {

  map = L.map(mapEl.value).setView(props.initialCenter, 14)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map)

  currentMarker = L.marker(props.initialCenter).addTo(map)

})

function animateTo(coords) {

  const targetLat = coords[0]
  const targetLng = coords[1]

  gsap.to({}, {
    duration: 1.8,
    ease: "power3.inOut",

    onUpdate: function() {

      currentLat += (targetLat - currentLat) * 0.08
      currentLng += (targetLng - currentLng) * 0.08

      map.setView([currentLat, currentLng], 15, { animate: false })

      if (currentMarker) {
        currentMarker.setLatLng([currentLat, currentLng])
      }
    },

    onComplete: function() {

      currentLat = targetLat
      currentLng = targetLng

      map.setView(coords, 16, { animate: false })

      if (currentMarker) {
        currentMarker.setLatLng(coords)
      }

    }

  })

}

function flyToLocation(coords) {

  if (!currentMarker) {
    currentMarker = L.marker(coords).addTo(map)
  }

  animateTo(coords)
}

function volverInicio() {
  animateTo(props.initialCenter)
}

defineExpose({
  flyToLocation
})
</script>