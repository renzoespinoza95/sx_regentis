<template>

    <div class="min-h-screen pattern-background flex flex-col">

        <!-- HEADER -->
        <ChatHeader />

        <!-- MENSAJES -->
        <div class="flex-1 overflow-y-auto px-4 py-3">
            <MessageList />
        </div>

        <!-- INPUT -->
        <MessageInput />

    </div>

</template>

<script setup>
import ChatHeader from './components/ChatHeader.vue'
import MessageList from './components/MessageList.vue'
import MessageInput from './components/MessageInput.vue'
</script>

<style scoped>
.pattern-background {
    background-color: #e5e5f7;
    background-image:
        linear-gradient(135deg, #FCCBB5 25%, transparent 25%),
        linear-gradient(225deg, #FCCBB5 25%, transparent 25%),
        linear-gradient(45deg, #FCCBB5 25%, transparent 25%),
        linear-gradient(315deg, #FCCBB5 25%, #e5e5f7 25%);
    background-size: 20px 20px;
}
</style>