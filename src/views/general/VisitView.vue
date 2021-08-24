<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Visit</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Visit</ion-title>
        </ion-toolbar>
      </ion-header>
      <Visit />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import Visit from "@/components/Visit.vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/vue";

export default {
  name: "VisitView",
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, Visit },
};
</script>

<style></style>
