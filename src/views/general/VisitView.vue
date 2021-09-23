<template>
  <!-- Different depending on render type -->
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title style="padding-inline-end: 5px;"
          >Visit<span v-if="state.visit.date"> on </span
          >{{ state.visit.date }}</ion-title
        >

        <div style="padding-left: 20px;">
          <ion-note v-if="state.visit.customerName"
            >for {{ state.visit.customerName }} |
          </ion-note>
          <ion-note v-if="state.visit.employeeName"
            >by {{ state.visit.employeeName }}</ion-note
          >
        </div>
        <ion-buttons :collapse="true" slot="end">
          <ion-button @click="toggleVisitSettings(true, $event)">
            <ion-icon :icon="icons.ellipsisVertical"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-popover
      :is-open="popoverIsOpen"
      :translucent="true"
      :event="popoverEvent"
      @didDismiss="toggleVisitSettings(false)"
    >
      <DeletePopover unitName="Visit" @delete="deleteVisit" />
    </ion-popover>

    <ion-content :fullscreen="true">
      <Visit v-model="state.visit" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonNote,
  IonIcon,
  IonButtons,
  IonPopover,
  IonButton,
  IonBackButton,
  IonPage,
} from "@ionic/vue";

import { reactive, ref } from "@vue/reactivity";
import { ellipsisVertical } from "ionicons/icons";

import DeletePopover from "@/components/popovers/DeletePopover.vue";
import router from "@/router";
import Visit from "@/components/units/Visit.vue";
import { emptyVisit, sampleVisit1 } from "@/types";

export default {
  name: "Visit View",
  props: {
    visitID: String,
  },
  setup() {
    const state = reactive({
      visit: emptyVisit({}),
    });

    // RETRIEVE VISIT WITH VISIT ID
    state.visit = sampleVisit1;

    // Popover
    const popoverIsOpen = ref(false);
    const popoverEvent = ref();
    const toggleVisitSettings = (state: boolean, ev?: Event) => {
      popoverEvent.value = ev;
      popoverIsOpen.value = state;
    };

    const deleteVisit = () => {
      // DELETE VISIT FROM DATABASE

      // Return to home
      router.go(-1);
    };

    return {
      state,
      toggleVisitSettings,
      deleteVisit,
      popoverIsOpen,
      popoverEvent,
      icons: {
        ellipsisVertical,
      },
    };
  },
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonNote,
    IonIcon,
    IonButtons,
    IonPopover,
    IonButton,
    DeletePopover,
    IonBackButton,
    IonPage,
    Visit,
  },
};
</script>

<style scoped>
ion-title {
  padding-left: 5px;
}
</style>
