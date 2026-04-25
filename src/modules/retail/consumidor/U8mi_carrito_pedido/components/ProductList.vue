<template>

    <div class="mt-6 space-y-4">

        <h3 class="font-semibold text-sm">Orders Information</h3>

        <ProductItem name="Cucumber" price="138.60" old="150.65" qty="1" img="https://picsum.photos/80?1" />

        <ProductItem name="Tomato" price="137.00" old="150.65" qty="2" img="https://picsum.photos/80?2" />

        <ProductItem name="Eggplant" price="140.10" old="150.65" qty="3" img="https://picsum.photos/80?3" />

    </div>

</template>

<script setup>
import ProductItem from './ProductItem.vue'
</script>