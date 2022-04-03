<template>
  <ion-grid class="ion-padding">
    <ion-row v-if="isTicking">
      <Timer :key="state.time.start" :start-time="state.time.start" />
    </ion-row>
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
      <ion-button
        style="padding-left: 15px;"
        fill="outline"
        color="danger"
        size="small"
        @click="refreshHours"
        >Auto-Calculate Hours</ion-button
      >
    </ion-row>
    <ion-row color="light">
      <ion-col size="6">
        <time-picker
          title="Start Time"
          v-model="state.time.start"
        ></time-picker>
      </ion-col>
      <ion-col size="6">
        <time-picker title="End Time" v-model="state.time.end"></time-picker>
      </ion-col>

      <ion-col size="12">
        <ion-item>
          <ion-label position="stacked">
            <ion-icon :icon="icons.timeOutline"></ion-icon>
            Total Hours</ion-label
          >
          <ion-input
            type="number"
            inputmode="numeric"
            :value="state.time.hours"
            :placeholder="hoursPlaceholder"
            @ionInput="updateHours($event.target.value)"
          ></ion-input>
        </ion-item>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts">
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonRow,
  IonText,
} from "@ionic/vue";
import { computed, reactive, ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import {
  playOutline,
  stopOutline,
  timeOutline,
  timerOutline,
} from "ionicons/icons";

import { formatTime } from "@/helpers";

import TimePicker from "./inputs/TimePicker.vue";
import Timer from "./Timer.vue";

export default {
  name: "Timelog",
  props: {
    modelValue: Object,
    title: String,
    hoursPlaceholder: String,
  },
  emits: ["update:modelValue"],
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      time: props.modelValue,
    });

    const startToEndHours = (): number => {
      const startDate = new Date(state.time.start);
      const startHours = startDate.getHours() + startDate.getMinutes() / 60;

      const endDate = new Date(state.time.end);
      const endHours = endDate.getHours() + endDate.getMinutes() / 60;

      const hours = endHours - startHours < 0 ? 0 : endHours - startHours;

      if (hours) return Math.round(hours * 10) / 10;
      return 0;
    };

    const refreshHours = () => {
      state.time.hours = startToEndHours();
    };

    const setStartTime = () => {
      state.time.start = new Date().toISOString();
      console.log(state.time.start);
      if (state.time.start && state.time.end) refreshHours();
    };

    const setEndTime = () => {
      state.time.end = new Date().toISOString();
      if (state.time.start && state.time.end) refreshHours();
    };

    const updateHours = (hoursInput: string) => {
      if (hoursInput) state.time.hours = parseFloat(hoursInput);
    };

    watch(state.time, (newTime) => emit("update:modelValue", newTime));

    // Create a ticking clock animation if only start time exists
    const isTicking = computed(() => {
      const afterStart = new Date() > new Date(state.time.start);
      return state.time.start && !state.time.end && afterStart;
    });

    // Do the start and end times match the hours?
    const mismatch = computed(
      () =>
        state.time.start &&
        state.time.end &&
        state.time.hours != startToEndHours()
    );

    const startDate = ref();

    const confirmStart = () => {
      if (startDate.value == undefined) return;
      startDate.value.$el.confirm(true);
    };

    const endDate = ref();

    const confirmEnd = () => {
      if (endDate.value == undefined) return;
      endDate.value.$el.confirm(true);
    };

    return {
      state,
      icons: {
        playOutline,
        stopOutline,
        timerOutline,
        timeOutline,
      },
      startDate,
      endDate,
      confirmStart,
      confirmEnd,
      mismatch,
      isTicking,
      setStartTime,
      setEndTime,
      refreshHours,
      updateHours,
      formatTime,
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
    Timer,
    TimePicker,
  },
};
</script>

<style scoped>
ion-label {
  margin-left: 0;
}
ion-grid {
  box-shadow: 0px 0px 3px grey inset;
  border-radius: 15px;
  margin: 10px;
  background: var(--ion-color-light);
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
  border: 1px solid rgb(219, 219, 219);

  height: 100%;
  background: white;
}
ion-item {
}
input {
  padding: 0 !important;
}
.item-native {
  padding: 0 !important;
}
</style>
