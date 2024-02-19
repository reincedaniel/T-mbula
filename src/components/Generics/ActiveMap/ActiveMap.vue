<template>
    <GoogleMap api-key="AIzaSyCl9I_SprYw1vu2jKd-CR8QBiB9opj_eZY" style="width: 100%; height: 90vh" :center="center"
        :zoom="15">
        <Marker :options="{ position: center }" />
        <Marker :options="{ position: center2 }" />
    </GoogleMap>
</template>
  
<script setup>
import { ref } from 'vue'
import { GoogleMap, Marker, Polyline } from "vue3-google-map";
const centerCoords = ref(null)
const center = { lat: 40.1922936, lng: -8.4130213, label: "L", title: "ISEC" };
const center2 = { lat: 40.192000, lng: -8.42 };

const successCallback = (position) => {
    centerCoords.value = position
};

const errorCallback = (error) => {
    centerCoords.value = null
};

navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
console.log("centerCoords: ", centerCoords)
</script>