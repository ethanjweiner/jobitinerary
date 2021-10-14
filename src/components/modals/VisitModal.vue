<template>
  <div id="visit-modal" v-if="state.visit">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start" :collapse="true">
          <ion-button @click="toggleVisitSettings(true, $event)">
            <ion-icon :icon="icons.ellipsisVertical"></ion-icon>
          </ion-button>
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
          <ion-button @click="$emit('close')">
            Return to Day
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
        v-model="state.visit"
        :separateByDefault="true"
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
import { Visit, VisitInterface } from "@/types/work_units";
import store from "@/store";

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
      if (store.state.company && props.visitData) {
        const visit = new Visit(props.visitData.id, store.state.company.id);
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
</style>
