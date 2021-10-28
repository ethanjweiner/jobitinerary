<template>
  <!-- Different depending on render type -->
  <ion-page>
    <ion-header v-if="state.visit">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title
          >Visit<span v-if="state.visit.data.date"> on </span
          >{{ state.visit.data.date }}</ion-title
        >

        <div style="padding-left: 20px;">
          <ion-note v-if="state.visit.data.customerID" color="light"
            >for {{ idToName(state.visit.data.customerID) }}
            <span v-if="state.visit.data.employeeID">| </span>
          </ion-note>
          <ion-note v-if="state.visit.data.employeeID" color="light"
            >by {{ idToName(state.visit.data.employeeID) }}</ion-note
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

    <ion-content v-if="state.visit" :fullscreen="true">
      <VisitComponent v-model="state.visit" />
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
import VisitComponent from "@/components/units/Visit.vue";
import { createVisit } from "@/db";
import { Visit } from "@/types/units";
import store from "@/store";
import { idToName } from "@/helpers";

interface State {
  visit: Visit | null;
}

export default {
  name: "Visit View",
  props: {
    visitID: String,
  },
  setup(props: any) {
    const state = reactive<State>({
      visit: null,
    });

    const initialize = async () => {
      // ADD NEW VISIT
      if (props.visitID == "new") {
        // Generate a random id for now...
        const visit = await createVisit();
        state.visit = visit;
      } else {
        const visit = new Visit(props.visitID, store.state.companyID);
        await visit.init();
        state.visit = visit;
      }
    };

    initialize();

    // Popover
    const popoverIsOpen = ref(false);
    const popoverEvent = ref();
    const toggleVisitSettings = (state: boolean, ev?: Event) => {
      popoverEvent.value = ev;
      popoverIsOpen.value = state;
    };

    const deleteVisit = async () => {
      // DELETE VISIT FROM DATABASE
      if (state.visit) await state.visit.delete();

      // Return to home
      router.push({ name: "Home" });
      popoverIsOpen.value = false;
    };

    return {
      state,
      toggleVisitSettings,
      deleteVisit,
      popoverIsOpen,
      popoverEvent,
      idToName,
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
    VisitComponent,
  },
};
</script>

<style scoped>
ion-header {
  display: block;
}
</style>
