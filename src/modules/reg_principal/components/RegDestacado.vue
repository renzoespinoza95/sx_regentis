<template>
  <div class="px-4 mt-5">

    <div class="text-sm font-semibold text-gray-700 mb-2">
      Destacado del día
    </div>

    <div class="bg-white rounded-2xl shadow-md p-3 flex gap-3">

      <img
        src="https://picsum.photos/120?random=61"
        class="w-20 h-20 rounded-xl object-cover"
      />

      <div class="flex-1">
        <div class="font-semibold text-orange-500">
          DENTAL CIELO
        </div>
        <div class="text-xs text-gray-500">
          Limpieza + evaluación
        </div>

        <div class="mt-1 font-bold text-gray-800">
          S/49
          <span class="text-xs bg-orange-100 text-orange-500 px-2 py-0.5 rounded-full ml-2">
            🔥 Promo
          </span>
        </div>

        <div class="flex items-center text-xs text-gray-500 mt-1 gap-2">
          ⭐ 4.8
          📍 2.1 km
          🕒 Hoy
        </div>
      </div>

      <button class="bg-orange-500 text-white px-3 py-1 rounded-full text-xs">
        Ver MiniApp >
      </button>

    </div>

  </div>
</template>

<script setup>
</script>