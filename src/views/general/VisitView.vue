<template>
  <!-- Different depending on render type -->
  <ion-page v-if="state.visit">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title style="padding-inline-end: 5px;"
          >Visit<span v-if="state.visit.data.date"> on </span
          >{{ state.visit.data.date }}</ion-title
        >

        <div style="padding-left: 20px;">
          <ion-note v-if="state.visit.data.customerName"
            >for {{ state.visit.data.customerName }} |
          </ion-note>
          <ion-note v-if="state.visit.data.employeeName"
            >by {{ state.visit.data.employeeName }}</ion-note
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
import { Visit } from "@/types/work_units";
import store from "@/store";

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
    VisitComponent,
  },
};
</script>

<style scoped>
ion-title {
  padding-left: 5px;
}
</style>
