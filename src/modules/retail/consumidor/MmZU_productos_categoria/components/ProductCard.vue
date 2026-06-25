<template>

    <div class="product-card bg-white rounded-2xl shadow-md overflow-hidden h-[250px] flex flex-col" @click="irDetalle">

        <!-- IMAGEN -->
        <div class="relative">

            <img :src="producto.imagenes?.find(

                x =>

                    Number(
                        x.orden
                    ) === 1

            )?.img

                ||

                producto.imagenes?.[0]?.img

                ||

                'https://barsi-img.b-cdn.net/recursos/6qz5.png'

                " class="
        w-full
        h-28

        object-cover
    " />

            <!-- DESCUENTO -->
            <span class="absolute top-2 left-2 bg-[#FD7635] text-white text-xs px-2 py-1 rounded-full">
                -{{ producto.descuento }}%
            </span>

            <!-- FAVORITO -->
            <div class="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow cursor-pointer"
                :style="{ background: '#FD7635' }" @click.stop="onFavoritoClick($event)">
                <i class="fa fa-heart text-white text-xs"></i>
            </div>

        </div>

        <!-- INFO -->
        <div class="p-1">

            <!-- TITULO -->
            <div class="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight h-[36px]">
                {{ producto.name }}
            </div>

            <!-- RATING -->
            <div class="flex items-center text-xs text-yellow-400 mt-1">
                ★ 5
                <span class="text-gray-400 ml-1">
                    | 9999
                </span>
            </div>

            <!-- MARCA -->
            <div class="text-xs text-gray-400 mt-1">
                {{ producto.marca }}
            </div>

            <!-- PRECIOS -->
            <div class="flex items-center gap-2 mt-2">

                <span class="text-orange-500 font-bold">
                    S/{{ producto.price }}
                </span>

                <span class="text-gray-400 line-through text-xs">
                    antes S/{{ producto.price }}
                </span>

            </div>

        </div>

        <!-- BOTON -->
        <div class="px-3 pb-3">

            <!-- 🟢 DISPONIBLE -->
            <button v-if="Number(producto.stock) > 0"
                class="w-full bg-[#FD7635] text-white py-2 rounded-xl text-sm font-semibold shadow-md hover:scale-[1.02] active:scale-95 transition"
                @click.stop="abrirCantidadDialog">

                Agregar

            </button>

            <!-- 🔴 AGOTADO -->
            <div v-else
                class="w-full py-2 rounded-xl text-sm font-bold text-center border border-red-200 bg-gradient-to-r from-red-50 to-red-100 text-red-500 shadow-inner tracking-wide">

                ✦ AGOTADO ✦

            </div>

            <CantidadProductoDialog ref="cantidadDialogRef" @confirm="onConfirmCantidad" />

        </div>

    </div>

</template>
<script setup>
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { useUsuario } from '../../../../../services/usuarioService.js'
import { computed, ref } from 'vue'
import CantidadProductoDialog
    from '../../../../../components/layout/CantidadProductoDialog.vue'
import {
    useAnonimo
}
    from '../../../../../services/anonimoService.js'

const router = useRouter()

const props = defineProps({
    producto: Object,
    neg_id: Number
})
const { usuario } = useUsuario()

const {
    addProducto
} = useAnonimo()

const user = computed(() => usuario.value?.user || null)
const cantidadDialogRef = ref(null)

const emit = defineEmits(['toast', 'confetti'])

function abrirCantidadDialog() {

    cantidadDialogRef.value?.open(
        props.producto
    )

}

function flyToTarget(
    e,
    targetId
) {

    const card =
        e.target.closest(
            '.product-card'
        )

    const target =
        document.getElementById(
            targetId
        )

    if (
        !card
        ||
        !target
    ) {

        emit('toast', {

            text:
                'No se pudo agregar ❌',

            type:
                'error'
        })

        return

    }

    const clone =
        card.cloneNode(true)

    const rect =
        card.getBoundingClientRect()

    const targetRect =
        target.getBoundingClientRect()

    Object.assign(
        clone.style,
        {

            position:
                'fixed',

            top:
                rect.top + 'px',

            left:
                rect.left + 'px',

            width:
                rect.width + 'px',

            zIndex:
                9999,

            pointerEvents:
                'none'

        }
    )

    document.body.appendChild(
        clone
    )

    gsap.to(
        clone,
        {

            x:
                targetRect.left
                -
                rect.left,

            y:
                targetRect.top
                -
                rect.top,

            scale:
                0.2,

            opacity:
                0.5,

            duration:
                0.7,

            ease:
                'power2.inOut',

            onComplete: () => {

                clone.remove()

            }

        }
    )

}

