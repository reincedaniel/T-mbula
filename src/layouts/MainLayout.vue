<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="bg-pink-7 poppins-semibold">
      <q-toolbar>

        <q-toolbar-title>
          <q-icon name="mode_of_travel" size="32px"></q-icon> <span class="satisfy-regular text-bold "> Tâmbula
          </span> </q-toolbar-title>

        <!--  <div>Quasar v{{ $q.version }}</div> -->
        <q-btn flat dense round icon="ti-layout-grid2" aria-label="Menu" @click="toggleLeftDrawer" />

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
          <q-item clickable v-ripple>
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

          <q-item active clickable v-ripple>
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
          <q-separator />
          <q-item clickable v-ripple>
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
          <div class="text-weight-bold poppins-semibold">Lourenço Carlos</div>
          <div class="poppins-light">@reincedaniel</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'


export default defineComponent({
  name: 'MainLayout',


  setup() {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>

<style lang="scss" >
.satisfy-regular {
  font-family: "Satisfy", cursive;
  font-weight: 600;
  font-style: normal;
}
</style>