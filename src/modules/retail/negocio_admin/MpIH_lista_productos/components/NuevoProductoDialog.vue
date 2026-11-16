<template>

    <div v-if="visible" class="
        fixed
        inset-0
        z-[999]
        bg-black/40
        flex
        items-center
        justify-center
        p-4
    ">

        <div ref="box" class="
                relative
                bg-white
                rounded-[32px]
                w-full
                max-w-md
                overflow-hidden
                shadow-[0_20px_60px_rgba(0,0,0,0.25)]
            ">

            <!-- HEADER -->
            <div class="
                    relative
                    px-5
                    pt-5
                    pb-4
                    text-white
                " style="
                    background:
                    linear-gradient(
                        135deg,
                        #FD7635 0%,
                        #ff995e 100%
                    );
                ">

                <!-- CERRAR -->
                <button class="
                        absolute
                        top-4
                        right-4
                        w-10
                        h-10
                        rounded-full
                        bg-white/20
                        backdrop-blur
                        text-white
                        flex
                        items-center
                        justify-center
                        active:scale-95
                        transition
                    " @click="close">

                    <i class="fa fa-times"></i>

                </button>

                <!-- TITULO -->
                <div>

                    <div class="
                        text-2xl
                        font-black
                    ">

                        {{

                            form.editando

                                ?

                                'Editar producto'

                                :

                                'Nuevo producto'

                        }}

                    </div>

                </div>

            </div>

            <!-- BODY -->
            <div class="
                    p-5
                    space-y-5
                    max-h-[70vh]
                    overflow-y-auto
                    custom-scroll
                ">

                <!-- NOMBRE -->
                <div>

                    <label class="
                            text-xs
                            font-bold
                            text-gray-500
                            uppercase
                            tracking-wide
                            mb-2
                            block
                        ">

                        Nombre producto

                    </label>

                    <input v-model="form.name" placeholder="Ej: Azúcar Blanca CARTAVIO Bolsa 1Kg" class="
                            w-full
                            h-[54px]
                            rounded-2xl
                            bg-[#fff4ee]
                            border-2
                            border-transparent
                            px-4
                            outline-none
                            transition
                            focus:border-[#FD7635]
                            focus:bg-white
                        " />

                </div>

                <!-- PRECIO + STOCK -->
                <div class="
                        grid
                        grid-cols-2
                        gap-4
                    ">

                    <!-- PRECIO -->
                    <div>

                        <label class="
                                text-xs
                                font-bold
                                text-gray-500
                                uppercase
                                tracking-wide
                                mb-2
                                block
                            ">

                            Precio

                        </label>

                        <div class="
                                relative
                            ">

                            <span class="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-[#FD7635]
                                    font-bold
                                ">

                                S/

                            </span>

                            <input v-model="form.price" type="number" class="
                                    w-full
                                    h-[54px]
                                    rounded-2xl
                                    bg-[#fff4ee]
                                    border-2
                                    border-transparent
                                    pl-10
                                    pr-4
                                    outline-none
                                    transition
                                    focus:border-[#FD7635]
                                    focus:bg-white
                                " />

                        </div>

                    </div>

                    <!-- STOCK -->
                    <div>

                        <label class="
                                text-xs
                                font-bold
                                text-gray-500
                                uppercase
                                tracking-wide
                                mb-2
                                block
                            ">

                            Stock

                        </label>

                        <input v-model="form.stock" type="number" class="
                                w-full
                                h-[54px]
                                rounded-2xl
                                bg-[#fff4ee]
                                border-2
                                border-transparent
                                px-4
                                outline-none
                                transition
                                focus:border-[#FD7635]
                                focus:bg-white
                            " />

                    </div>

                </div>

                <!-- DESCRIPCION -->
                <div>

                    <label class="
                            text-xs
                            font-bold
                            text-gray-500
                            uppercase
                            tracking-wide
                            mb-2
                            block
                        ">

                        Descripción

                    </label>

                    <textarea v-model="form.description" rows="4" placeholder="Describe el producto..." class="
                            w-full
                            rounded-2xl
                            bg-[#fff4ee]
                            border-2
                            border-transparent
                            p-4
                            outline-none
                            resize-none
                            transition
                            focus:border-[#FD7635]
                            focus:bg-white
                        "></textarea>

                </div>

                <!-- VARIANTES -->
                <ProductoVariantesEditor v-model="form.variantes_json" />

                <!-- CATEGORIAS -->
                <div>

                    <label class="
                            text-xs
                            font-bold
                            text-gray-500
                            uppercase
                            tracking-wide
                            mb-3
                            block
                        ">

                        Categorías

                    </label>

                    <div class="
                            flex
                            flex-wrap
                            gap-2
                        ">

                        <button v-for="c in categorias" :key="c.category_id" @click="toggleCategoria(c)" class="
                                px-4
                                py-3
                                rounded-full
                                text-xs
                                font-semibold
                                transition
                                active:scale-95
                                shadow-sm
                            " :class="isSelected(c)

                                ?

                                'bg-[#FD7635] text-white shadow-lg scale-105'

                                :

                                'bg-[#fff4ee] text-[#FD7635]'
                                ">

                            📦
                            {{ c.descripcion }}

                        </button>

                    </div>

                </div>

            </div>

            <!-- FOOTER -->
            <div class="
                    p-5
                    border-t
                    bg-white
                ">

                <button :disabled="!canSave" class="
                        w-full
                        h-[56px]
                        rounded-2xl
                        text-white
                        font-bold
                        text-lg
                        shadow-[0_10px_25px_rgba(253,118,53,0.35)]
                        active:scale-[0.98]
                        transition
                        disabled:opacity-40
                        disabled:shadow-none
                        disabled:cursor-not-allowed
                    " style="
                        background:
                        linear-gradient(
                            135deg,
                            #FD7635 0%,
                            #ff995e 100%
                        );
                    " @click="canSave && guardar()">

                    Guardar ✨

                </button>

            </div>

        </div>

    </div>

</template>

<script setup>
import ProductoVariantesEditor
    from './ProductoVariantesEditor.vue'
import {
    ref,
    nextTick,
    computed
}
    from 'vue'

import axios
    from 'axios'

import gsap
    from 'gsap'

import {
    firma
}
    from '../../../../../services/security'

import {
    useUsuario
}
    from '../../../../../services/usuarioService'

import {
    bus,
    hideBottomNav,
    showBottomNav
}
    from '../../../../../services/eventBus.js'

const emit =
    defineEmits([

        'created'

    ])

const {
    getNegId
} = useUsuario()

const visible =
    ref(false)

const box =
    ref(null)

const categorias =
    ref([])

const seleccionadas =
    ref([])

const form =
    ref({

        product_id:
            null,

        name:
            '',

        marca_des:
            'Genérico',

        price:
            '',

        stock:
            9999, // 🔥 CAMBIADO: Stock inicial predeterminado en 9999

        variantes_json: {
            atributo: '',
            opciones: []
        },

        description:
            '',

        editando:
            false

    })

/* =========================================
🔥 VALID FORM
========================================= */
const canSave = computed(() => {
    return (
        String(form.value.name || '').trim().length > 0
        && Number(form.value.price) >= 0
        && Number(form.value.stock) >= 0
        && seleccionadas.value.length > 0
    )
})

/* =========================================
🔥 OPEN
========================================= */

async function open(producto = null) {

    /* =========================================
    🔥 HIDE BOTTOMNAV
    ========================================= */

    hideBottomNav()

    seleccionadas.value = []

    form.value = {

        product_id:
            null,

        name:
            '',

        marca_des:
            'Genérico',

        price:
            '',

        stock:
            9999, // 🔥 CAMBIADO: Seteado en 9999 para que al abrir como nuevo aparezca este valor

        description:
            '',

        variantes_json: {
            atributo: '',
            opciones: []
        },

        editando:
            false

    }

    /* =========================================
    🔥 CARGAR CATEGORIAS
    ========================================= */

    await cargarCategorias()

    /* =========================================
    🔥 MODO EDITAR
    ========================================= */

    if (producto) {

        form.value = {

            product_id:
                producto.product_id,

            name:
                producto.name || '',

            marca_des:
                producto.marca_des || 'Genérico',

            price:
                producto.price || '',

            stock:
                producto.stock || '', // 💡 Mantiene el stock real del producto si se está editando

            description:
                producto.description || '',

            variantes_json:

                producto.variantes_json

                    ?

                    JSON.parse(

                        producto.variantes_json

                    )

                    :

                    {

                        atributo: '',

                        opciones: []

                    },

            editando:
                true

        }

        seleccionadas.value =

            categorias.value

                .filter(c => {

                    return (

                        c.productos || []

                    ).some(p =>

                        Number(
                            p.product_id
                        )

                        ===

                        Number(
                            producto.product_id
                        )

                    )

                })

                .map(c => ({

                    category_id:
                        c.category_id

                }))

    }

    /* =========================================
    🔥 SHOW
    ========================================= */

    visible.value = true

    await nextTick()

    gsap.fromTo(
        box.value,
        {
            scale: 0.7,
            opacity: 0
        },
        {
            scale: 1,
            opacity: 1,
            duration: 0.25,
            ease: 'power2.out'
        }
    )

}

/* =========================================
🔥 CLOSE
========================================= */

function close() {

    gsap.to(

        box.value,

        {

            scale: 0.7,

            opacity: 0,

            duration: 0.2,

            onComplete: () => {

                visible.value = false

                /* =========================================
                🔥 SHOW BOTTOMNAV
                ========================================= */

                showBottomNav()

            }

        }

    )

}

/* =========================================
🔥 CATEGORIAS
========================================= */

async function cargarCategorias() {

    try {

        const seguridad =
            firma()

        const r =
            await axios.post(

                '/MylW/listar_categorias',

                {

                    neg_id:
                        getNegId(),

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        categorias.value =
            r.data?.data
            || []

    } catch (e) {

        console.error(e)

    }

}

/* =========================================
🔥 TOGGLE
========================================= */

function toggleCategoria(c) {

    const existe =

        seleccionadas.value.find(

            x =>

                Number(
                    x.category_id
                )

                ===

                Number(
                    c.category_id
                )

        )

    if (existe) {

        seleccionadas.value =

            seleccionadas.value.filter(

                x =>

                    Number(
                        x.category_id
                    )

                    !==

                    Number(
                        c.category_id
                    )

            )

        return

    }

    seleccionadas.value.push({

        category_id:
            c.category_id

    })

}

/* =========================================
🔥 CHECK
========================================= */

function isSelected(c) {

    return seleccionadas.value.some(

        x =>

            Number(
                x.category_id
            )

            ===

            Number(
                c.category_id
            )

    )

}

/* =========================================
🔥 GUARDAR
========================================= */

async function guardar() {

    try {

        const seguridad =
            firma()

        const res =
            await axios.post(

                '/RvKx/nuevoProducto',

                {

                    product_id:
                        form.value.product_id,

                    editando:
                        form.value.editando,

                    neg_id:
                        getNegId(),

                    name:
                        form.value.name,

                    marca_des:
                        form.value.marca_des
                        || 'Genérico',

                    price:
                        Number(
                            form.value.price
                        ),

                    stock:
                        Number(
                            form.value.stock
                        ),

                    description:
                        form.value.description,

                    categorias:
                        seleccionadas.value,

                    variantes_json:

                        JSON.stringify(

                            form.value.variantes_json

                            ||

                            {

                                atributo: '',

                                opciones: []

                            }

                        ),

                    xin:
                        seguridad.xin,

                    yuan:
                        seguridad.yuan

                }

            )

        /* =========================================
            🔥 RESPONSE COMPLETO
        ========================================= */

        emit(

            'created',

            res.data

        )

        close()

    } catch (e) {

        console.error(e)

    }

}

defineExpose({

    open

})

</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {

    width: 6px;

}

.custom-scroll::-webkit-scrollbar-thumb {

    background:
        rgba(0, 0, 0, 0.15);

    border-radius:
        999px;

}
</style>