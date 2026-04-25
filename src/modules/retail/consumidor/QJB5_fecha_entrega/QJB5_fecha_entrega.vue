<template>

    <div class="min-h-screen pattern-background">

        <NegpresHeader />

        <div class="content-container">

            <div class="bg-white rounded-3xl p-6 shadow-md max-w-md mx-auto">

                <OrderStatus />

                <h2 class="text-lg font-semibold mt-6">
                    When you are going ?
                </h2>

                <CalendarHeader />

                <CalendarGrid />

                <NextButton />

            </div>

        </div>

    </div>

</template>

<script setup>
import NegpresHeader from '../../../../components/layout/NegpresHeaderBack.vue'
import OrderStatus from '../../../../modules/retail/consumidor/U8mi_carrito_pedido/components/OrderStatus.vue'
import ProgressSteps from './components/ProgressSteps.vue'
import CalendarHeader from './components/CalendarHeader.vue'
import CalendarGrid from './components/CalendarGrid.vue'
import NextButton from './components/NextButton.vue'
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