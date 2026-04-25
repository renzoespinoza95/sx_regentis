<template>

    <div class="min-h-screen pattern-background">

        <NegpresHeader />

        <div class="content-container">

            <div class="bg-white rounded-3xl p-5 shadow-md max-w-md mx-auto">

                <h2 class="text-center text-lg font-semibold mb-4">
                    Entrega
                </h2>

                <SectionCard>

                    <SectionItem icon="fa-map-marker" title="Dirección" subtitle="Av. Primavera 245, Surco, Lima" />

                    <SectionItem icon="fa-user" title="Contacto" subtitle="+51 900 123 456" />

                    <SectionItem icon="fa-clock-o" title="Hora de entrega" subtitle="Hoy 7:00 PM" />

                    <SectionItem icon="fa-credit-card" title="Método de pago" subtitle="Tarjeta" />

                </SectionCard>

                <DividerBox />

                <SummaryBox />

            </div>

        </div>

    </div>

</template>

<script setup>
import NegpresHeader from '../../../../components/layout/NegpresHeaderBack.vue'

import SectionCard from './components/SectionCard.vue'
import SectionItem from './components/SectionItem.vue'
import SummaryBox from './components/SummaryBox.vue'
import DividerBox from './components/DividerBox.vue'
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