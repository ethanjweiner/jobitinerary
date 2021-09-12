<template>
  <div>
    <ion-item>
      <ion-buttons slot="start">
        <ion-reorder slot="start"></ion-reorder>
      </ion-buttons>
      <div @click="$emit('openVisit')" style="width: 100%; height: 50%;">
        <ion-label>{{ state.visit.customerName }}</ion-label>
      </div>

      <ion-buttons slot="end">
        <ion-button @click="$emit('deleteVisit')">
          <ion-icon :icon="trashOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-item>
    <TimeLog
      :time="visit.time"
      @timeChange="(newTime) => (state.visit.time = newTime)"
    />
  </div>
</template>

<script lang="ts">
import router from "@/router";
import TimeLog from "@/components/TimeLog.vue";
import { trashOutline } from "ionicons/icons";
import {
  IonItem,
  IonButtons,
  IonReorder,
  IonLabel,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

export default {
  components: {
    IonItem,
    IonButtons,
    IonReorder,
    IonLabel,
    IonButton,
    IonIcon,
    TimeLog,
  },
  name: "Visit",
  emits: ["deleteVisit", "updateVisit", "openVisit"],
  props: {
    visit: Object,
  },
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      visit: props.visit,
    });

    watch(state.visit, (newVisit) => {
      emit("updateVisit", newVisit);
    });
    return {
      state,
      router,
      trashOutline,
    };
  },
};
</script>

<style scoped>
ion-item {
  cursor: pointer;
}
</style>
