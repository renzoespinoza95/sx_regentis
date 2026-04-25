<template>

    <div class="space-y-3">

        <DateDivider text="Hoy" />

        <MessageBubble v-for="(m, i) in mensajes" :key="i" :message="m" />

    </div>

</template>

<script setup>
import MessageBubble from './MessageBubble.vue'
import DateDivider from './DateDivider.vue'

const mensajes = [
    { text: 'Hola!', from: 'other' },
    { text: 'Hola bro 😎', from: 'me' },
    { text: 'Todo bien?', from: 'other' },
    { text: 'Sí, trabajando en Regentis 🔥', from: 'me' },
    { text: 'Brutal 😏', from: 'other' }
]
</script>