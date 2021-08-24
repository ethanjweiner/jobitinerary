<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Pay</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Pay</ion-title>
        </ion-toolbar>
      </ion-header>
      <PaymentInfo />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import PaymentInfo from "@/components/PaymentInfo.vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/vue";

export default {
  name: "Days",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    PaymentInfo,
  },
};
</script>
