<template>
  <div class="column shadow-6 q-py-lg poppins-semibold">

    <div class="row q-mx-sm q-my-md"><label
        class="q-field row no-wrap items-start q-field--outlined q-input q-field--rounded  q-field--dense  col"
        :class="{ 'q-field--focused q-field--highlighted': magic_flag }"
        for="f_684a646d-1760-483c-912c-af25da30ef9e"><!---->
        <div class="q-field__inner relative-position col self-stretch">
          <div class="q-field__control relative-position row no-wrap text-blue" tabindex="-1">
            <div class="q-field__control-container col relative-position row no-wrap q-anchor--skip"><input
                @focus="magic_flag = true" @blur="magic_flag = false" ref="autocomplete"
                class="q-field__native  pac-target-input" autofocus tabindex="0" v-model="address" type="text"
                autocomplete="off">
            </div>
            <div class="q-field__append q-field__marginal row no-wrap items-center q-anchor--skip">

              <q-btn v-if="address" @click="address = null" flat round color="grey-6" dense icon="format_clear" />
            </div>
          </div><!---->
        </div>
        <div class="q-field__after q-field__marginal row no-wrap items-center"><q-btn :loading="isLoading"
            @click="getMyLocation()" color="pink-7" round dense flat icon="gps_fixed">
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
            </template>
          </q-btn></div>
      </label></div>
    <!-- <div class="row q-mx-sm q-my-md">
      <q-input v-model="address" rounded ref="autocomplete" clearable clear-icon="format_clear" id="autocompletex"
        class="col" outlined color="blue" label="Localização" dense>

        <template v-slot:after>
          <q-btn :loading="isLoading" @click="getMyLocation()" color="pink-7" round dense flat icon="gps_fixed">
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
            </template>
          </q-btn>
        </template>
      </q-input>
    </div> -->
    <div class="row q-mx-sm"> <q-btn :loading="isLoading" outline rounded color="blue-10" @click="getMyLocation()"
        icon="travel_explore" no-caps>
        Encontrar

        <template v-slot:loading>
          <q-spinner-hourglass class="on-left" />
        </template></q-btn>
      <q-btn v-if="address && showClassifier" rounded class="q-ml-md" color="pink" outline @click="classifier = true"
        icon="hotel_class" no-caps>
        Avaliar

      </q-btn>
    </div>
  </div>

  <q-dialog v-model="classifier" persistent>
    <q-card class="q-pa-sm poppins-regular" style="width: 450px">
      <q-card-section class="row flex flex-center">
        <q-avatar icon="hotel_class" color="pink" text-color="white" />
      </q-card-section>
      <q-card-section class="row flex flex-center">
        <span class="q-ml-sm">Escolha a sua avaliação para:</span>
      </q-card-section>
      <div class="row flex flex-center poppins-semibold text-center">
        <span class="q-ml-sm">{{ address }}</span>
      </div>

      <q-card-section class="row  flex flex-center">
        <div class="q-gutter-y-md ">
          <q-rating v-model="ratingModel" size="3.5em" color="pink" icon="star_border" icon-selected="star" />
        </div>
      </q-card-section>
      <q-card-section class="row  col">
        <q-expansion-item class="col bg-grey-3" v-model="expanded" icon="eva-message-circle-outline"
          label="Adicionar Comentários" caption="ex.: Amei visitar o local">
          <q-card>
            <q-card-section>
              <q-input rounded dense v-model="comment" label="Comentário" outlined autogrow />
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn @click="sendClassifier()" v-if="ratingModel" :disable="!mapStore.isLogged" outline no-caps dense
          label="Confirmar" :color="!mapStore.isLogged ? 'grey' : 'blue'" v-close-popup />
        <q-btn outline no-caps dense label="Cancelar" color="red" v-close-popup />
      </q-card-actions>

      <div v-if="!mapStore.isLogged" class="row flex flex-center text-caption text-red text-bold"> <span
          class="text-italic">!!!Faça Login na
          plataforma</span>
      </div>
    </q-card>
  </q-dialog>
</template>


<script>

import { GeoPoint, getFirestore, onSnapshot, collection, doc, deleteDoc, setDoc, addDoc, orderBy, query } from 'firebase/firestore'

