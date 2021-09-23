<template>
  <div id="visit-modal">
    <ion-header>
      <ion-toolbar>
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
          <ion-button @click="$emit('close')">
            Return to Day
            <ion-icon :icon="icons.close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <Visit
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
} from "@ionic/vue";
import { reactive, ref } from "@vue/reactivity";
import { close } from "ionicons/icons";

import Visit from "@/components/units/Visit.vue";
import { emptyVisit, sampleVisit1 } from "@/types";

export default {
  name: "Visit Modal",
  props: {
    visitID: String,
    hideJob: Boolean,
  },
  emits: ["close"],
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

    return {
      state,
      toggleVisitSettings,
      popoverIsOpen,
      popoverEvent,
      icons: {
        close,
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
    Visit,
  },
};
</script>

<style scoped>
#visit-modal {
  height: calc(100% - 50px);
}
</style>
