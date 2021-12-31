<template>
  <ion-grid>
    <ion-row class="ion-justify-content-center">
      <ion-col size="12" size-lg="6">
        <ion-card>
          <ion-card-header>
            <ion-card-title>MAIN</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item lines="inset">
                <ion-label position="stacked">
                  <ion-icon :icon="icons.locationOutline"></ion-icon>
                  Start Location</ion-label
                >
                <ion-input
                  type="text"
                  v-model="state.day.data.startLocation"
                  :debounce="config.constants.DEBOUNCE_AMOUNT"
                  @ionInput="$emit('update:modelValue', state.day)"
                  placeholder="Where's the meet-up spot?"
                />
              </ion-item>
              <ion-item lines="inset">
                <ion-label position="stacked">
                  <ion-icon :icon="icons.timerOutline"></ion-icon>
                  Planned Start</ion-label
                >
                <ion-datetime
                  @ionInput="$emit('update:modelValue', state.day)"
                  v-model="state.day.data.plannedStart"
                  display-format="h:mm A"
                  picker-format="h:mm A"
                ></ion-datetime>
              </ion-item>
              <ion-item lines="inset">
                <ion-label position="stacked">
                  <ion-icon :icon="icons.timerOutline"></ion-icon>
                  Planned End</ion-label
                >
                <ion-datetime
                  @ionInput="$emit('update:modelValue', state.day)"
                  v-model="state.day.data.plannedEnd"
                  display-format="h:mm A"
                  picker-format="h:mm A"
                ></ion-datetime>
              </ion-item>

              <ion-item lines="none">
                <ion-label position="start">
                  <ion-icon :icon="icons.timeOutline"></ion-icon>
                  Hourly Rate</ion-label
                >
                <CurrencyInput
                  @ionInput="$emit('update:modelValue', state.day)"
                  v-model="state.day.data.hourlyRate"
                  :options="{ currency: 'USD' }"
                  placeholder="$/hr"
                />
              </ion-item>
              <ion-item>
                <ion-note style="font-size: 12px;">
                  If no hourly rate is specified, the default hourly rate will
                  be assumed.
                </ion-note>
              </ion-item>

              <ion-item>
                <ion-label>
                  <ion-icon :icon="icons.cashOutline"></ion-icon>
                  Mark Day as Paid</ion-label
                >
                <ion-buttons slot="end">
                  <ion-note style="margin: auto;" v-if="state.day.data.paid"
                    ><ion-icon :icon="icons.checkmark"></ion-icon>
                    Paid</ion-note
                  >
                  <ion-note style="margin: auto;" v-else>Unpaid</ion-note>
                  <ion-toggle
                    @ionInput="$emit('update:modelValue', state.day)"
                    v-model="state.day.data.paid"
                    value="paid"
                  ></ion-toggle>
                </ion-buttons>
              </ion-item>
              <ion-item lines="inset">
                <ion-label position="stacked">
                  <ion-icon :icon="icons.documentTextOutline"></ion-icon>
                  Notes on the Day</ion-label
                >
                <ion-textarea
                  auto-grow
                  :debounce="config.constants.DEBOUNCE_AMOUNT"
                  @ionInput="$emit('update:modelValue', state.day)"
                  v-model="state.day.data.notes"
                ></ion-textarea>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>
      </ion-col>
      <ion-col size="12" size-lg="6">
        <ion-card>
          <ion-card-header>
            <ion-card-title>TIME LOG</ion-card-title>
            <ion-card-subtitle>Total hours for the day</ion-card-subtitle>
          </ion-card-header>
          <TimeLog
            @update:modelValue="$emit('update:modelValue', state.day)"
            v-model="state.day.data.time"
            :title="'Track Day Hours'"
          />
        </ion-card>
      </ion-col>
    </ion-row>
  </ion-grid>

  <!-- Additional Notes -->
</template>

<script lang="ts">
import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonDatetime,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonRow,
  IonTextarea,
  IonToggle,
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import {
  cashOutline,
  checkmark,
  documentTextOutline,
  locationOutline,
  timeOutline,
  timerOutline,
} from "ionicons/icons";

import TimeLog from "@/components/TimeLog.vue";
import config from "@/config/config";
import store from "@/store";

import CurrencyInput from "../inputs/CurrencyInput.vue";

export default {
  name: "Day Main",
  props: {
    modelValue: Object,
  },
  emits: ["update:modelValue"],
  setup(props: any) {
    const state = reactive({
      day: props.modelValue,
    });

    return {
      store,
      state,
      icons: {
        cashOutline,
        checkmark,
        documentTextOutline,
        locationOutline,
        timeOutline,
        timerOutline,
      },
      config,
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
    CurrencyInput,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonList,
    IonCardSubtitle,
  },
};
</script>

<style scoped>
ion-card-content {
  padding: 5px;
}
</style>
