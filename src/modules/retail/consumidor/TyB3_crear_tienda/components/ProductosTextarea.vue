<template>

  <div>

    <div class="
            text-sm
            font-semibold
            text-gray-700
        ">

      Que productos vende en su negocio

    </div>

    <div class="
            text-xs
            text-[#0F0F0F]
            mt-1
        ">

      nombre al menos unos 4 diferentes

    </div>

    <textarea v-model="modelValue" rows="6" class="
                mt-3

                w-full

                rounded-2xl

                border
                border-gray-300

                bg-white

                p-4

                resize-none

                outline-none

                focus:ring-2
                focus:ring-[#FD7635]
            ">
        </textarea>

  </div>

</template>

<script setup>

const modelValue =
  defineModel({

    default: ''

  })

</script>