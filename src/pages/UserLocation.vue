<template>
  <q-page class="bg-grey-2 q-py-sm">
    <FilterPoints></FilterPoints>
    <ActiveMap v-if="false"></ActiveMap>
  </q-page>
</template>

<script setup>
import ActiveMap from 'src/components/Generics/ActiveMap/ActiveMap.vue'
import FilterPoints from 'src/components/FormInputs/FilterPoints/FilterPoints.vue' 
</script>