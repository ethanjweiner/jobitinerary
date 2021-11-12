<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Days</ion-title>
        <SettingsButton />
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Days</ion-title>
          <SettingsButton />
        </ion-toolbar>
      </ion-header>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";

import SettingsButton from "@/components/buttons/SettingsButton.vue";

export default {
  name: "Days",
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
