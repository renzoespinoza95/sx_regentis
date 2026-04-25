<template>

  <div class="min-h-screen pattern-background">

    <!-- HEADER GLOBAL -->
    <NegpresHeader />

    <div class="content-container">

      <div class="bg-white rounded-3xl p-6 shadow-md">
        <OrderStatus />
        <CarritoHeader />

        <div class="mt-6 space-y-5">
          <CarritoItem title="Facial Cleanser" price="19.98" img="https://picsum.photos/80?random=21" />
          <CarritoItem title="Cream Cleanser" price="12.99" img="https://picsum.photos/80?random=22" />
          <CarritoItem title="Cleansing Oil" price="12.99" img="https://picsum.photos/80?random=23" />
        </div>
        <CarritoResumen />

      </div>

    </div>

  </div>

</template>

<script setup>
import { computed } from 'vue'
import OrderStatus from '../../../../modules/retail/consumidor/U8mi_carrito_pedido/components/OrderStatus.vue'
import NegpresHeader from '../../../../components/layout/NegpresHeaderBack.vue'
import CarritoItem from './components/CarritoItem.vue'
import CarritoCupon from './components/CarritoCupon.vue'
import CarritoResumen from './components/CarritoResumen.vue'

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
  background-repeat: repeat;
}
</style>