<template>
  <q-card class="q-mx-sm q-py-sm shadow-5">
    <q-card-actions>
      <q-input clearable clear-icon="format_clear" class="col" outlined color="blue" v-model="point" label="Localização"
        dense>

        <template v-slot:append>
          <q-btn :loading="isLoading" @click="getMyLocation()" color="pink-7" round dense flat icon="gps_fixed">
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
            </template>
          </q-btn>
        </template>
      </q-input>
    </q-card-actions>

    <q-card-actions>
      <q-btn :loading="isLoading" dense color="blue" @click="getMyLocation()" icon="travel_explore" no-caps>
        Encontrar

        <template v-slot:loading>
          <q-spinner-hourglass class="on-left" />
        </template></q-btn>
    </q-card-actions>
  </q-card>
  <!--  <q-list>
    <q-item>
      <q-item-section>
        <q-input v-model="search" outlined dense label-color="text-bold text-grey-5" class="paragraph-body-md"
          bg-color="white" label="Teste">
          <template v-slot:after>
            <q-icon v-if="search == ''" class="cursor-pointer color-primary-medium" size="sm" name="search" />

            <q-icon v-if="search !== ''" class="cursor-pointer color-primary-medium" size="sm" name="clear" />
          </template>
        </q-input>
      </q-item-section>
    </q-item>

    <template v-for="(item, index) in 10" :key="index">
      <q-item clickable v-close-popup>
        <q-item-section>
          <q-item-label>{{ item }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-list> -->

  <!-- <pre>{{ mapStore }}</pre> -->
</template>

<script setup>
import { ref } from 'vue'
import useMapStore from 'src/stores/MapStore'
const mapStore = useMapStore()
import { Loading, useQuasar } from 'quasar';
const $q = useQuasar();
const point = ref(null)
const search = ref(null)
const isLoading = ref(false)

const getMyLocation = () => {
  isLoading.value = true
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async position => {
        console.log(position.coords.latitude)
        console.log(position.coords.longitude)
        console.log("---")
        const res = await mapStore.getAddressFromLatLong(position.coords.latitude, position.coords.longitude)
        isLoading.value = false
        if (res && res.code === 200) {
          point.value = res.data
          /* $q.notify({
            position: 'top',
            progress: true,
            html: true,
            message: `Operação realizada com sucesso.`,
            color: 'green',
            multiLine: true,
            icon: 'done'
          }); */

        } else {
          $q.notify({
            position: 'top',
            progress: true,
            html: true,
            message: `Não foi possível realizar esta operação.`,
            color: 'orange',
            multiLine: true,
            icon: 'warning'
          });
        }
      },
      error => {
        console.log(error.message)
        $q.notify({
          position: 'top',
          progress: true,
          html: true,
          message: `Não foi possível realizar esta operação.`,
          color: 'orange',
          multiLine: true,
          icon: 'warning'
        });
      }
    )
  } else {
    console.log("Your browser does not support geolocation API")
    $q.notify({
      position: 'top',
      progress: true,
      html: true,
      message: `O navegador não suporta Geolocalização.`,
      color: 'red',
      multiLine: true,
      icon: 'warning'
    });
  }

}
</script>
