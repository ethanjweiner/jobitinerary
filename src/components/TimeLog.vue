<template>
  <ion-grid class="ion-padding">
    <ion-row>
      <ion-col size="6">
        <ion-button color="success" expand="block" @click="setStartTime">
          <ion-icon color="light" :icon="icons.playOutline"></ion-icon>
        </ion-button>
      </ion-col>
      <ion-col size="6">
        <ion-button color="danger" expand="block" @click="setEndTime">
          <ion-icon color="light" :icon="icons.stopOutline"></ion-icon>
        </ion-button>
      </ion-col>
    </ion-row>
    <ion-row v-if="mismatch">
      <ion-note style="padding-left: 10px; padding-bottom: 3px;">
        <ion-text color="danger">
          Note: The times and hours don't match up.
        </ion-text>
      </ion-note>
    </ion-row>
    <ion-row color="light">
      <ion-col size="6" size-xl="4">
        <ion-item>
          <ion-label position="stacked">Start Time</ion-label>
          <ion-datetime
            v-model="state.time.start"
            display-format="h:mm A"
            picker-format="h:mm A"
          ></ion-datetime>
        </ion-item>
      </ion-col>
      <ion-col size="6" size-xl="4">
        <ion-item>
          <ion-label position="stacked">End Time</ion-label>
          <ion-datetime
            v-model="state.time.end"
            display-format="h:mm A"
            picker-format="h:mm A"
          ></ion-datetime>
        </ion-item>
      </ion-col>
      <ion-col size="12" size-xl="4">
        <ion-item>
          <ion-label position="stacked">Total Hours</ion-label>
          <ion-input
            type="number"
            inputmode="numeric"
            v-model="state.time.hours"
          ></ion-input>
          <ion-button
            fill="outline"
            color="secondary"
            size="small"
            @click="refreshHours"
            >Calculate</ion-button
          >
        </ion-item>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts">
import { playOutline, stopOutline } from "ionicons/icons";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonLabel,
  IonInput,
  IonItem,
  IonText,
  IonNote,
  IonDatetime,
} from "@ionic/vue";
import { computed, reactive } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
export default {
  name: "Timelog",
  props: {
    modelValue: Object,
    title: String,
  },
  emits: ["update:modelValue"],
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      time: props.modelValue,
    });

    const retrieveHours = (): number => {
      const hours =
        (new Date(state.time.end).getTime() -
          new Date(state.time.start).getTime()) /
        (1000 * 60 * 60);

      if (hours) return Math.round(hours * 10) / 10;
      return 0;
    };

    const refreshHours = () => {
      state.time.hours = retrieveHours();
    };

    const setStartTime = () => {
      state.time.start = new Date().toISOString();
      if (state.time.start && state.time.end) refreshHours();
    };

    const setEndTime = () => {
      state.time.end = new Date().toISOString();
      if (state.time.start && state.time.end) refreshHours();
    };

    watch(state.time, (newTime) => emit("update:modelValue", newTime));

    // Create a ticking clock animation if only start time exists
    const isTicking = computed(() => {
      const afterStart = new Date() > new Date(state.time.start);
      return state.time.start && !state.time.end && afterStart;
    });

    // Do the start and end times match the hours?
    const mismatch = computed(() => state.time.hours != retrieveHours());

    return {
      state,
      icons: {
        playOutline,
        stopOutline,
      },
      mismatch,
      isTicking,
      setStartTime,
      setEndTime,
      refreshHours,
    };
  },
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonLabel,
    IonInput,
    IonItem,
    IonText,
    IonNote,
    IonDatetime,
  },
};
</script>

<style scoped>
ion-label {
  margin-left: 0;
}
ion-grid {
  --ion-padding: 7px;

  --ion-grid-padding-xs: 7px;
  --ion-grid-padding-sm: 7px;
  --ion-grid-padding-md: 7px;
  --ion-grid-padding-lg: 7px;
  --ion-grid-padding-xl: 7px;
  --ion-grid-column-padding-xs: 7px;
  --ion-grid-column-padding-sm: 7px;
  --ion-grid-column-padding-md: 7px;
  --ion-grid-column-padding-lg: 7px;
  --ion-grid-column-padding-xl: 7px;
}
ion-item {
  border-radius: 10px;
  height: 100%;
  background: white;
}
input {
  padding: 0 !important;
}
.item-native {
  padding: 0 !important;
}
</style>
