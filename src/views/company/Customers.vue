<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Customers</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Customers</ion-title>
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

export default {
  name: "Customers",
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
};
</script>
