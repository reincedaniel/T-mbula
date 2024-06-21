<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="bg-pink-7 poppins-semibold">
      <q-toolbar>
        <q-toolbar-title>
          <q-icon name="mode_of_travel" size="32px"></q-icon>
          <span class="satisfy-regular text-bold"> Tâmbula </span>
        </q-toolbar-title>

        <!--  <div>Quasar v{{ $q.version }}</div> -->
        <q-btn
          v-if="!mapStore.isLogged"
          class="q-mr-md"
          flat
          dense
          round
          icon="account_circle"
          aria-label="account_circle"
          @click="showLogin = true"
        />
        <q-btn
          v-else
          class="q-mr-md"
          flat
          dense
          round
          icon="logout"
          aria-label="logout"
          @click="toLogout = true"
        />

        <q-btn
          flat
          dense
          round
          :icon="!mapStore.isLogged ? 'eva-cast-outline' : 'ti-layout-grid2'"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-btn
          flat
          dense
          round
          :icon="
            !mapStore.isLogged
              ? 'eva-paper-plane-outline'
              : 'eva-paper-plane-outline'
          "
          aria-label="Menu"
          @click="toggleRightDrawer"
        >
          <q-tooltip> Pontos de Interesse </q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- <q-drawer v-model="leftDrawerOpen" show-if-above side="left" elevated>
      <q-list>
        <q-item-label header>
          Essential Links
        </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer> -->

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="$q.platform.is.desktop ? 300 : $q.screen.width"
    >
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list class="poppins-medium text-grey-9" padding>
          <q-item @click="rightDrawerOpen = true" to="/" clickable v-ripple>
            <q-item-section avatar>
              <q-icon size="35px" name="eva-home" />
            </q-item-section>

            <q-item-section> Home </q-item-section>
          </q-item>
          <q-item v-if="mapStore.isLogged" clickable v-ripple>
            <q-item-section avatar>
              <q-icon size="35px" name="person_pin" />
            </q-item-section>

            <q-item-section> Perfil </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon size="35px" name="where_to_vote" />
            </q-item-section>

            <q-item-section> Vistos </q-item-section>
          </q-item>

          <q-item v-if="mapStore.isLogged" clickable v-ripple>
            <q-item-section avatar>
              <q-icon size="35px" name="edit_location" />
            </q-item-section>

            <q-item-section> Classificar </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon size="35px" name="wrong_location" />
            </q-item-section>

            <q-item-section> Não Visitos </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon size="35px" name="share_location" />
            </q-item-section>

            <q-item-section> Compartilhar </q-item-section>
          </q-item>
          <q-separator v-if="mapStore.isLogged" />
          <q-item v-if="mapStore.isLogged" active clickable v-ripple>
            <q-item-section avatar>
              <q-icon size="35px" name="settings" />
            </q-item-section>

            <q-item-section> Definições </q-item-section>
          </q-item>
          <q-separator />
          <q-item
            @click="rightDrawerOpen = false"
            to="/contacts"
            class="text-grey-8 text-bold"
            clickable
            v-ripple
          >
            <q-item-section avatar>
              <q-icon size="35px" name="contacts" />
            </q-item-section>

            <q-item-section> Contatos </q-item-section>
          </q-item>
          <q-separator />
        </q-list>
      </q-scroll-area>

      <q-img
        class="absolute-top"
        src="https://eaeeie.isec.pt/imagens/isec002.jpg"
        style="height: 156px"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div class="text-weight-bold poppins-semibold">
            {{ this.userLogged ? this.userLogged.displayName : "Convidado" }}
          </div>
          <div class="poppins-light">
            {{
              this.userLogged
                ? "@" + this.userLogged.lastLoginAt
                : "@convidado242"
            }}
          </div>
        </div>
      </q-img>
    </q-drawer>

    <q-drawer
      v-if="mapStore.poi.length > 0"
      show-if-above
      :width="$q.platform.is.desktop ? 300 : $q.screen.width"
      v-model="rightDrawerOpen"
      side="right"
      bordered
    >
      <!-- drawer content -->

      <q-scroll-area v-if="true" class="fit">
        <q-toolbar class="bg-white shadow-1 sticky">
          <span class="text-caption text-grey-8 text-bold"
            ><span>Lista dos Pontos de Interesses No raio de 5 Km</span></span
          >
          <q-space></q-space>
          <q-btn
            color="grey-9"
            size="8px"
            class="q-ml-md"
            round
            icon="close"
            @click="rightDrawerOpen = false"
          />
        </q-toolbar>
        <q-list>
          <q-item-label header></q-item-label>
          <template v-for="(menuItem, index) in mapStore.poi" :key="index">
            <q-item clickable v-ripple @click="getThePOI(menuItem)">
              <q-item-section top avatar>
                <q-avatar square size="20px">
                  <img :src="menuItem.icon" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ capitalize(menuItem.name) }}</q-item-label>
                <q-item-label caption
                  >Ratings Total:
                  {{
                    humanStorageSize(menuItem?.user_ratings_total || 0)
                  }}</q-item-label
                >
                <!-- <q-item-label caption>
                  <pre>{{ menuItem.geometry }}</pre>
                </q-item-label> -->
              </q-item-section>

              <q-item-section side top>
                <q-badge
                  :color="getTheRateColor(menuItem.rating)"
                  :label="menuItem.rating"
                />
              </q-item-section>
            </q-item>

            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog v-model="toLogout" persistent>
      <q-card class="q-pa-sm poppins-regular" style="width: 450px">
        <q-card-section class="row flex flex-center">
          <q-avatar icon="logout" color="black" text-color="white" />
        </q-card-section>
        <q-card-section class="row flex flex-center">
          <span class="q-ml-sm">Deseja terminar a sessão?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            @click="logout()"
            outline
            no-caps
            dense
            label="Confirmar"
            color="blue"
            v-close-popup
          />
          <q-btn
            outline
            no-caps
            dense
            label="Cancelar"
            color="red"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showLogin" persistent>
      <q-card class="q-pa-sm poppins-regular" style="width: 450px">
        <q-card-section class="row flex flex-center">
          <q-avatar icon="account_circle" color="pink" text-color="white" />
        </q-card-section>
        <q-card-section class="row flex flex-center">
          <span class="q-ml-sm"
            >Por favor, escolha uma das formas de autenticação:</span
          >
        </q-card-section>

        <q-card-section class="row col flex flex-center q-gutter-md">
          <q-btn
            @click="singInWithGoogle()"
            round
            outline
            no-caps
            icon="eva-google-outline"
            color="green-6"
            v-close-popup
          />
          <q-btn
            v-if="false"
            round
            outline
            no-caps
            icon="eva-facebook-outline"
            color="blue"
            v-close-popup
          />
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
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import useMapStore from "src/stores/MapStore";
import { toRef } from "@vueuse/core";
import { format } from "quasar";
import { storeToRefs } from "pinia";
import hermes from "src/composables/hermes";
// destructuring to keep only what is needed

