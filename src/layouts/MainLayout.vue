<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="bg-pink-7 poppins-semibold">
      <q-toolbar>

        <q-toolbar-title>
          <q-icon name="mode_of_travel" size="32px"></q-icon> <span class="satisfy-regular text-bold "> Tâmbula
          </span> </q-toolbar-title>

        <!--  <div>Quasar v{{ $q.version }}</div> -->
        <q-btn v-if="!mapStore.isLogged" class="q-mr-md" flat dense round icon="account_circle"
          aria-label="account_circle" @click="showLogin = true" />
        <q-btn v-else class="q-mr-md" flat dense round icon="logout" aria-label="logout" @click="toLogout = true" />

        <q-btn flat dense round :icon="!mapStore.isLogged ? 'eva-cast-outline' : 'ti-layout-grid2'" aria-label="Menu"
          @click="toggleLeftDrawer" />

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

    <q-drawer v-model="leftDrawerOpen" show-if-above :width="$q.platform.is.desktop ? 300 : $q.screen.width">
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">

        <q-list class="poppins-medium text-grey-9" padding>
          <q-item v-if="mapStore.isLogged" clickable v-ripple>
            <q-item-section avatar>
              <q-icon size="35px" name="person_pin" />
            </q-item-section>

            <q-item-section>
              Perfil
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon size="35px" name="where_to_vote" />
            </q-item-section>

            <q-item-section>
              Vistos
            </q-item-section>
          </q-item>

          <q-item v-if="mapStore.isLogged" clickable v-ripple>
            <q-item-section avatar>
              <q-icon size="35px" name="edit_location" />
            </q-item-section>

            <q-item-section>
              Classificar
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon size="35px" name="wrong_location" />
            </q-item-section>

            <q-item-section>
              Não Visitos
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon size="35px" name="share_location" />
            </q-item-section>

            <q-item-section>
              Compartilhar
            </q-item-section>
          </q-item>
          <q-separator v-if="mapStore.isLogged" />
          <q-item v-if="mapStore.isLogged" active clickable v-ripple>
            <q-item-section avatar>
              <q-icon size="35px" name="settings" />
            </q-item-section>

            <q-item-section>
              Definições
            </q-item-section>
          </q-item>
          <q-separator />
        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="https://eaeeie.isec.pt/imagens/isec002.jpg" style="height: 156px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <div class="text-weight-bold poppins-semibold"> {{ this.userLogged ? this.userLogged.displayName : 'Convidado'
          }}
          </div>
          <div class="poppins-light">{{ this.userLogged ? "@" + this.userLogged.lastLoginAt : '@convidado242' }} </div>
        </div>
      </q-img>
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
          <q-btn @click="logout()" outline no-caps dense label="Confirmar" color="blue" v-close-popup />
          <q-btn outline no-caps dense label="Cancelar" color="red" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showLogin" persistent>
      <q-card class="q-pa-sm poppins-regular" style="width: 450px">
        <q-card-section class="row flex flex-center">
          <q-avatar icon="account_circle" color="pink" text-color="white" />
        </q-card-section>
        <q-card-section class="row flex flex-center">
          <span class="q-ml-sm">Por favor, escolha uma das formas de autenticação:</span>
        </q-card-section>



        <q-card-section class="row  col flex flex-center q-gutter-md">
          <q-btn @click="singInWithGoogle()" round outline no-caps icon="eva-google-outline" color="green-6"
            v-close-popup />
          <q-btn round outline no-caps icon="eva-facebook-outline" color="blue" v-close-popup />

        </q-card-section>
        <q-card-actions align="right">
          <q-btn outline no-caps dense label="Cancelar" color="red" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import useMapStore from 'src/stores/MapStore'

export default {
  name: 'MainLayout',

  data() {
    return {
      toLogout: false,
      mapStore: useMapStore(),
      showLogin: false,
      leftDrawerOpen: false,
      /* isLogged: null, */
      userLogged: null
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("userLogged")
      // location.reload()
      this.mapStore.isLogged = false
      this.userLogged = null
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    singInWithGoogle() {
      const provider = new GoogleAuthProvider()
      signInWithPopup(getAuth(), provider)
        .then((result) => {
          console.log(result.user)
          localStorage.setItem("userLogged", JSON.stringify(result.user))
          this.mapStore.isLogged = true
          //  location.reload()
          this.userLogged = JSON.parse(localStorage.getItem("userLogged") || {})

          this.$q.notify({
            position: 'bottom',
            progress: true,
            html: true,
            message: `Operação realizada com sucesso!`,
            color: 'green',
            multiLine: true,
            icon: 'done'
          });
        })
        .catch((error) => {
          console.log("Ocorreu um erro: ", error)

          this.$q.notify({
            position: 'bottom',
            progress: true,
            html: true,
            message: `Não foi possível fazer o login!`,
            color: 'orange',
            multiLine: true,
            icon: 'warning'
          });

        })
    }
  },

  mounted() {
    /*   this.isLogged = !!localStorage.getItem("userLogged") */
    if (this.mapStore.isLogged) {
      this.userLogged = JSON.parse(localStorage.getItem("userLogged") || {})
    }
  }
}
</script>

<style lang="scss" >
.satisfy-regular {
  font-family: "Satisfy", cursive;
  font-weight: 600;
  font-style: normal;
}
</style>