<template>
  <ion-card class="ion-margin">
    <ion-item lines="inset" color="light" @click="state.modalIsOpen = true">
      <ion-buttons slot="start" @click.stop>
        <ion-reorder slot="start"></ion-reorder>
      </ion-buttons>
      <div style="width: 100%;">
        <ion-label
          v-if="
            state.visit.data.customerID || state.visit.data.unregisteredCustomer
          "
        >
          <ion-icon :icon="icons.cart"></ion-icon>
          {{
            state.visit.data.customerID
              ? idToName(state.visit.data.customerID)
              : state.visit.data.unregisteredCustomer
          }}</ion-label
        >
        <ion-label v-else>Visit</ion-label>
        <ion-note v-if="state.visit.data.plannedStart">
          Planned Start: {{ formatTime(state.visit.data.plannedStart) }}
        </ion-note>
      </div>

      <div
        class="ion-hide-sm-down"
        v-if="store.state.userType == 'company'"
        slot="end"
      >
        <ion-note v-if="state.visit.data.time.hours" style="display: block;"
          >{{ state.visit.data.time.hours }} hours</ion-note
        >
        <ion-note
          v-if="state.visit.data.time.start || state.visit.data.time.end"
          style="display: block;"
        >
          <span v-if="state.visit.data.time.start">{{
            formatTime(state.visit.data.time.start)
          }}</span>
          <span v-if="state.visit.data.time.end"
            >-{{ formatTime(state.visit.data.time.end) }}</span
          >
        </ion-note>
      </div>

      <ion-buttons slot="end">
        <ion-button @click.stop="$emit('deleteVisit')">
          <ion-icon :icon="icons.trashOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-item>
    <!-- Inline visit time log tracking -->
    <TimeLog
      v-model="state.visit.data.time"
      @update:modelValue="$emit('update:modelValue', state.visit)"
    />
    <ion-modal
      v-if="state.modalIsOpen"
      :is-open="state.modalIsOpen"
      @didDismiss="state.modalIsOpen = false"
    >
      <VisitModal
        :visitData="state.visit.data"
        :isModal="true"
        @close="state.modalIsOpen = false"
        @deleteVisit="
          () => {
            state.modalIsOpen = false;
            $emit('deleteVisit');
          }
        "
      />
    </ion-modal>
  </ion-card>
</template>

<script lang="ts">
import {
  IonButton,
  IonButtons,
  IonCard,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonNote,
  IonReorder,
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { cart, trashOutline } from "ionicons/icons";

import VisitModal from "@/components/modals/VisitModal.vue";
import TimeLog from "@/components/TimeLog.vue";
import { formatTime, idToName } from "@/helpers";
import router from "@/router";
import store from "@/store";

export default {
  name: "Visit",
  emits: ["update:modelValue", "deleteVisit"],
  props: {
    modelValue: Object,
  },
  setup(props: any) {
    const state = reactive({
      visit: props.modelValue,
      modalIsOpen: false,
    });

    watch(state.visit.data, () => state.visit.save());

    return {
      state,
      router,
      store,
      formatTime,
      idToName,
      icons: { trashOutline, cart },
    };
  },
  components: {
    IonItem,
    IonButtons,
    IonReorder,
    IonLabel,
    IonButton,
    IonIcon,
    TimeLog,
    IonNote,
    IonModal,
    VisitModal,
    IonCard,
  },
};
</script>

<style scoped>
ion-item {
  cursor: pointer;
}
ion-buttons {
  margin: 8px;
}
</style>
