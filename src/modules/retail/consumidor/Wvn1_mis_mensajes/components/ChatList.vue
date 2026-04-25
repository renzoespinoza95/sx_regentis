<template>

    <div class="divide-y">

        <ChatItem v-for="chat in chats" :key="chat.id" :chat="chat" />

    </div>

</template>

<script setup>
import ChatItem from './ChatItem.vue'

const chats = [
    { id: 1, name: 'John', msg: 'Hellooo', time: '6:00 PM', img: 'https://i.pravatar.cc/50?1' },
    { id: 2, name: 'Rahul', msg: 'Hellooo', time: '5:00 PM', img: 'https://i.pravatar.cc/50?2' },
    { id: 3, name: 'Krishna', msg: 'Hellooo', time: '3:30 PM', img: 'https://i.pravatar.cc/50?3' },
    { id: 4, name: 'David', msg: 'Hellooo', time: '12:30 PM', img: 'https://i.pravatar.cc/50?4' },
    { id: 5, name: 'Jonh', msg: 'Hellooo', time: 'Ayer', img: 'https://i.pravatar.cc/50?5' },
    { id: 6, name: 'Mike', msg: 'Hellooo', time: 'Ayer', img: 'https://i.pravatar.cc/50?6' },
    { id: 7, name: 'Joseph', msg: 'Hellooo', time: '07/05/20', img: 'https://i.pravatar.cc/50?7' },
    { id: 8, name: 'Alize', msg: 'Hellooo', time: '07/05/20', img: 'https://i.pravatar.cc/50?8' }
]
</script>