import useMapStore from 'src/stores/MapStore'
export default {
  data() {
    return {
      userLogged: null,
      db: getFirestore(this.$firebaseApp),
      lat: null,
      lng: null,
      comment: null,
      expanded: false,
      activeLocation: null,
      showClassifier: false,
      ratingModel: 0,
      classifier: false,
      magic_flag: false,
      address: null,
      mapStore: useMapStore(),
      isLoading: false,
      defaultCoords: { lat: 40.20564, lng: -8.41955 }
    }
  },
  methods: {
    async sendClassifier() {
      const dataObject = {
        date: Date.now(),
        address: this.activeLocation,
        comment: this.comment,
        fullName: this.userLogged?.displayName,
        lat: this.lat,
        lng: this.lng,
        rate: this.ratingModel,
        userId: this.userLogged?.uid,
        geoPoint: new GeoPoint(this.lat, this.lng),
      }

      console.log("dataObject::>  ", dataObject)
      console.log("this.db::>  ", this.db)

      try {
        await addDoc(collection(this.db, 'placesVisited'), dataObject)

        this.$q.notify({
          position: 'bottom',
          progress: true,
          html: true,
          message: `Avaliação enviada!`,
          color: 'green',
          multiLine: true,
          icon: 'done'
        });
      } catch (error) {
        this.$q.notify({
          position: 'bottom',
          progress: true,
          html: true,
          message: `Não foi possível fazer a avaliação!`,
          color: 'orange',
          multiLine: true,
          icon: 'warning'
        });
      }

    },
    async getMyLocation() {
      this.isLoading = true
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async position => {
            const res = await this.mapStore.getAddressFromLatLong(position.coords.latitude, position.coords.longitude)

            this.showUserLocationOnTheMap(position.coords.latitude, position.coords.longitude)


            this.isLoading = false
            if (res && res.code === 200) {
              this.address = res.data
              this.showClassifier = true
              this.activeLocation = res.data
              this.lat = position.coords.latitude
              this.lng = position.coords.longitude
            }
            else if (res && res.code === 400) {
              this.$q.notify({
                position: 'bottom',
                progress: true,
                html: true,
                message: `Erro ao validar a localização.`,
                color: 'orange',
                multiLine: true,
                icon: 'warning'
              });
            } else {
              this.$q.notify({
                position: 'bottom',
                progress: true,
                html: true,
                message: `Error do servidor.`,
                color: 'red',
                multiLine: true,
                icon: 'error'
              });
            }
          },
          error => {
            this.isLoading = false
            this.$q.notify({
              position: 'bottom',
              progress: true,
              html: true,
              message: `Localização bloqueada`,
              color: 'red',
              multiLine: true,
              icon: 'error'
            });
          }
        )
      } else {
        this.isLoading = false
        this.$q.notify({
          position: 'bottom',
          progress: true,
          html: true,
          message: `O navegador não suporta Geolocalização.`,
          color: 'red',
          multiLine: true,
          icon: 'warning'
        });
      }

    },
    showUserLocationOnTheMap(lat, lng) {
      //
      let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: new google.maps.LatLng(lat, lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      })

      new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map
      })
    }
  },
  mounted() {
    /* this.$refs.autocomplete.getNativeElement() */
    if (this.mapStore.isLogged) {
      this.userLogged = JSON.parse(localStorage.getItem("userLogged") || {})
    }
    let autocomplete = new google.maps.places.Autocomplete(
      this.$refs["autocomplete"], {
      bounds: new google.maps.LatLngBounds(
        new google.maps.LatLng(this.defaultCoords.lat, this.defaultCoords.lng)
      )
    }
    );


    autocomplete.addListener("place_changed", () => {
      let place = autocomplete.getPlace()
      this.address = place.formatted_address
      this.activeLocation = place.formatted_address

      this.showClassifier = true
      this.lat = place.geometry.location.lat()
      this.lng = place.geometry.location.lng()
      this.showUserLocationOnTheMap(place.geometry.location.lat(), place.geometry.location.lng())

    })
  }
}
</script>

<style lang="scss">
.pac-item {
  cursor: pointer;
  padding: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  line-height: 30px;
  text-align: left;
  border-top: 1px solid #e6e6e6;
  font-size: 13px;
  color: #515151;

  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-style: normal;
}

.pac-item-query {

  font-size: 13px;
}

.pac-container {

  padding-left: 2px;
  padding-right: 2px;
  margin-left: 2px;
  margin-right: 2px;


  width: inherit;
  width: initial;
  width: revert;
  width: revert-layer;
  width: unset;

}
</style>