async function onConfirmCantidad(payload) {

    const e = {

        target:
            document.querySelector('.product-card')

    }

    const cantidad =
        payload.cantidad

    const usu_id =
        user.value?.usu_id

    const neg_id =
        props.neg_id

    /* =====================================
       🔥 ANÓNIMO
    ===================================== */

    if (!usu_id) {

        addProducto({

            product_id:
                props.producto.product_id,

            nombre:
                props.producto.name,

            precio:
                props.producto.price,

            cantidad:
                cantidad,

            img:

                props.producto.imagenes?.find(

                    x =>

                        Number(
                            x.orden
                        ) === 1

                )?.img

                ||

                props.producto.imagenes?.[0]?.img

                ||

                '',

            neg_id:
                neg_id

        })

        flyToTarget(

            e,

            'icon-carrito-header'

        )

        emit('toast', {

            text:
                'Agregado al carrito 🛒',

            type:
                'success'

        })

        emit('confetti')

        return

    }

    /* =====================================
       🔥 VALIDAR NEGOCIO
    ===================================== */

    if (!neg_id) {

        emit('toast', {

            text:
                'Error: neg_id no disponible ❌',

            type:
                'error'

        })

        return

    }

    /* =====================================
       🔥 USUARIO LOGUEADO
    ===================================== */

    try {

        const res = await fetch(

            `${import.meta.env.VITE_PUBLIC_URL_BASE}/M0Jk/carritoCompras`,

            {

                method:
                    'POST',

                headers: {

                    'Content-Type':
                        'application/json'

                },

                body: JSON.stringify({

                    usu_id:
                        usu_id,

                    neg_id:
                        neg_id,

                    product_id:
                        props.producto.product_id,

                    cantidad:
                        cantidad,

                    fecha_entrega:
                        null

                })

            }

        )

        const data =
            await res.json()

        if (

            data.status === 'ok'

        ) {

            flyToTarget(

                e,

                'icon-carrito-header'

            )

            emit('toast', {

                text:

                    data.msg === 'actualizado'

                        ?

                        'Cantidad actualizada 🛒'

                        :

                        'Agregado al carrito 🛒',

                type:
                    'success'

            })

            emit('confetti')

        }

        else {

            emit('toast', {

                text:

                    data.msg

                    ||

                    'Error al agregar ❌',

                type:
                    'error'

            })

        }

    }

    catch (err) {

        emit('toast', {

            text:
                'Error de conexión ❌',

            type:
                'error'

        })

    }

}

function irDetalle() {
    router.push(`/QZMq_detalle_prod/${props.producto.product_id}`)
}

async function onFavoritoClick(e) {

    console.log('usuario.value', usuario.value) // 👈 AQUÍ

    flyToHeart(e)

    const usu_id = user.value?.usu_id

    if (!usu_id) {
        emit('toast', {
            text: 'Debes iniciar sesión ❌',
            type: 'error'
        })
        return
    }

    try {

        const res = await fetch(
            `${import.meta.env.VITE_PUBLIC_URL_BASE}/DzCy/agregarFavorito`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usu_id: usu_id,
                    product_id: props.producto.product_id
                })
            }
        )

        const data = await res.json()

        if (data.status === 'ok') {

            emit('toast', {
                text: data.msg || 'Agregado a favoritos ❤️',
                type: 'success'
            })

        } else {

            emit('toast', {
                text: data.msg || 'Error al guardar ❌',
                type: 'error'
            })

        }

    } catch (err) {

        emit('toast', {
            text: 'Error de conexión ❌',
            type: 'error'
        })

    }
}
</script>