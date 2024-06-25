<template>
  <div class="column shadow-6 q-py-lg poppins-semibold">
    <div class="" v-if="false">
      <span
        >#stateMapStore:
        <pre>{{ stateMapStore && stateMapStore.address }}</pre>
      </span>
      <span>#EstimatedTime: {{ estimatedTime }}</span>
      <span>MyPosition: {{ myPosition }}</span>
      <span>FinalPosition: {{ mapStore.finalPosition }}</span>
      <q-btn color="red" icon="check" label="1" @click="getDistance()" />
    </div>
    <div class="row q-mx-sm q-my-md">
      <label
        class="q-field row no-wrap items-start q-field--outlined q-input q-field--rounded q-field--dense col"
        :class="{ 'q-field--focused q-field--highlighted': magic_flag }"
        for="f_684a646d-1760-483c-912c-af25da30ef9e"
        ><!---->
        <div class="q-field__inner relative-position col self-stretch">
          <div
            class="q-field__control relative-position row no-wrap text-blue"
            tabindex="-1"
          >
            <div
              class="q-field__control-container col relative-position row no-wrap q-anchor--skip"
            >
              <input
                @focus="magic_flag = true"
                @blur="magic_flag = false"
                ref="autocomplete"
                class="q-field__native pac-target-input"
                autofocus
                tabindex="0"
                v-model="address"
                type="text"
                autocomplete="off"
              />
            </div>
            <div
              class="q-field__append q-field__marginal row no-wrap items-center q-anchor--skip"
            >
              <q-btn
                v-if="address"
                @click="address = null"
                flat
                round
                color="grey-6"
                dense
                icon="format_clear"
              />
            </div>
          </div>
          <!---->
        </div>
        <div class="q-field__after q-field__marginal row no-wrap items-center">
          <q-btn
            :loading="isLoading"
            @click="getMyLocation()"
            color="pink-7"
            round
            dense
            flat
            icon="gps_fixed"
          >
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
            </template>
          </q-btn>
        </div>
      </label>
    </div>
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
    <div class="row q-mx-sm">
      <q-btn
        :loading="isLoading"
        outline
        rounded
        color="blue-10"
        @click="getMyLocation()"
        icon="travel_explore"
        no-caps
      >
        Encontrar

        <template v-slot:loading>
          <q-spinner-hourglass class="on-left" /> </template
      ></q-btn>
      <q-btn
        v-if="address && showClassifier"
        rounded
        class="q-ml-md"
        color="pink"
        outline
        @click="classifier = true"
        icon="hotel_class"
        no-caps
      >
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

      <q-card-section class="row flex flex-center">
        <div class="q-gutter-y-md">
          <q-rating
            v-model="ratingModel"
            size="3.5em"
            color="pink"
            icon="star_border"
            icon-selected="star"
          />
        </div>
      </q-card-section>
      <q-card-section class="row col">
        <q-expansion-item
          class="col bg-grey-3"
          v-model="expanded"
          icon="eva-message-circle-outline"
          label="Adicionar Comentários"
          caption="ex.: Amei visitar o local"
        >
          <q-card>
            <q-card-section>
              <q-input
                rounded
                dense
                v-model="comment"
                label="Comentário"
                outlined
                autogrow
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          outline
          no-caps
          dense
          label="Cancelar"
          color="red"
          v-close-popup
        />

        <q-btn
          @click="sendClassifier()"
          v-if="ratingModel"
          :disable="!mapStore.isLogged"
          no-caps
          dense
          label="Confirmar"
          :color="!mapStore.isLogged ? 'grey' : 'blue'"
          v-close-popup
        />
      </q-card-actions>

      <div
        v-if="!mapStore.isLogged"
        class="row flex flex-center text-caption text-red text-bold"
      >
        <span class="text-italic">!!!Faça Login na plataforma</span>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { uuid } from "vue-uuid";
import {
  GeoPoint,
  getFirestore,
  onSnapshot,
  collection,
  doc,
  deleteDoc,
  setDoc,
  addDoc,
  orderBy,
  query,
} from "firebase/firestore";

import useMapStore from "src/stores/MapStore";
import { storeToRefs } from "pinia";
import hermes from "src/composables/hermes";
import api from "src/services/api";

