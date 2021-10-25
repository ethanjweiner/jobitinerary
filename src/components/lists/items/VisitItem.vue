<template>
  <ion-item
    @click="itemAction(state)"
    :color="visit.readByCompany ? '' : 'light'"
  >
    <div style="width: 20px;">
      <span class="dot" v-if="!visit.readByCompany"></span>
    </div>
    <div>
      <ion-text v-if="type == 'job'" color="dark" style="display: block;"
        >{{ visit.time.hours }} hours</ion-text
      >
      <ion-text v-else color="dark" style="display: block;">{{
        visit.date
      }}</ion-text>
      <ion-note v-if="visit.workType">{{ visit.workType }}</ion-note>
    </div>

    <div slot="end">
      <ion-label v-if="type == 'job'" style="margin: 0 !important;">{{
        visit.date
      }}</ion-label>
      <ion-label v-else-if="visit.customerID" style="margin: 0 !important"
        >For
        <span style="font-weight: bold;">{{ idToName(visit.customerID) }}</span>
      </ion-label>
      <ion-note v-if="visit.employeeID"
        >By {{ idToName(visit.employeeID) }}</ion-note
      >
    </div>
    <ion-buttons slot="end" v-if="type == 'job'">
      <ion-button @click.stop="$emit('detachVisit')">
        <ion-icon :icon="icons.trashOutline"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-item>
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
          $emit('deleteVisit');
        }
      "
    />
  </ion-modal>
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
  IonModal,
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";

import { trashOutline } from "ionicons/icons";
import VisitModal from "@/components/modals/VisitModal.vue";

import { idToName } from "@/helpers";

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
      icons: { trashOutline },
      state,
      idToName,
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
    IonModal,
    VisitModal,
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
