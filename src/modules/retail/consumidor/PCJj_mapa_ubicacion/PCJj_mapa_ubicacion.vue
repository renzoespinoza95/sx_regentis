<template>
  <div class="flex flex-col h-screen bg-gray-100">

    <TopHeader />

    <LocationDropdown
      :lugares="lugares"
      @selectLugar="irALugar"
    />

    <MapView
      ref="mapRef"
      :lugares="lugares"
      :initialCenter="initialCenter"
    />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import TopHeader from './components/TopHeader.vue'
import LocationDropdown from './components/LocationDropdown.vue'
import MapView from './components/MapView.vue'

const initialCenter = [-12.056273847827748, -77.03712625305339]

const mapRef = ref(null)

const lugares = [
  { nombre: 'Coliseo Amauta', coords: [-12.054427216212401, -77.06227464468205] },
  { nombre: 'Cancha de Sosa Pelaez', coords: [-12.060344786339222, -77.06300420548929] },
  { nombre: 'Complejo Deportivo Repcel', coords: [-12.053629803165538, -77.05755395710581] },
  { nombre: 'Losa Deportiva Pariacoto', coords: [-12.051825122782823, -77.05128831723191] },
  { nombre: 'CANCHA SINTÉTICA VENEZUELA', coords: [-12.054343278160687, -77.05051584042933] },
  { nombre: 'Campo deportivo "HCA Arena" - Breña', coords: [-12.055812191186748, -77.04558057614508] },
]

function irALugar(lugar) {
  mapRef.value?.flyToLocation(lugar.coords)
}
</script>