export default {
  data() {
    return {
      pathPhoto:
        "data:image/png;base64,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",
      visitedPlaces: [],
      userLogged: null,
      estimatedTime: "",
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
      address: storeToRefs(useMapStore()).address,
      mapStore: useMapStore(),
      stateMapStore: storeToRefs(useMapStore()),
      isLoading: false,
      myPosition: {
        lat: 0,
        lng: 0,
      },
      pontosDeInteresse: [],
      defaultCoords: { lat: 40.20564, lng: -8.41955 },
    };
  },
  computed: {
    listVisitedPlaces() {
      return this.visitedPlaces;
    },
  },
  methods: {
    async sendClassifier() {
      this.userLogged = JSON.parse(localStorage.getItem("userLogged") || {});
      const dataObject = {
        _id: uuid.v1(),
        date: Date.now(),
        address: this.activeLocation,
        comment: this.comment,
        fullName: this.userLogged?.displayName,
        lat: this.lat,
        lng: this.lng,
        rate: this.ratingModel,
        userId: this.userLogged?.uid,
        geoPoint: new GeoPoint(this.lat, this.lng),
        raw: this.userLogged,
      };

      console.log("dataObject::>  ", dataObject);
      console.log("this.db::>  ", this.db);

      try {
        // await addDoc(collection(this.db, "placesVisited"), dataObject);
        const response = await api.addPlace(dataObject);
        this.$q.notify({
          position: "bottom",
          progress: true,
          html: true,
          message: `Avaliação enviada!`,
          color: "green",
          multiLine: true,
          icon: "done",
        });

        this.comment = null;
        this.ratingModel = null;
        this.fetchPlaces();
      } catch (error) {
        this.$q.notify({
          position: "bottom",
          progress: true,
          html: true,
          message: `Não foi possível fazer a avaliação!`,
          color: "orange",
          multiLine: true,
          icon: "warning",
        });
      }
    },
    async getMyLocation() {
      this.isLoading = true;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const res = await this.mapStore.getAddressFromLatLong(
              position.coords.latitude,
              position.coords.longitude
            );
            this.myPosition.lat = position.coords.latitude;
            this.myPosition.lng = position.coords.longitude;

            this.stateMapStore.myPosition.lat = position.coords.latitude;
            this.stateMapStore.myPosition.lng = position.coords.longitude;

            this.showUserLocationOnTheMap(
              position.coords.latitude,
              position.coords.longitude
            );

            this.isLoading = false;
            if (res && res.code === 200) {
              this.address = res.data;
              this.showClassifier = true;
              this.activeLocation = res.data;
              this.lat = position.coords.latitude;
              this.lng = position.coords.longitude;
            } else if (res && res.code === 400) {
              this.$q.notify({
                position: "bottom",
                progress: true,
                html: true,
                message: `Erro ao validar a localização.`,
                color: "orange",
                multiLine: true,
                icon: "warning",
              });
            } else {
              this.$q.notify({
                position: "bottom",
                progress: true,
                html: true,
                message: `Error do servidor.`,
                color: "red",
                multiLine: true,
                icon: "error",
              });
            }
          },
          (error) => {
            this.isLoading = false;
            this.$q.notify({
              position: "bottom",
              progress: true,
              html: true,
              message: `Localização bloqueada`,
              color: "red",
              multiLine: true,
              icon: "error",
            });
          }
        );
      } else {
        this.isLoading = false;
        this.$q.notify({
          position: "bottom",
          progress: true,
          html: true,
          message: `O navegador não suporta Geolocalização.`,
          color: "red",
          multiLine: true,
          icon: "warning",
        });
      }
    },
    getDistance() {
      hermes.send("change-updates-1", { getDistance: "Outras Coisas" }, "all");
    },

    showUserLocationOnTheMap(lat, lng) {
      //
      let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 18,
        center: new google.maps.LatLng(lat, lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      });

      new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map,
      });

      const service = new google.maps.places.PlacesService(map);
      service.nearbySearch(
        {
          location: { lat: lat, lng: lng },
          radius: 5000,
          type: ["point_of_interest"],
        },
        (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            this.mapStore.poi = results;
            results.forEach((poi) => {
              const marker = new window.google.maps.Marker({
                position: poi.geometry.location,
                map: map,
              });
              marker.addListener("click", () => {
                if (infoWindow) {
                  infoWindow.close();
                }
                infoWindow = new window.google.maps.InfoWindow({
                  content: `<h3>${poi.name}</h3><p>${poi.vicinity}</p>`,
                });
                infoWindow.open(map, marker);
              });
            });
          }
        }
      );

      hermes.on("change-updates-1", (logs) => {
        const directionsService = new google.maps.DirectionsService();

        const directionsRenderer = new google.maps.DirectionsRenderer();

        const origin = `${this.myPosition.lat},${this.myPosition.lng}`;
        const destination = `${this.mapStore.finalPosition.lat},${this.mapStore.finalPosition.lng}`;

        console.log("origin: ", origin);
        console.log("destination: ", destination);

        directionsService.route(
          {
            origin: origin,
            destination: destination,
            travelMode: "TRANSIT",
          },
          (directionsResult, directionsStatus) => {
            if (directionsStatus === "OK") {
              directionsRenderer.setDirections(directionsResult);
              directionsRenderer.setMap(map);

              const route = directionsResult.routes[0];
              const leg = route.legs[0];
              this.estimatedTime = {
                time: leg.duration.text,
                distance: leg.distance.text,
              };
            }
          }
        );
      });
    },
    async fetchPlaces() {
      try {
        const response = await api.getPlaces();
        this.visitedPlaces = response;
        // console.log("visitedPlaces:: > ", this.visitedPlaces);
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    if (this.mapStore.isLogged) {
      this.userLogged = JSON.parse(localStorage.getItem("userLogged") || {});
    }
    let autocomplete = new google.maps.places.Autocomplete(
      this.$refs["autocomplete"],
      {
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(this.defaultCoords.lat, this.defaultCoords.lng)
        ),
      }
    );

    autocomplete.addListener("place_changed", async () => {
      let place = autocomplete.getPlace();
      this.address = place.formatted_address;
      this.activeLocation = place.formatted_address;

      this.showClassifier = true;
      this.lat = place.geometry.location.lat();
      this.lng = place.geometry.location.lng();

      this.stateMapStore.finalPosition.lat = this.lat;
      this.stateMapStore.finalPosition.lng = this.lng;

      await this.showUserLocationOnTheMap(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
      this.getDistance();
    });
    this.getMyLocation();
    // this.fetchPlaces();
  },
};
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
