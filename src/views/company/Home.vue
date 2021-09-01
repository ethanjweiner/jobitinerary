<template>
  <ion-page>
    <!-- Note: This setup is the "collapsible large title setup" -->
    <!-- Learn more at https://ionicframework.com/docs/api/title#collapsible-large-titles -->
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
        <SettingsButton />
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Home</ion-title>
          <SettingsButton />
        </ion-toolbar>
      </ion-header>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/vue";

import SettingsButton from "@/components/buttons/SettingsButton.vue";

export default {
  name: "Home",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    SettingsButton,
  },
};
</script>
