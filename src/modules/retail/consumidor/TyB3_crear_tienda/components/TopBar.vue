<template>
  <div class="
    h-[72px]
    bg-white/90
    backdrop-blur-xl
    border-b
    border-white/40
    flex
    flex-col
    items-center
    justify-center
    py-5
    px-4
    shrink-0
  ">

    <div class="
      text-[22px]
      font-black
      text-gray-800
      text-center
      pt-10
    ">
      {{ tituloBienvenida }}
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUsuario } from '../../../../../services/usuarioService.js'

const { usuario, isLogged } = useUsuario()

const tituloBienvenida = computed(() => {
  if (isLogged.value) {
    const nombre =
      usuario.value?.user?.display_name ||
      usuario.value?.user?.name ||
      usuario.value?.user?.nombre ||
      'Emprendedor'
    return `¡Bienvenido, ${nombre}! Crea tu tienda y empieza a vender hoy mismo`
  }
  return 'Tu tienda virtual, lista en minutos'
})
</script>