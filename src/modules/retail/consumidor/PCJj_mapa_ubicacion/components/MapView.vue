<template>

  <div class="relative flex-1 pt-20">

    <div ref="mapEl" class="h-full w-full relative z-0">
    </div>

    <!-- FAB -->
    <button @click="volverInicio" class="
        absolute
        bottom-24
        right-6
        bg-[#FD7635]
        text-white
        w-14
        h-14
        rounded-full
        shadow-2xl
        flex
        items-center
        justify-center
        text-xl
        transition
        active:scale-90
        z-[999]
      ">

      <i class="fa fa-location-arrow"></i>

    </button>

  </div>

</template>

<script setup>

import {
  onMounted,
  ref
}
  from 'vue'

import L from 'leaflet'

import 'leaflet/dist/leaflet.css'

const props = defineProps([

  'lugares',

  'initialCenter'

])

const mapEl = ref(null)

let map

/* =========================================
   📍 GOOGLE MAPS
========================================= */

function openGoogleMaps(
  coords
) {

  const lat = coords[0]

  const lng = coords[1]

  window.open(

    `https://www.google.com/maps?q=${lat},${lng}`,

    '_blank'

  )

}

/* =========================================
   📍 MARKER HTML
========================================= */

function createPremiumMarker(
  lugar
) {

  return `

    <div
      style="
        display:flex;
        flex-direction:column;
        align-items:center;
      "
    >

      <div

        id="marker-click"

        style="
          width:82px;
          background:white;
          border-radius:24px;
          padding:8px;
          box-shadow:0 10px 30px rgba(0,0,0,.18);
          border:3px solid #FD7635;
          display:flex;
          flex-direction:column;
          align-items:center;
          cursor:pointer;
        "
      >

        <img

          src="${lugar.logo}"

          style="
            width:54px;
            height:54px;
            border-radius:50%;
            object-fit:cover;
            border:3px solid #fff;
            box-shadow:0 4px 12px rgba(0,0,0,.15);
          "
        />

        <div
          style="
            margin-top:6px;
            font-size:11px;
            font-weight:700;
            color:#1f2937;
            text-align:center;
            line-height:1.2;
          "
        >

          ${lugar.nombre}

        </div>

      </div>

      <div
        style="
          width:0;
          height:0;
          border-left:12px solid transparent;
          border-right:12px solid transparent;
          border-top:18px solid #FD7635;
          margin-top:-2px;
        "
      >
      </div>

    </div>

  `

}

onMounted(() => {

  /* =========================================
     ⏳ ESPERAR DATOS
  ========================================= */

  const waitData = setInterval(() => {

    if (

      !props.initialCenter
      ||

      !props.lugares?.length

    ) {

      return

    }

    clearInterval(waitData)

    /* =========================================
       🗺️ MAP
    ========================================= */

    map =
      L.map(
        mapEl.value
      ).setView(
        props.initialCenter,
        16
      )

    L.tileLayer(

      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

      {

        attribution:
          '© OpenStreetMap'

      }

    ).addTo(map)

    /* =========================================
       📍 MARKERS
    ========================================= */

    props.lugares.forEach(
      lugar => {

        const icon =
          L.divIcon({

            html:
              createPremiumMarker(
                lugar
              ),

            className:
              '',

            iconSize:
              [90, 120],

            iconAnchor:
              [45, 110]

          })

        const marker =
          L.marker(

            lugar.coords,

            { icon }

          ).addTo(map)

        marker.on(
          'click',
          () => {

            openGoogleMaps(
              lugar.coords
            )

          }
        )

      }
    )

  }, 200)

})

function volverInicio() {

  map.setView(
    props.initialCenter,
    16
  )

}

</script>