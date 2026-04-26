<template>
    <transition name="fade">
        <div v-if="modelValue" class="menu-modal-bg" @click.self="cerrar">
            <div ref="modalRef" class="menu-modal-box">

                <button v-if="tipoxusuId !== 1" @click="irAdministracion" class="menu-item-btn">
                    Administracion
                </button>

                <button @click="irMiCuenta" class="menu-item-btn">
                    Mi cuenta
                </button>

                <button @click="cerrar" class="menu-cancel-btn">
                    Cancelar
                </button>

            </div>
        </div>
    </transition>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { useUsuario } from '../services/usuarioService.js'

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

const tipoxusuId = computed(() => {
    const user = getUser()
    return Number(user?.tipoxusu_id || 0)
})

watch(
    () => props.modelValue,
    (val) => {
        if (!val) return

        nextTick(() => {
            if (!modalRef.value) return

            gsap.fromTo(
                modalRef.value,
                { scale: 0.7, opacity: 0, y: 30 },
                { scale: 1, opacity: 1, y: 0, duration: 0.28, ease: 'back.out(1.7)' }
            )
        })
    }
)

function cerrar() {
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
    /* 🔥 rojo */
    color: white;

    font-weight: 600;
    transition: 0.2s;
}

.menu-cancel-btn:hover {
    transform: scale(1.02);
    background: #dc2626;
    /* 🔥 rojo más fuerte */
}
</style>