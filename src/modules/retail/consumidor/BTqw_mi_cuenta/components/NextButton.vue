<template>

    <div class="mt-6">

        <button :disabled="disabled" class="
                w-full
                h-14
                rounded-2xl
                bg-[#FD7635]
                text-white
                font-black
                text-lg
                shadow-xl
                flex
                items-center
                justify-center
                gap-2
                active:scale-[0.98]
                transition
            " :class="{

                'opacity-50 cursor-not-allowed':
                    disabled

            }">

            💾 Guardar

        </button>

    </div>

</template>
<script setup>
defineProps({

    disabled: {

        type: Boolean,

        default: false

    }

})
</script>