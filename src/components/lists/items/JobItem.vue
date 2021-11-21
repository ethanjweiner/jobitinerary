<template>
  <ion-card button="true">
    <ion-card-header>
      <ion-card-title>{{ job.name }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-card-subtitle v-if="job.customerID">
        <ion-icon :icon="icons.cart"></ion-icon>
        {{ idToName(job.customerID) }}</ion-card-subtitle
      >
      <li v-if="job.startDate">Start: {{ job.startDate }}</li>
      <li v-if="job.endDate">End: {{ job.endDate }}</li>
    </ion-card-content>
  </ion-card>
</template>

<script lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
} from "@ionic/vue";
import { cart } from "ionicons/icons";

import { idToName } from "@/helpers";
import router from "@/router";

export default {
  name: "Job Item",
  props: {
    job: Object,
    showCustomer: Boolean,
  },
  setup() {
    return {
      router,
      idToName,
      icons: { cart },
    };
  },
  components: {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonIcon,
    IonCardContent,
  },
};
</script>

<style scoped></style>
