<template>

    <div class="header-wrapper">

        <div class="header-inner">

            <div class="flex items-center gap-3 text-white">
                <i class="fa fa-arrow-left text-lg"></i>
                <span class="font-semibold">Fantasmas</span>
            </div>

            <i class="fa fa-ellipsis-v text-white"></i>

        </div>

    </div>

</template>

<style scoped>
.header-wrapper {
    width: 100%;
    background: #FD7635;
    position: sticky;
    top: 0;
    z-index: 999;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    padding: 16px 0;
}

.header-inner {
    max-width: 1400px;
    margin: auto;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
}
</style>