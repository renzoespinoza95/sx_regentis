<template>
    <div v-if="isLogged" class="fixed bottom-24 right-5 z-50 cursor-pointer active:scale-90 transition" @click="irChat">
        <div class="w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
            :style="{ background: mercado.topnavbar_color || '#FD7635' }">
            <i class="fa fa-comment text-white text-xl"></i>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useMercado } from '../../../../../services/useMercado.js'
import { useUsuario } from '../../../../../services/usuarioService.js'

const router = useRouter()
const { mercado } = useMercado()
const { isLogged } = useUsuario()

function irChat() {
    router.push('/CyHh_leer_mensaje')
}
</script>
