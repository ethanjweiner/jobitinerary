<template>
  <div style="margin: 0; padding: 0;">
    <ion-item :color="visit.readByCompany ? '' : 'light'">
      <div style="width: 20px;">
        <span class="dot" v-if="!visit.readByCompany"></span>
      </div>
      <div @click="itemAction(state)" style="width: 100%;">
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
  </div>
  <ion-modal
    v-if="state.modalIsOpen"
    :is-open="state.modalIsOpen"
    @didDismiss="state.modalIsOpen = false"
  >
    <VisitModal
      :visitID="visit.id"
      :isModal="true"
      :hideJob="type == 'job' ? true : false"
      @close="state.modalIsOpen = false"
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

export default {
  name: "Visit Item",
  props: {
    // KEEP BOTH THE VISIT AND THE DB REF (just use the ref for updating database purposes...)
    visit: Object,
    dbRef: String,
    type: String,
    itemAction: Function,
  },
  emits: ["deleteVisit"],
  setup() {
    const state = reactive({
      modalIsOpen: false,
    });
    return {
      icons: { trashOutline },
      state,
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
