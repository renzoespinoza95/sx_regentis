<template>

    <div>

        <!-- EMPTY -->
        <div v-if="!localImagenes.length" class="
                h-32
                rounded-3xl
                bg-[#fff4ee]
                flex
                items-center
                justify-center
                text-gray-400
                text-sm
            ">

            Sin imágenes 😢

        </div>

        <!-- GALERIA -->
        <div v-else class="
                relative
            ">

            <!-- NAIPE FLOTANTE -->
            <div v-if="
                dragging
                &&
                activeImage
            " class="
                    fixed
                    z-[99999]

                    pointer-events-none
                " :style="{

                    left:
                        `${mouseX}px`,

                    top:
                        `${mouseY}px`,

                    width: '140px',

                    transition: 'none',

                    transform:

                        'translate(-50%,-50%) rotate(6deg) scale(1.08)'

                }">

                <div class="
                        overflow-hidden
                        rounded-3xl

                        bg-white

                        shadow-[0_25px_60px_rgba(0,0,0,0.35)]
                    ">

                    <img :src="activeImage.img
                        " class="
                            w-full
                            aspect-[3/4]

                            object-cover
                        ">

                </div>

            </div>

            <!-- GRID -->
            <div class="
                    grid
                    grid-cols-4
                    gap-3
                ">

                <div v-for="(img, index) in localImagenes" :key="img.product_image_id
                    " class="
                        slot

                        relative

                        aspect-[3/4]
                    " :class="{

                        activeSlot:

                            hoverIndex === index

                    }">

                    <!-- ========================= -->
                    <!-- DRAGGING -->
                    <!-- ========================= -->

                    <template v-if="
                        dragging
                    ">

                        <div class="
                                slotPlaceholder
                            ">

                            <div class="
                                    slotNumber
                                ">

                                {{ img.orden }}

                            </div>

                        </div>

                    </template>

                    <!-- ========================= -->
                    <!-- NORMAL -->
                    <!-- ========================= -->

                    <template v-else>

                        <div class="
                                card

                                relative

                                overflow-hidden

                                rounded-3xl

                                bg-white

                                shadow-[0_4px_12px_rgba(0,0,0,0.08)]

                                cursor-grab
                                active:cursor-grabbing

                                select-none
                            " @mousedown="
                                startDrag(
                                    $event,
                                    index
                                )
                                " @touchstart="
                                    startTouch(
                                        $event,
                                        index
                                    )
                                    " @touchmove.prevent="
                                        onTouchMove
                                    " @touchend="
                                        onTouchEnd
                                    ">

                            <!-- DELETE -->
                            <button class="
                                    absolute

                                    top-1
                                    right-1

                                    z-20

                                    w-7
                                    h-7

                                    rounded-full

                                    bg-red-500

                                    text-white

                                    flex
                                    items-center
                                    justify-center

                                    shadow-lg

                                    active:scale-90
                                    transition
                                " @click.stop="
                                    confirmarEliminar(
                                        img
                                    )
                                    ">

                                <i class="
                                        fa
                                        fa-times

                                        text-[11px]
                                    ">
                                </i>

                            </button>

                            <!-- FOTO -->
                            <img :src="img.img" draggable="false" @dragstart.prevent class="
        w-full
        h-full
        object-cover

        pointer-events-none
        select-none
    ">

                            <!-- PRINCIPAL -->
                            <div v-if="
                                Number(
                                    img.orden
                                ) === 1
                            " class="
                                    absolute

                                    top-1
                                    left-1

                                    px-2
                                    py-1

                                    rounded-full

                                    bg-[#FD7635]

                                    text-white

                                    text-[10px]

                                    font-bold

                                    shadow-lg
                                ">

                                Principal

                            </div>

                            <!-- ORDEN -->
                            <div class="
                                    absolute

                                    bottom-1
                                    left-1

                                    w-6
                                    h-6

                                    rounded-full

                                    bg-black/60

                                    text-white

                                    text-[11px]
                                    font-bold

                                    flex
                                    items-center
                                    justify-center
                                ">

                                {{ img.orden }}

                            </div>

                        </div>

                    </template>

                </div>

            </div>

        </div>

    </div>

    <AppSnackbar ref="snackbarRef" />

</template>

<script setup>

import {
    ref,
    watch,
    computed,
    nextTick
}
    from 'vue'

import axios
    from 'axios'

import gsap
    from 'gsap'

import AppSnackbar
    from '../../../../../components/layout/AppSnackbar.vue'

import {
    firma
}
    from '../../../../../services/security'

const props =
    defineProps({

        imagenes: {

            type: Array,

            default: () => []

        }

    })

const emit =
    defineEmits([

        'updated',

        'deleted'

    ])

const snackbarRef =
    ref(null)

const localImagenes =
    ref([])

const slotRefs =
    ref([])

const dragIndex =
    ref(null)

const hoverIndex =
    ref(null)

const dragging =
    ref(false)

const dragX =
    ref(0)

const dragY =
    ref(0)

const startX =
    ref(0)

const startY =
    ref(0)

const mouseX =
    ref(0)

const mouseY =
    ref(0)

const activeImage =
    ref(null)

/* =========================================
🔥 SYNC
========================================= */

watch(

    () => props.imagenes,

    (val) => {

        localImagenes.value =

            [...(val || [])]

                .sort(

                    (a, b) =>

                        Number(a.orden)

                        -

                        Number(b.orden)

                )

    },

    {

        immediate: true,

        deep: true

    }

)

/* =========================================
🔥 STYLE
========================================= */

const dragStyle =
    computed(() => {

        if (

            !dragging.value

        ) {

            return {}

        }

        return {

            zIndex: 999,

            transform:

                `translate(

                    ${dragX.value}px,

                    ${dragY.value}px

                )

                rotate(5deg)

                scale(1.05)`

        }

    })

/* =========================================
🔥 START DRAG
========================================= */

function startDrag(
    e,
    index
) {

    if (
        e.target.closest('button')
    ) {
        return
    }

    e.preventDefault()

    dragIndex.value =
        index

    mouseX.value =
        e.clientX

    mouseY.value =
        e.clientY

    activeImage.value =
        localImagenes.value[index]

    dragging.value =
        true

    startX.value =
        e.clientX

    startY.value =
        e.clientY

    dragX.value = 0
    dragY.value = 0

    document.body.style.userSelect = 'none'

    document.addEventListener(
        'mousemove',
        onDrag
    )

    document.addEventListener(
        'mouseup',
        stopDrag
    )
}

/* =========================================
🔥 TOUCH START
========================================= */

function startTouch(

    e,

    index

) {



    const touch =

        e.touches[0]

    mouseX.value =
        touch.clientX

    mouseY.value =
        touch.clientY

    dragIndex.value =
        index

    activeImage.value =

        localImagenes.value[
        index
        ]

    dragging.value =
        true

    startX.value =
        touch.clientX

    startY.value =
        touch.clientY

    dragX.value = 0

    dragY.value = 0

}

/* =========================================
🔥 TOUCH MOVE
========================================= */

function onTouchMove(e) {

    if (

        !dragging.value

    ) {

        return

    }

    const touch =

        e.touches[0]

    mouseX.value =
        touch.clientX

    mouseY.value =
        touch.clientY

    dragX.value =

        touch.clientX

        -

        startX.value

    dragY.value =

        touch.clientY

        -

        startY.value

    detectarHover(

        touch.clientX,

        touch.clientY

    )

}

/* =========================================
🔥 MOUSE MOVE
========================================= */

function onDrag(e) {

    if (

        !dragging.value

    ) {

        return

    }

    mouseX.value =
        e.clientX

    mouseY.value =
        e.clientY

    dragX.value =

        e.clientX

        -

        startX.value

    dragY.value =

        e.clientY

        -

        startY.value

    detectarHover(

        e.clientX,

        e.clientY

    )

}

/* =========================================
🔥 DETECTAR SLOT
========================================= */

function detectarHover(

    clientX,

    clientY

) {

    hoverIndex.value =
        null

    const slots =

        document.querySelectorAll(

            '.slot'

        )

    slots.forEach(

        (slot, index) => {

            const rect =

                slot.getBoundingClientRect()

            const inside =

                clientX >= rect.left

                &&

                clientX <= rect.right

                &&

                clientY >= rect.top

                &&

                clientY <= rect.bottom

            if (

                inside

            ) {

                hoverIndex.value =
                    index

            }

        }

    )

}

/* =========================================
🔥 TOUCH END
========================================= */

function onTouchEnd() {

    stopDrag()

}

/* =========================================
🔥 STOP DRAG
========================================= */
async function stopDrag() {

    document.body.style.userSelect = ''

    document.removeEventListener(
        'mousemove',
        onDrag
    )

    document.removeEventListener(
        'mouseup',
        stopDrag
    )

    if (
        dragIndex.value === null
    ) {

        resetDrag()

        return

    }

    if (
        hoverIndex.value === null
    ) {

        resetDrag()

        return

    }

    if (
        hoverIndex.value ===
        dragIndex.value
    ) {

        resetDrag()

        return

    }

    await swapImagenes(
        dragIndex.value,
        hoverIndex.value
    )

    resetDrag()

}

/* =========================================
🔥 RESET
========================================= */

function resetDrag() {

    dragging.value =
        false

    dragIndex.value =
        null

    hoverIndex.value =
        null

    activeImage.value =
        null

    dragX.value = 0

    dragY.value = 0

}

/* =========================================
🔥 SWAP
========================================= */

async function swapImagenes(

    from,

    to

) {

    const lista =

        [...localImagenes.value]

    const tmp =

        lista[from]

    lista[from] =
        lista[to]

    lista[to] =
        tmp

    lista.forEach(

        (x, i) => {

            x.orden = i + 1

        }

    )

    localImagenes.value =
        lista

    emit(

        'updated',

        lista

    )

    await nextTick()

    gsap.from(

        '.card',

        {

            scale: 0.9,

            duration: 0.25,

            stagger: 0.03

        }

    )

    await guardarOrden()

}

/* =========================================
🔥 GUARDAR
========================================= */

async function guardarOrden() {

    try {

        const seguridad =
            firma()

        await axios.post(

            '/QVhq/ordenarFotoProducto',

            {

                lista:

                    localImagenes.value.map(

                        x => ({

                            product_image_id:

                                x.product_image_id,

                            orden:

                                x.orden

                        })

                    ),

                xin:
                    seguridad.xin,

                yuan:
                    seguridad.yuan

            }

        )

    }
    catch (e) {

        console.error(e)

    }

}

/* =========================================
🔥 ELIMINAR
========================================= */

function confirmarEliminar(img) {

    snackbarRef.value?.open(

        '¿Eliminar esta foto? 🗑️',

        () => {

            eliminarFoto(img)

        }

    )

}

async function eliminarFoto(img) {

    try {

        const seguridad =
            firma()

        const r =
            await axios.post(

                '/CK2f/eliminarFotoProducto',

                {

                    product_image_id:

                        img.product_image_id,

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        if (

            r.data?.res === 'ok'

        ) {

            localImagenes.value =

                localImagenes.value.filter(

                    x =>

                        Number(

                            x.product_image_id

                        )

                        !==

                        Number(

                            img.product_image_id

                        )

                )

            localImagenes.value.forEach(

                (x, i) => {

                    x.orden = i + 1

                }

            )

            await guardarOrden()

            emit(

                'deleted',

                img

            )

        }

    }
    catch (e) {

        console.error(e)

    }

}

</script>

<style scoped>
.slot {

    position: relative;

    aspect-ratio: 3 / 4;

    min-height: 150px;

}

.slotPlaceholder {

    width: 100%;
    height: 100%;

    border: 3px dashed #d9d9d9;

    border-radius: 24px;

    background: #fafafa;

    display: flex;

    align-items: center;
    justify-content: center;

    transition: all .25s ease;

}

.slotNumber {

    font-size: 40px;

    font-weight: 800;

    color: #9ca3af;

}

.activeSlot .slotPlaceholder {

    border-color: #FD7635;

    background: #fff4ee;

    transform: scale(1.05);

}

.card {

    position: absolute;

    inset: 0;

    overflow: hidden;

    border-radius: 24px;

    background: white;

    box-shadow:

        0 20px 40px rgba(0, 0, 0, .20);

    cursor: grab;

    user-select: none;

    touch-action: none;

}

.card:active {

    cursor: grabbing;

}

.cardImage {

    width: 100%;

    height: 100%;

    object-fit: cover;

}

.deleteBtn {

    position: absolute;

    top: 6px;
    right: 6px;

    width: 30px;
    height: 30px;

    border-radius: 9999px;

    border: none;

    background: #ef4444;

    color: white;

    z-index: 50;

    cursor: pointer;

}

.principalBadge {

    position: absolute;

    top: 6px;
    left: 6px;

    background: #FD7635;

    color: white;

    font-size: 10px;

    font-weight: 700;

    padding: 4px 8px;

    border-radius: 9999px;

    z-index: 40;

}

.orderBadge {

    position: absolute;

    bottom: 6px;
    left: 6px;

    width: 28px;
    height: 28px;

    border-radius: 9999px;

    background: rgba(0, 0, 0, .70);

    color: white;

    font-size: 12px;

    font-weight: 700;

    display: flex;

    align-items: center;
    justify-content: center;

}

.card {

    -webkit-user-drag: none;

    -webkit-user-select: none;
    user-select: none;

}
</style>