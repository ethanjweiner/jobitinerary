<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Pay</ion-title>
        <SettingsButton />
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Pay</ion-title>
          <SettingsButton />
        </ion-toolbar>
      </ion-header>
      <PaymentInfo />
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
import PaymentInfo from "@/components/PaymentInfo.vue";

export default {
  name: "Days",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    PaymentInfo,
    SettingsButton,
  },
};
</script>
