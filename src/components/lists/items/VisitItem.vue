<template>
  <ion-item :color="visit.readByCompany ? '' : 'light'">
    <div style="width: 20px;">
      <span class="dot" v-if="!visit.readByCompany"></span>
    </div>
    <div @click="$emit('openVisit')">
      <ion-label v-if="type == 'job'" style="margin: 0 !important;">{{
        visit.date
      }}</ion-label>
      <ion-label v-else style="margin: 0 !important"
        >For <span style="font-weight: bold;">{{ visit.customerName }}</span>
      </ion-label>
      <ion-note>by {{ visit.employeeName }}</ion-note>
    </div>

    <div slot="end">
      <ion-text v-if="type == 'job'" color="dark" style="display: block;"
        >{{ visit.time.hours }} hours</ion-text
      >
      <ion-text v-else color="dark" style="display: block;">{{
        visit.date
      }}</ion-text>
      <ion-note v-if="visit.workType">{{ visit.workType }}</ion-note>
    </div>
    <ion-buttons slot="end" v-if="type == 'job'">
      <ion-button @click="$emit('deleteVisit')">
        <ion-icon :icon="icons.trashOutline"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-item>
</template>

<script lang="ts">
import {
  IonItem,
  IonLabel,
  IonNote,
  IonText,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { trashOutline } from "ionicons/icons";

export default {
  name: "Visit Item",
  props: {
    visit: Object,
    type: String,
  },
  emits: ["deleteVisit", "updateVisit", "openVisit"],
  setup() {
    return {
      icons: { trashOutline },
    };
  },
  components: {
    IonItem,
    IonLabel,
    IonNote,
    IonText,
    IonButtons,
    IonButton,
    IonIcon,
  },
};
</script>

<style scoped>
ion-item {
  cursor: pointer;
}
div {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
