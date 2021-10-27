<template>
  <ion-card @click="itemAction(state)" button="true">
    <!-- Add a caption? -->
    <ion-toolbar color="light">
      <ion-card-title class="ion-margin">{{ visit.date }}</ion-card-title>

      <ion-buttons slot="end">
        <!-- Detach if a job, delete otherwise -->
        <ion-button @click.stop="$emit('detachVisit', visit.id)">
          <ion-icon color="dark" :icon="icons.trashOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
    <ion-card-content>
      <ion-card-subtitle v-if="visit.time.hours">
        <ion-icon :icon="icons.time"></ion-icon>
        {{ visit.time.hours }} hours</ion-card-subtitle
      >
      <ion-card-subtitle v-if="visit.customerID">
        <ion-icon :icon="icons.cart"></ion-icon>
        {{ idToName(visit.customerID) }}</ion-card-subtitle
      >
      <ion-card-subtitle v-if="visit.employeeID">
        <ion-icon :icon="icons.hammer"></ion-icon>
        {{ idToName(visit.employeeID) }}</ion-card-subtitle
      >
      <li v-if="visit.time.start && visit.time.end">
        {{ formatTime(visit.time.start) }}-{{ formatTime(visit.time.end) }}
      </li>
      <li v-else-if="visit.plannedStart">
        Planned: {{ formatTime(visit.plannedStart)
        }}<span v-if="visit.plannedEnd"
          >-{{ formatTime(visit.plannedEnd) }}</span
        >
      </li>
      <li v-if="visit.workType">Work Type: {{ visit.workType }}</li>
      <li v-if="visit.jobID">
        <ion-icon :icon="icons.calendar"></ion-icon>
        {{ idToName(visit.jobID) }}
      </li>
    </ion-card-content>
  </ion-card>

  <ion-modal
    v-if="state.modalIsOpen"
    :is-open="state.modalIsOpen"
    @didDismiss="state.modalIsOpen = false"
  >
    <VisitModal
      :visitData="visit"
      :isModal="true"
      :hideJob="type == 'job' ? true : false"
      @close="state.modalIsOpen = false"
      @deleteVisit="
        () => {
          state.modalIsOpen = false;
          $emit('deleteVisit', visit.id);
        }
      "
    />
  </ion-modal>
</template>

<script lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonModal,
  IonToolbar,
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";

import { trashOutline, hammer, cart, time, calendar } from "ionicons/icons";
import VisitModal from "@/components/modals/VisitModal.vue";

import { idToName, formatTime } from "@/helpers";

export default {
  name: "Visit Item",
  props: {
    visit: Object,
    type: String,
    itemAction: Function,
  },
  emits: ["deleteVisit", "detachVisit"],
  setup() {
    const state = reactive({
      modalIsOpen: false,
    });
    return {
      icons: { trashOutline, hammer, cart, time, calendar },
      state,
      idToName,
      formatTime,
    };
  },
  components: {
    IonButtons,
    IonButton,
    IonIcon,
    IonModal,
    VisitModal,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonToolbar,
  },
};
</script>

<style scoped></style>
