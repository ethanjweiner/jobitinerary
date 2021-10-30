<template>
  <div id="visit-modal" v-if="state.visit">
    <ion-header>
      <ion-toolbar color="tertiary">
        <ion-buttons slot="start" :collapse="true">
          <ion-button @click="toggleVisitSettings(true, $event)">
            <ion-icon :icon="icons.ellipsisVertical"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title class="ion-text-start" style="padding-inline-end: 5px;"
          >Visit<span v-if="state.visit.data.date"> on </span
          >{{ state.visit.data.date }}</ion-title
        >

        <ion-note
          class="ion-hide-md-down"
          style="padding-left: 20px;"
          color="light"
          v-if="state.visit.data.customerID"
          >for {{ idToName(state.visit.data.customerID) }}
          <span v-if="state.visit.data.employeeID">| </span>
        </ion-note>
        <ion-note
          class="ion-hide-md-down"
          color="light"
          v-if="state.visit.data.employeeID"
          >by {{ idToName(state.visit.data.employeeID) }}</ion-note
        >
        <ion-buttons :collapse="true" slot="end">
          <ion-button @click="$emit('close')">
            <span class="ion-hide-md-down">Return to Day</span>
            <ion-icon :icon="icons.close"></ion-icon>
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
      <DeletePopover unitName="Visit" @delete="$emit('deleteVisit')" />
    </ion-popover>
    <ion-content>
      <VisitComponent
        :separateByDefault="true"
        v-model="state.visit"
        :hideJob="hideJob"
      />
    </ion-content>
  </div>
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
  IonButton,
  IonPopover,
} from "@ionic/vue";
import { reactive, ref } from "@vue/reactivity";
import { close, ellipsisVertical } from "ionicons/icons";

import DeletePopover from "@/components/popovers/DeletePopover.vue";
import VisitComponent from "@/components/units/Visit.vue";
import { Visit, VisitInterface } from "@/types/units";
import store from "@/store";
import { idToName } from "@/helpers";

interface State {
  visit: Visit | null;
}

export default {
  name: "Visit Modal",
  props: {
    visitData: {
      type: Object as () => VisitInterface,
    },
    hideJob: Boolean,
  },
  emits: ["close", "deleteVisit"],
  setup(props: any) {
    const state = reactive<State>({
      visit: null,
    });

    const initialize = async () => {
      if (props.visitData) {
        const visit = new Visit(props.visitData.id, store.state.companyID);
        await visit.init(props.visitData);
        state.visit = visit;
      } else throw Error("Could not find visit");
    };

    initialize();

    // Popover
    const popoverIsOpen = ref(false);
    const popoverEvent = ref();
    const toggleVisitSettings = (state: boolean, ev?: Event) => {
      popoverEvent.value = ev;
      popoverIsOpen.value = state;
    };

    return {
      state,
      toggleVisitSettings,
      popoverIsOpen,
      popoverEvent,
      icons: {
        close,
        ellipsisVertical,
      },
      idToName,
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
    IonButton,
    VisitComponent,
    DeletePopover,
    IonPopover,
  },
};
</script>

<style scoped>
#visit-modal {
  height: calc(100% - 50px);
}
ion-header {
  display: block;
}
</style>
