<template>

    <div class="min-h-screen pattern-background pt-20">

        <HeaderBack />

        <div class="content-container">

            <div class="
                    bg-white
                    rounded-3xl
                    p-6
                    shadow-md
                    max-w-md
                    mx-auto
                ">

                <!-- HEADER -->
                <ProfileHeader />

                <!-- AVATAR -->
                <ProfileAvatar :usuario="usuario" />

                <!-- FORM -->
                <ProfileForm :form="form" />

                <!-- BTN -->
                <NextButton />

            </div>

        </div>

    </div>

</template>

<script setup>

import {
    ref,
    onMounted
}
    from 'vue'

import axios
    from 'axios'

import HeaderBack
    from '../../../../components/layout/HeaderBack.vue'

import ProfileHeader
    from './components/ProfileHeader.vue'

import ProfileAvatar
    from './components/ProfileAvatar.vue'

import ProfileForm
    from './components/ProfileForm.vue'

import NextButton
    from './components/NextButton.vue'

import {
    useUsuario
}
    from '../../../../services/usuarioService'

const API =
    import.meta.env
        .VITE_API_URL

const {
    usuario: usuarioStore
}
    =
    useUsuario()

const usuario =
    ref(null)

const form =
    ref({

        nombres_apellidos: '',

        email: '',

        celular: '',

        fecha_nacimiento: ''

    })

onMounted(() => {

    cargarUsuario()

})

async function cargarUsuario() {

    try {

        const r =
            await axios.post(

                `${API}/ZYhL/detalleUsu`,

                {

                    usu_id:
                        usuarioStore.value?.usu_id

                }

            )

        if (r.data.ok) {

            usuario.value =
                r.data.usuario

            form.value = {

                nombres_apellidos:

                    r.data.usuario
                        ?.nombres_apellidos
                    || '',

                email:

                    r.data.usuario
                        ?.email
                    || '',

                celular:

                    r.data.usuario
                        ?.celular
                    || '',

                fecha_nacimiento:

                    r.data.usuario
                        ?.fecha_nacimiento
                    || ''

            }

        }

    } catch (e) {

        console.error(e)

    }

}

</script>

<style scoped>
.content-container {

    width: 100%;

    max-width: 1400px;

    margin: auto;

    padding-top: 50px;

    padding-left: 20px;

    padding-right: 20px;

    padding-bottom: 40px;

}

.pattern-background {

    background-color: #e5e5f7;

    background-image:
        linear-gradient(135deg,
            #FCCBB5 25%,
            transparent 25%),

        linear-gradient(225deg,
            #FCCBB5 25%,
            transparent 25%),

        linear-gradient(45deg,
            #FCCBB5 25%,
            transparent 25%),

        linear-gradient(315deg,
            #FCCBB5 25%,
            #e5e5f7 25%);

    background-position:
        10px 0,
        10px 0,
        0 0,
        0 0;

    background-size:
        20px 20px;

}
</style>