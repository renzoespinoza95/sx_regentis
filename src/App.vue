<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BottomNav from './components/layout/BottomNav.vue'
import { useUsuario } from './services/usuarioService.js'

const route = useRoute()
const { isLogged } = useUsuario()

const showBottomNav = computed(() => {
  return !!isLogged.value
})
</script>

<template>
  <main :class="[
    'min-h-screen',
    showBottomNav ? 'pb-16' : ''
  ]">
    <router-view />
  </main>

  <BottomNav v-if="showBottomNav" />
</template>