<template>

    <div class="min-h-screen pattern-background">

        <TopBar />

        <div class="content-container">

            <!-- LOADER -->
            <div v-if="loading" class="flex justify-center py-10">
                <div class="regentis-loader"></div>
            </div>

            <!-- GRID -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

                <UsuarioCard v-for="item in usuarios" :key="item.usu_id" :usuario="item"
                    :selected="selectedUserId === item.usu_id" @select="seleccionar(item.usu_id)" />

            </div>

        </div>

        <BotonGuardar @click="guardar" />

    </div>

</template>
<script setup>
import { ref, onMounted } from 'vue'
import TopBar from './components/TopBar.vue'
import UsuarioCard from './components/UsuarioCard.vue'
import BotonGuardar from './components/BotonGuardar.vue'
import { useUsuario } from '../../services/usuarioService.js'
import { useRouter } from 'vue-router'
import axios from 'axios'

const usuarios = ref([])
const loading = ref(true)

const { setLoginData } = useUsuario()
const router = useRouter()

/* 🔥 SOLO UNO */
const selectedUserId = ref(null)

function seleccionar(id) {
    selectedUserId.value = id
}

/* 🔥 API CON AXIOS */
async function listar() {
    try {
        const res = await axios.get(
            import.meta.env.VITE_PUBLIC_URL_BASE + '/KT3E/listarUsuarios'
        )

        usuarios.value = res.data.map(u => ({
            ...u,
            nombre: u.sobrenombre || 'Sin nombre',
            tienda: u.negocio_nombre,
            rol: u.tipoxusu_descripcion,
            foto: u.img_perfil || `https://picsum.photos/80?random=${u.usu_id}`
        }))

    } catch (e) {
        console.error('Error listando usuarios', e)
    } finally {
        loading.value = false
    }
}

async function guardar() {

    if (!selectedUserId.value) {
        alert('Selecciona un usuario')
        return
    }

    try {

        const res = await axios.post(
            import.meta.env.VITE_PUBLIC_URL_BASE + '/coral/loginById',
            {
                usu_id: selectedUserId.value
            }
        )

        if (res.data.status === 'ok') {

            // 🔥 GUARDAR SESIÓN
            setLoginData(res.data)

            const user = res.data.data

            // 🔥 REDIRECCIÓN SEGÚN TIPO
            if (Number(user.tipoxusu_id) === 1) {
                router.replace('/principal')
            } else {
                router.replace('/dash')
            }

        } else {
            alert(res.data.msg || 'Error')
        }

    } catch (e) {
        console.error(e)
        alert('Error de conexión')
    }

}

onMounted(listar)
</script>

<style scoped>
.content-container {
    width: 100%;
    max-width: 1400px;
    margin: auto;

    padding-top: 70px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 100px;
}
</style>