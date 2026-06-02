<template>
    <transition name="fade">
        <div v-if="modelValue" class="
        fixed
        inset-0

        bg-black/40

        flex
        items-center
        justify-center

        z-[9999]
    " @click.self="cerrar">
            <div ref="modalRef" class="menu-modal-box">

                <button v-if="tipoxusuId !== 1" @click="irAdministracion" class="menu-item-btn">

                    👑 Administración

                </button>

                <button @click="irMiCuenta" class="menu-item-btn">
                    Mi cuenta
                </button>

                <button @click="irContacto" class="menu-item-btn">
                    Contacto
                </button>

                <button @click="verInformacion" class="menu-item-btn">

                    ℹ️ Información

                </button>

                <template v-if="isLogged">

                    <button @click="irFavoritos" class="menu-item-btn relative">

                        ❤️ Favoritos

                        <span v-if="favoritosCount > 0" class="menu-badge">

                            {{ favoritosCount }}

                        </span>

                    </button>

                    <button @click="irCarrito" class="menu-item-btn relative">

                        🛒 Carrito

                        <span v-if="carritoCount > 0" class="menu-badge">

                            {{ carritoCount }}

                        </span>

                    </button>

                </template>
                <!-- 🔥 ACTUALIZAR -->
                <button v-if="necesitaActualizar" @click="actualizarApp" class="menu-item-btn rainbow-update-btn">

                    🚀 Actualizar app

                </button>

                <button @click="cerrar" class="menu-cancel-btn">
                    Cancelar
                </button>

            </div>



        </div>
    </transition>
</template>
<script setup>
import {

    computed,

    nextTick,

    ref,

    watch,

    onMounted,

    onUnmounted

}

    from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { useUsuario } from '../services/usuarioService.js'
import ModalUsuario from './ModalUsuario.vue'
import { usePrincipal } from '../services/usePrincipal.js'
import { bus } from '../services/eventBus.js' // 🔥 NUEVO



const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emit =
    defineEmits([

        'update:modelValue',

        'open-info'

    ])

const router = useRouter()

const {

    getUser,

    isLogged

} = useUsuario()

const modalRef = ref(null)

const showInfoUsuario = ref(false)

const carritoCountLocal =
    ref(0)

const favoritosCountLocal =
    ref(0)

/* =========================================
   🔥 TOGGLE BOTTOMNAV
========================================= */

watch(

    () => props.modelValue,

    (val) => {

        bus.emit(
            'bottomnav:toggle',
            !!val
        )

        if (!val) return

        nextTick(() => {

            if (!modalRef.value) return

            gsap.fromTo(

                modalRef.value,

                {
                    scale: 0.7,
                    opacity: 0,
                    y: 30
                },

                {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: 0.28,
                    ease: 'back.out(1.7)'
                }

            )

        })

    },

    {

        immediate: true

    }

)

const tipoxusuId = computed(() => {
    const user = getUser()
    return Number(user?.tipoxusu_id || 0)
})

function updateCounts(payload) {

    carritoCountLocal.value =
        payload.carrito || 0

    favoritosCountLocal.value =
        payload.favoritos || 0

}

onMounted(() => {

    bus.on(

        'header:updateCounts',

        updateCounts

    )

})

onUnmounted(() => {

    bus.off(

        'header:updateCounts',

        updateCounts

    )

})

const favoritosCount =
    computed(() => {

        return favoritosCountLocal.value

    })

const carritoCount =
    computed(() => {

        return carritoCountLocal.value

    })

const version =
    import.meta.env.VITE_PUBLIC_VERSION

usePrincipal()

const versionPrincipal = computed(() => {

    try {

        const cache = JSON.parse(
            localStorage.getItem(
                'regentis_principal_cache'
            ) || '{}'
        )

        return cache.version || '0'

    } catch (e) {

        return '0'

    }

})

