<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Employees</ion-title>
        <SettingsButton />
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Employees</ion-title>
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
  name: "Employees",
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
