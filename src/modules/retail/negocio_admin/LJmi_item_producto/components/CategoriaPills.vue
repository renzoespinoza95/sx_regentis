<!-- =========================================
CategoriaPills.vue
========================================= -->

<template>

    <div>

        <!-- LABEL -->
        <label class="
                text-sm
                text-gray-600
                block
                mb-2
            ">
            Categoría
        </label>

        <!-- PILLS -->
        <div class="
                flex
                flex-wrap
                gap-3
            ">

            <div v-for="item in items" :key="item.id" @click="toggle(item.id)" class="
                    px-4
                    py-3
                    rounded-full
                    text-sm
                    flex
                    items-center
                    gap-2
                    cursor-pointer
                    transition
                    active:scale-95
                    select-none
                " :class="model.includes(item.id)
                        ? 'bg-[#FD7635] text-white shadow-lg'
                        : 'bg-[#fff1ea] text-[#FD7635]'
                    ">

                <!-- EMOJI -->
                <span>
                    {{ item.emoji }}
                </span>

                <!-- TEXTO -->
                <span>
                    {{ item.nombre }}
                </span>

            </div>

        </div>

    </div>

</template>

<script setup>

const props = defineProps({

    items: {
        type: Array,
        default: () => []
    }

})

const model = defineModel({

    default: []

})

/* =========================================
TOGGLE
========================================= */

function toggle(id) {

    /* =========================================
       REMOVE
    ========================================= */

    if (
        model.value.includes(id)
    ) {

        model.value =
            model.value.filter(
                x => x !== id
            )

        return

    }

    /* =========================================
       ADD
    ========================================= */

    model.value.push(id)

}

</script>