const { capitalize, humanStorageSize } = format;

export default {
  name: "MainLayout",

  data() {
    return {
      estimatedTime: "",
      capitalize,
      humanStorageSize,
      toLogout: false,
      mapStore: useMapStore(),
      stateMapStore: storeToRefs(useMapStore()),

      showLogin: false,
      leftDrawerOpen: false,
      /* isLogged: null, */
      userLogged: null,
      rightDrawerOpen: true,
    };
  },
  methods: {
    getDistance() {
      hermes.send("change-updates-2", { getDistance: "Outras Coisas" }, "all");
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

      if (false) {
        service.nearbySearch(
          {
            location: { lat: lat, lng: lat },
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
      }

      hermes.on("change-updates-2", (logs) => {
        const directionsService = new google.maps.DirectionsService();

        const directionsRenderer = new google.maps.DirectionsRenderer();

        const origin = `${this.mapStore.myPosition.lat},${this.mapStore.myPosition.lng}`;
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
              console.log("directionsResult: ", directionsResult);
              console.log("directionsStatus: ", directionsStatus);
            }
          }
        );
        console.log("# directionsService: ", directionsService);
      });
    },
    getThePOI(payload) {
      const data = JSON.parse(JSON.stringify(payload));
      const { lat = 0, lng = 0 } = data?.geometry?.location;
      console.log(data);
      this.stateMapStore.address = data && data.name;
      this.stateMapStore.finalPosition.lat = lat;
      this.stateMapStore.finalPosition.lng = lng;
      this.showUserLocationOnTheMap(lat, lng);
      this.getDistance();

      this.$q.platform.is.desktop ? "" : (this.rightDrawerOpen = false);
    },
    getTheRateColor(value) {
      if (value === 5) {
        return "green-9";
      } else if (value < 5 && value >= 4) {
        return "blue-5";
      } else if (value < 4 && value >= 3) {
        return "orange-6";
      } else if (value < 3 && value >= 2) {
        return "orange-8";
      } else if (value < 2 && value >= 1) {
        return "red-8";
      } else {
        return "grey-10";
      }
    },
    logout() {
      localStorage.removeItem("userLogged");
      // location.reload()
      this.mapStore.isLogged = false;
      this.userLogged = null;
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    toggleRightDrawer() {
      this.rightDrawerOpen = !this.rightDrawerOpen;
    },
    singInWithGoogle() {
      const provider = new GoogleAuthProvider();
      signInWithPopup(getAuth(), provider)
        .then((result) => {
          console.log(result.user);
          localStorage.setItem("userLogged", JSON.stringify(result.user));
          this.mapStore.isLogged = true;
          //  location.reload()
          this.userLogged = JSON.parse(
            localStorage.getItem("userLogged") || {}
          );

          this.$q.notify({
            position: "bottom",
            progress: true,
            html: true,
            message: `Operação realizada com sucesso!`,
            color: "green",
            multiLine: true,
            icon: "done",
          });
        })
        .catch((error) => {
          console.log("Ocorreu um erro: ", error);

          this.$q.notify({
            position: "bottom",
            progress: true,
            html: true,
            message: `Não foi possível fazer o login!`,
            color: "orange",
            multiLine: true,
            icon: "warning",
          });
        });
    },
  },

  mounted() {
    this.leftDrawerOpen = false;
    /*   this.isLogged = !!localStorage.getItem("userLogged") */
    if (this.mapStore.isLogged) {
      this.userLogged = JSON.parse(localStorage.getItem("userLogged") || {});
    }
    this.$q.platform.is.desktop ? "" : (this.rightDrawerOpen = false);
  },
};
</script>

<style lang="scss">
.satisfy-regular {
  font-family: "Satisfy", cursive;
  font-weight: 600;
  font-style: normal;
}

.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  font-size: 25px;
  z-index: 9999;
}
</style>
