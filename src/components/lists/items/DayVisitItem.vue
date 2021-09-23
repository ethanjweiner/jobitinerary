<template>
  <div>
    <ion-item>
      <ion-buttons slot="start">
        <ion-reorder slot="start"></ion-reorder>
      </ion-buttons>
      <div @click="$emit('openVisit')" style="width: 100%; height: 50%;">
        <ion-label>{{ state.visit.customerName }}</ion-label>
      </div>

      <div v-if="store.state.userType == 'company'" slot="end">
        <ion-note v-if="state.visit.time.hours" style="display: block;"
          >{{ state.visit.time.hours }} hours</ion-note
        >
        <ion-note
          v-if="state.visit.time.start || state.visit.time.end"
          style="display: block;"
        >
          <span v-if="state.visit.time.start">{{
            formatTime(state.visit.time.start)
          }}</span>
          <span v-if="state.visit.time.end"
            >-{{ formatTime(state.visit.time.end) }}</span
          >
        </ion-note>
      </div>

      <ion-buttons slot="end">
        <ion-button @click="$emit('deleteVisit')">
          <ion-icon :icon="icons.trashOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-item>
    <TimeLog
      v-if="store.state.userType == 'employee'"
      v-model="state.visit.time"
    />
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
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import router from "@/router";
import store from "@/store";

import { trashOutline } from "ionicons/icons";

import { formatTime } from "@/helpers";

import TimeLog from "@/components/TimeLog.vue";

export default {
  components: {
    IonItem,
    IonButtons,
    IonReorder,
    IonLabel,
    IonButton,
    IonIcon,
    TimeLog,
    IonNote,
  },
  name: "Visit",
  emits: ["update:modelValue", "deleteVisit", "openVisit"],
  props: {
    modelValue: Object,
  },
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      visit: props.modelValue,
    });

    watch(state.visit, (newVisit) => emit("update:modelValue", newVisit));

    return {
      state,
      router,
      store,
      formatTime,
      icons: { trashOutline },
    };
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