function irUbicaciones() {

    cerrar()

    router.push(
        '/PCJj_mapa_ubicacion'
    )

}

function irFavoritos() {

    cerrar()

    router.push({

        path:
            '/Adfj_mis_favoritos',

        query: {

            titulo:
                'Favoritos'

        }

    })

}

function irCarrito() {

    cerrar()

    router.push({

        path:
            '/URl4_usuario_carrito',

        query: {

            titulo:
                'Carrito de compras'

        }

    })

}

const playstoreUrl = computed(() => {

    try {

        const cache = JSON.parse(
            localStorage.getItem(
                'regentis_principal_cache'
            ) || '{}'
        )

        return cache.playstore || ''

    } catch (e) {

        return ''

    }

})

const necesitaActualizar = computed(() => {

    const local =
        String(version || '0')
            .split('.')
            .map(Number)

    const remoto =
        String(versionPrincipal.value || '0')
            .split('.')
            .map(Number)

    for (let i = 0; i < Math.max(local.length, remoto.length); i++) {

        const l = local[i] || 0
        const r = remoto[i] || 0

        if (r > l) return true

        if (r < l) return false

    }

    return false

})

function actualizarApp() {

    if (!playstoreUrl.value) {

        return

    }

    window.open(
        playstoreUrl.value,
        '_blank'
    )

}

function cerrar(
    callback = null
) {

    bus.emit(
        'bottomnav:toggle',
        false
    )

    if (!modalRef.value) {

        emit('update:modelValue', false)

        return

    }

    gsap.to(modalRef.value, {

        scale: 0.85,

        opacity: 0,

        y: 20,

        duration: 0.2,

        ease: 'power2.in',

        onComplete: () => {

            if (

                typeof callback
                ===
                'function'

            ) {

                callback()

            }

            emit(
                'update:modelValue',
                false
            )

        }

    })

}

function irAdministracion() {
    cerrar()
    router.push('/dash')
}

function irMiCuenta() {
    cerrar()
    router.push('/BTqw_mi_cuenta')
}

function irContacto() {
    cerrar()
    router.push('/mod_404')
}

function verInformacion() {

    cerrar(() => {

        emit(
            'open-info'
        )

    })

}

</script>


<style scoped>
.menu-modal-box {

    width: 320px;

    background: white;

    border-radius: 24px;

    padding: 20px;

}

.menu-item-btn {

    width: 100%;

    height: 48px;

    border-radius: 18px;

    background: #f8f8f8;

    font-size: 14px;

    font-weight: 600;

    transition: all 0.2s ease;

    margin-bottom: 10px;

    position: relative;

}

.menu-item-btn:active {

    transform: scale(0.97);

}

.fade-enter-active,
.fade-leave-active {

    transition: opacity .2s ease;

}

.fade-enter-from,
.fade-leave-to {

    opacity: 0;

}

.menu-cancel-btn {

    width: 100%;

    height: 48px;

    border-radius: 18px;

    background: #ef4444;

    color: white;

    font-size: 14px;

    font-weight: 600;

    transition: all 0.2s ease;

}

.menu-cancel-btn:active {

    transform: scale(0.97);

}

/* =========================================
   ACTUALIZAR APP
========================================= */

.rainbow-update-btn {

    background: #f8f8f8;

    color: #111;

    border: 2px solid #FD7635;

    font-weight: 700;

}

/* =========================================
   ADMIN
========================================= */

.gold-btn {

    background: #f8f8f8;

    color: #111;

    font-weight: 700;

}

/* =========================================
   BADGE
========================================= */

.menu-badge {

    position: absolute;

    top: 50%;

    right: 14px;

    transform: translateY(-50%);

    min-width: 22px;

    height: 22px;

    padding: 0 6px;

    border-radius: 999px;

    background: #EF4444;

    color: white;

    font-size: 11px;

    font-weight: 700;

    display: flex;

    align-items: center;

    justify-content: center;

}
</style>