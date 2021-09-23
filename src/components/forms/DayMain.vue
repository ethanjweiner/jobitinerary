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
    <div style="margin-bottom: 10px;">
      <ion-label>Hourly Rate</ion-label>
      <ion-note>{{ paymentText }}</ion-note>
    </div>
    <CurrencyInput
      v-model="state.day.hourlyRate"
      :options="{ currency: 'USD' }"
      placeholder="$/hr"
    />
  </ion-item>
  <ion-item>
    <ion-label>Mark Day as Paid</ion-label>
    <ion-buttons slot="end">
      <ion-note style="margin: auto;" v-if="state.day.paid"
        ><ion-icon :icon="checkmark"></ion-icon> Paid</ion-note
      >
      <ion-note style="margin: auto;" v-if="!state.day.paid">Unpaid</ion-note>
      <ion-toggle v-model="state.day.paid" value="paid"></ion-toggle>
    </ion-buttons>
  </ion-item>
  <TimeLog
    v-if="store.state.userType == 'employee'"
    v-model="state.day.time"
    :title="'Track Day Hours'"
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
import { computed, reactive } from "@vue/reactivity";
import { checkmark } from "ionicons/icons";
import TimeLog from "@/components/TimeLog.vue";
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
  IonButtons,
} from "@ionic/vue";
import { watch } from "@vue/runtime-core";
import store from "@/store";
import CurrencyInput from "../inputs/CurrencyInput.vue";

export default {
  name: "Day Main",
  props: {
    modelValue: Object,
  },
  emits: ["update:modelValue"],
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      day: props.modelValue,
    });

    watch(state.day, (newDay) => emit("update:modelValue", newDay));

    const paymentText = computed(() => {
      if (store.state.userType == "company")
        return "If no hourly rate is specified, the default rate for this employee will be assumed.";
      else if (store.state.userType == "employee")
        return "If no hourly rate is specified, your default hourly rate will be assumed.";
      else return "";
    });

    return {
      store,
      state,
      checkmark,
      paymentText,
    };
  },
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
    TimeLog,
    IonText,
    CurrencyInput,
    IonButtons,
  },
};
</script>

<style></style>
