<template>
    <transition name="fade">
        <div v-if="modelValue"
            class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]"
            @click.self="cerrar">

            <div ref="modalRef" class="menu-modal-box">

                <button v-if="tipoxusuId !== 1" @click="irAdministracion" class="menu-item-btn admin-gold-btn">

                    👑 Administración

                </button>

                <button @click="verInformacion" class="menu-item-btn">
                    Mi cuenta
                </button>

                <!-- 🔥 NUEVO BOTÓN -->
                <button @click="verInformacion" class="menu-item-btn">
                    Información
                </button>

                <button @click="irContacto" class="menu-item-btn">
                    Contacto
                </button>
                <!-- 🔥 ACTUALIZAR -->
                <button v-if="necesitaActualizar" @click="actualizarApp" class="menu-item-btn rainbow-update-btn">

                    🚀 Actualizar app

                </button>

                <button @click="cerrar" class="menu-cancel-btn">
                    Cancelar
                </button>

            </div>

            <!-- 🔥 MODAL USUARIO -->
            <ModalUsuario v-model="showInfoUsuario" />

        </div>
    </transition>
</template>
<script setup>
import { computed, nextTick, ref, watch } from 'vue'
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

const emit = defineEmits(['update:modelValue'])

const router = useRouter()
const { getUser } = useUsuario()

const modalRef = ref(null)

const showInfoUsuario = ref(false)

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

function cerrar() {

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

            emit('update:modelValue', false)

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
    showInfoUsuario.value = true
}
</script>


<style scoped>
.menu-modal-bg {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 20px;
}

.menu-modal-box {
    width: 100%;
    max-width: 320px;
    background: white;
    border-radius: 22px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
    padding: 14px;
}

.menu-item-btn {
    width: 100%;
    text-align: center;
    padding: 14px 16px;
    border-radius: 16px;
    background: #fff7f2;
    color: #FD7635;
    font-weight: 600;
    margin-bottom: 10px;
    transition: 0.2s;
}

.menu-item-btn:hover {
    transform: scale(1.02);
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
    text-align: center;
    padding: 14px 16px;
    border-radius: 16px;
    background: #ef4444;
    color: white;
    font-weight: 600;
    transition: 0.2s;
}

.menu-cancel-btn:hover {
    transform: scale(1.02);
    background: #dc2626;
}

/* =========================================
   🌈 BOTON ACTUALIZAR
========================================= */

.rainbow-update-btn {

    position: relative;

    overflow: hidden;

    background: #fff;

    color: #111;

    border: 2px solid transparent;

    font-weight: 700;

}

/* =========================================
   🌈 BORDE ANIMADO
========================================= */

.rainbow-update-btn::before {

    content: "";

    position: absolute;

    inset: 0;

    padding: 2px;

    border-radius: 16px;

    background: linear-gradient(90deg,
            #ff0000,
            #ff7a00,
            #ffee00,
            #00ff66,
            #00ccff,
            #6a00ff,
            #ff00c8,
            #ff0000);

    background-size: 300% 300%;

    animation: rainbowMove 3s linear infinite;

    -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);

    -webkit-mask-composite: xor;

    mask-composite: exclude;

    pointer-events: none;

}

/* =========================================
   ✨ GLOW
========================================= */

.rainbow-update-btn::after {

    content: "";

    position: absolute;

    inset: -4px;

    border-radius: 18px;

    background: inherit;

    filter: blur(8px);

    opacity: 0.6;

    z-index: -1;

}

/* =========================================
   🌈 ANIMACION
========================================= */

@keyframes rainbowMove {

    0% {

        background-position: 0% 50%;

    }

    100% {

        background-position: 300% 50%;

    }

}

/* =========================================
   👑 ADMIN GOLD
========================================= */

.admin-gold-btn {

    position: relative;

    overflow: hidden;

    background:
        linear-gradient(135deg,
            #fff7cc 0%,
            #ffd700 18%,
            #ffef8a 35%,
            #c99700 52%,
            #fff2a6 70%,
            #d4a200 85%,
            #fff7cc 100%);

    color: #4b3200;

    font-weight: 800;

    border: 1px solid rgba(255, 255, 255, .5);

    box-shadow:
        inset 0 2px 4px rgba(255, 255, 255, .45),
        inset 0 -2px 4px rgba(0, 0, 0, .12),
        0 6px 18px rgba(255, 215, 0, .35);

    text-shadow:
        0 1px 0 rgba(255, 255, 255, .6);

}

/* =========================================
   ✨ SHINE
========================================= */

.admin-gold-btn::before {

    content: "";

    position: absolute;

    top: 0;
    left: -120%;

    width: 60%;
    height: 100%;

    background:
        linear-gradient(120deg,
            transparent 0%,
            rgba(255, 255, 255, .2) 30%,
            rgba(255, 255, 255, .9) 50%,
            rgba(255, 255, 255, .2) 70%,
            transparent 100%);

    transform: skewX(-25deg);

    animation: goldShine 2.8s infinite;

}

/* =========================================
   ✨ ANIMACION
========================================= */

@keyframes goldShine {

    0% {

        left: -120%;

    }

    45% {

        left: 140%;

    }

    100% {

        left: 140%;

    }

}
</style>