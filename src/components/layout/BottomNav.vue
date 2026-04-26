<template>
  <div class="bottom-nav fixed bottom-0 left-0 w-full h-20
           flex items-center
           bg-white
           shadow-[0_-5px_20px_rgba(0,0,0,0.08)]
           rounded-t-3xl
           z-50">

    <!-- INICIO -->
    <button class="flex-1 h-full flex flex-col items-center justify-center relative" @click="go('/principal')">
      <i class="fa fa-home text-xl" :class="isActive('/principal') ? 'text-orange-500' : 'text-gray-800'"></i>
      <span class="text-xs mt-1" :class="isActive('/principal') ? 'text-orange-500 font-medium' : 'text-gray-800'">
        Inicio
      </span>
    </button>

    <!-- PEDIDOS -->
    <button class="flex-1 h-full flex flex-col items-center justify-center relative" @click="go('/Wvn1_mis_mensajes')">
      <i class="fa fa-list-alt text-xl" :class="isActive('/chat') ? 'text-orange-500' : 'text-gray-800'"></i>

      <!-- BADGE -->
      <span class="absolute top-3 right-8
               bg-red-500 text-white text-xs
               w-5 h-5 rounded-full
               flex items-center justify-center">
        1
      </span>

      <span class="text-xs mt-1" :class="isActive('/mis-modelos') ? 'text-orange-500 font-medium' : 'text-gray-800'">
        Chats
      </span>
    </button>

    <!-- FAVORITOS -->
    <button class="flex-1 h-full flex flex-col items-center justify-center" @click="go('/mod_pedidos')">
      <i class="fa fa-shopping-basket text-xl"
        :class="isActive('/mod_pedidos') ? 'text-orange-500' : 'text-gray-800'"></i>
      <span class="text-xs mt-1" :class="isActive('/mod_pedidos') ? 'text-orange-500 font-medium' : 'text-gray-800'">
        Pedidos
      </span>
    </button>

    <!-- PERFIL -->
    <button class="flex-1 h-full flex flex-col items-center justify-center" @click="go('/mod_plano_mercado')">
      <i class="fa fa-map-marker text-xl"
        :class="isActive('/mod_plano_mercado') ? 'text-orange-500' : 'text-gray-800'"></i>
      <span class="text-xs mt-1"
        :class="isActive('/mod_plano_mercado') ? 'text-orange-500 font-medium' : 'text-gray-800'">
        Ubicaciones
      </span>
    </button>

  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const currentPath = computed(() => route?.path || '')

const router = useRouter()
const route = useRoute()

function go(path) {
  router.push(path)
}

function isActive(path) {
  return currentPath.value === path
}
</script>

<style scoped>
.bottom-nav {
  background-image:
    radial-gradient(circle at center center, rgba(33, 33, 33, 0), rgb(33, 33, 33)),
    repeating-linear-gradient(135deg, rgb(33, 33, 33) 0px, rgb(33, 33, 33) 1px, transparent 1px, transparent 4px),
    repeating-linear-gradient(45deg, rgb(56, 56, 56) 0px, rgb(56, 56, 56) 5px, transparent 5px, transparent 6px),
    linear-gradient(90deg, rgb(33, 33, 33), rgb(33, 33, 33));

  color: white;
}

.bottom-nav i {
  color: white;
}

.bottom-nav span {
  color: white;
}

.bottom-nav button:hover i,
.bottom-nav button.active i {
  color: #FD7635;
}
</style>