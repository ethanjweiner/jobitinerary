<template>
  <ion-item>
    <ion-label position="stacked">Start Location</ion-label>
    <ion-input
      type="text"
      v-model="state.day.startLocation"
      placeholder="Meeting location at the start of the day"
    />
  </ion-item>
  <ion-grid>
    <ion-row>
      <ion-col size="6">
        <ion-item>
          <ion-label position="stacked">Planned Start</ion-label>
          <ion-datetime
            v-model="state.day.plannedStart"
            display-format="h:mm A"
            picker-format="h:mm A"
          ></ion-datetime>
        </ion-item>
      </ion-col>
      <ion-col size="6">
        <ion-item>
          <ion-label position="stacked">Planned End</ion-label>
          <ion-datetime
            v-model="state.day.plannedEnd"
            display-format="h:mm A"
            picker-format="h:mm A"
          ></ion-datetime>
        </ion-item>
      </ion-col>
    </ion-row>
  </ion-grid>
  <ion-item>
    <ion-label>Mark Day as Paid</ion-label>
    <ion-note style="margin: auto;" v-if="state.day.paid"
      ><ion-icon :icon="checkmark"></ion-icon> Paid</ion-note
    >
    <ion-note style="margin: auto;" v-if="!state.day.paid">Unpaid</ion-note>
    <ion-toggle v-model="state.day.paid" value="paid"></ion-toggle>
  </ion-item>
  <TimeLogComponent
    v-if="store.state.userType == 'employee'"
    :time="state.day.time"
    :title="'Visit Time Log'"
    @timeChange="(time) => (state.day.time = time)"
  />
  <!-- Additional Notes -->
  <h3 class="ion-text-center">
    <ion-text>Notes on the Day</ion-text>
  </h3>
  <ion-item>
    <ion-textarea auto-grow v-model="state.day.notes"></ion-textarea>
  </ion-item>
</template>

<script lang="ts">
import { reactive } from "@vue/reactivity";
import { checkmark } from "ionicons/icons";
import TimeLogComponent from "@/components/TimeLog.vue";
import {
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonDatetime,
  IonLabel,
  IonNote,
  IonToggle,
  IonTextarea,
  IonInput,
  IonIcon,
  IonText,
} from "@ionic/vue";
import { watch } from "@vue/runtime-core";
import store from "@/store";

export default {
  name: "Day Main",
  props: {
    day: Object,
  },
  emits: ["dayChanged"],
  components: {
    IonItem,
    IonGrid,
    IonRow,
    IonCol,
    IonDatetime,
    IonLabel,
    IonNote,
    IonToggle,
    IonTextarea,
    IonInput,
    IonIcon,
    TimeLogComponent,
    IonText,
  },
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      day: props.day,
    });

    watch(state.day, (newDay) => {
      emit("dayChanged", newDay);
    });

    return {
      store,
      state,
      checkmark,
    };
  },
};
</script>

<style></style>
