<template>

    <div class="
            mx-3
            my-3

            rounded-[28px]

            bg-white/90
            backdrop-blur-xl

            border border-white/70

            shadow-[0_8px_30px_rgba(0,0,0,0.06)]

            px-4
            py-4

            flex
            items-center
            justify-between

            active:scale-[0.98]

            transition-all
            duration-200

            hover:shadow-[0_10px_35px_rgba(0,0,0,0.08)]
        " @click="$emit('click')">

        <!-- =====================================
             LEFT
        ====================================== -->

        <div class="flex items-center gap-4 flex-1 min-w-0">

            <!-- =====================================
                 AVATAR
            ====================================== -->

            <!-- =====================================
     AVATAR
====================================== -->

            <div class="
        relative

        w-[62px]
        h-[62px]

        min-w-[62px]
        min-h-[62px]

        flex
        items-center
        justify-center
    ">

                <!-- IMG -->
                <img :src="chat.img" class="
            w-full
            h-full

            rounded-full

            object-cover

            shadow-lg

            ring-4
            ring-white
        ">

                <!-- BADGE -->
                <span v-if="chat.unread > 0" class="
            absolute

            top-0
            right-0

            translate-x-[15%]
            -translate-y-[15%]

            z-20

            bg-red-500

            text-white

            text-[10px]
            font-bold

            min-w-[22px]
            h-[22px]

            px-1

            flex
            items-center
            justify-center

            rounded-full

            shadow-lg

            border-2
            border-white
        ">
                    {{ chat.unread }}
                </span>

            </div>

            <!-- =====================================
                 TEXTOS
            ====================================== -->

            <div class="flex-1 min-w-0">

                <!-- NOMBRE -->
                <div class="
                        text-[18px]
                        font-bold

                        text-gray-800

                        truncate
                    ">
                    {{ chat.name }}
                </div>

                <!-- MENSAJE -->
                <div class="
                        mt-1

                        text-[14px]

                        text-gray-500

                        leading-6

                        break-words

                        overflow-hidden

                        line-clamp-2
                    ">
                    {{ chat.msg }}
                </div>

            </div>

        </div>

        <!-- =====================================
             RIGHT
        ====================================== -->

        <div class="
                ml-3

                flex
                flex-col

                items-end

                self-start
            ">

            <!-- HORA -->
            <div class="
                    text-[12px]

                    font-medium

                    text-[#FD7635]
                ">
                {{ chat.time }}
            </div>

        </div>

    </div>

</template>

<script setup>

defineProps({
    chat: Object
})

</script>