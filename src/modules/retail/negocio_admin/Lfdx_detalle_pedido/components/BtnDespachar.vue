<template>

    <!-- SUCCESS ICON -->
    <transition name="fade-success">

        <div v-if="showSuccess" class="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">

            <i class="fa fa-check-circle-o success-icon">
            </i>

        </div>

    </transition>

    <!-- BOTON -->
    <button v-if="visible" @click="despachar" :disabled="loading || !trabajadorSeleccionado"
        class="w-full h-14 rounded-2xl text-white font-bold shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
        :style="{
            background: '#16a34a',
            cursor:
                (!trabajadorSeleccionado)
                    ? 'not-allowed'
                    : 'pointer',
            opacity:
                (loading || !trabajadorSeleccionado)
                    ? 0.5
                    : 1
        }">

        <!-- LOADING -->
        <template v-if="loading">

            <div class="regentis-loader scale-50"></div>

        </template>

        <!-- NORMAL -->
        <template v-else>

            <i class="fa fa-motorcycle"></i>

            Despachar

        </template>

    </button>

    <!-- TOAST -->
    <GsapToast ref="toastRef" />

</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'

import { useMercado } from '../../../../../services/useMercado.js'

import GsapToast
    from '../../../../../components/layout/GsapToast.vue'

const API =
    import.meta.env.VITE_PUBLIC_URL_BASE

trabajadorSeleccionado: Boolean

const { mercado } =
    useMercado()

const props = defineProps({

    carritoId: Number,

    negId: Number,

    usuId: Number,

    direccion: String,

    fechaEntrega: String,

    trabajadorSeleccionado: Boolean
})

const emit = defineEmits([
    'success'
])

const loading = ref(false)

const visible = ref(true)

const showSuccess = ref(false)

const toastRef = ref(null)

async function despachar() {

    try {

        loading.value = true

        const r = await axios.post(
            `${API}/YWRF/despachar`,
            {
                carrito_id:
                    props.carritoId,

                neg_id:
                    props.negId,

                usu_id:
                    props.usuId,

                direccion:
                    props.direccion,

                fecha_entrega:
                    props.fechaEntrega
            }
        )

        /* =========================================
           ICONO GRANDE
        ========================================= */
        showSuccess.value = true

        /* =========================================
           TOAST
        ========================================= */
        toastRef.value.show({

            text:
                'Pedido despachado correctamente',

            type:
                'success'
        })

        emit(
            'success',
            r.data
        )

        /* =========================================
           OCULTAR BOTON
        ========================================= */
        setTimeout(() => {

            visible.value = false

        }, 400)

    } catch (e) {

        console.error(e)

        toastRef.value.show({

            text:
                'Error al despachar',

            type:
                'error'
        })

    } finally {

        loading.value = false
    }
}
</script>

<style scoped>
.success-icon {

    font-size: 50vw;

    color: #86efac;

    opacity: 0.92;

    filter:
        drop-shadow(0 10px 35px rgba(0, 0, 0, 0.18));

    animation:
        successPop 0.45s ease;
}

@media (min-width: 768px) {

    .success-icon {

        font-size: 280px;
    }
}

@keyframes successPop {

    0% {

        transform:
            scale(0.4);

        opacity: 0;
    }

    100% {

        transform:
            scale(1);

        opacity: 0.92;
    }
}

.fade-success-enter-active,
.fade-success-leave-active {

    transition:
        opacity 0.35s;
}

.fade-success-enter-from,
.fade-success-leave-to {

    opacity: 0;
}
</style>