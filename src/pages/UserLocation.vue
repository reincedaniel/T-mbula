<template>
  <q-page class="bg-grey-2">
    <div class="bg-white" id="filterAddress">
      <FilterPoints></FilterPoints>
    </div>
    <section id="map">
      <ActiveMap v-if="false"></ActiveMap>
    </section>


  </q-page>
</template>

<script setup>
import ActiveMap from 'src/components/Generics/ActiveMap/ActiveMap.vue'
import FilterPoints from 'src/components/FormInputs/FilterPoints/FilterPoints.vue' 
</script>

<style>
#filterAddress {
  position: relative;
  z-index: 1;
}

#map {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgb(236, 232, 232);
}
</style>