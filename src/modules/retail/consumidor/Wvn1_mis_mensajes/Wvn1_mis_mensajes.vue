<template>

    <div class="min-h-screen bg-white flex flex-col">

        <!-- HEADER TIPO CHATS -->
        <ChatsHeader />

        <!-- BUSCADOR -->
        <SearchBar />

        <!-- LISTA FULL -->
        <div class="flex-1 overflow-y-auto">
            <ChatList />
        </div>

    </div>

</template>

<script setup>
import ChatsHeader from './components/ChatsHeader.vue'
import SearchBar from './components/SearchBar.vue'
import ChatList from './components/ChatList.vue'
</script>

<style scoped>
.content-container {
    width: 100%;
    max-width: 1400px;
    margin: auto;

    padding-top: 50px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 40px;
}

.pattern-background {
    background-color: #e5e5f7;
    background-image:
        linear-gradient(135deg, #FCCBB5 25%, transparent 25%),
        linear-gradient(225deg, #FCCBB5 25%, transparent 25%),
        linear-gradient(45deg, #FCCBB5 25%, transparent 25%),
        linear-gradient(315deg, #FCCBB5 25%, #e5e5f7 25%);
    background-position: 10px 0, 10px 0, 0 0, 0 0;
    background-size: 20px 20px;
}
</style>