<template>
  <div>
    <ion-item>
      <ion-buttons slot="start">
        <ion-reorder slot="start"></ion-reorder>
      </ion-buttons>
      <div @click="state.modalIsOpen = true" style="width: 100%; height: 50%;">
        <ion-label>{{ state.visit.data.customerName }}</ion-label>
      </div>

      <div v-if="store.state.userType == 'company'" slot="end">
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
        <ion-button @click="$emit('deleteVisit')">
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
  </div>
</template>

<script lang="ts">
import {
  IonItem,
  IonButtons,
  IonReorder,
  IonLabel,
  IonButton,
  IonIcon,
  IonNote,
  IonModal,
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import router from "@/router";
import store from "@/store";

import { trashOutline } from "ionicons/icons";

import { formatTime } from "@/helpers";

import TimeLog from "@/components/TimeLog.vue";
import VisitModal from "@/components/modals/VisitModal.vue";
import { watch } from "@vue/runtime-core";

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
      icons: { trashOutline },
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
