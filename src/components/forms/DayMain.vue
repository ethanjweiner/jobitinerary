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
              <ion-item>
                <ion-label position="stacked">Start Location</ion-label>
                <ion-input
                  type="text"
                  v-model="state.day.data.startLocation"
                  :debounce="config.constants.DEBOUNCE_AMOUNT"
                  @ionInput="$emit('update:modelValue', state.day)"
                  placeholder="Where's the meet-up spot?"
                />
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Planned Start</ion-label>
                <ion-datetime
                  @ionInput="$emit('update:modelValue', state.day)"
                  v-model="state.day.data.plannedStart"
                  display-format="h:mm A"
                  picker-format="h:mm A"
                ></ion-datetime>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Planned End</ion-label>
                <ion-datetime
                  @ionInput="$emit('update:modelValue', state.day)"
                  v-model="state.day.data.plannedEnd"
                  display-format="h:mm A"
                  picker-format="h:mm A"
                ></ion-datetime>
              </ion-item>

              <ion-item lines="none">
                <ion-label>Hourly Rate</ion-label>
                <CurrencyInput
                  @ionInput="$emit('update:modelValue', state.day)"
                  v-model="state.day.data.hourlyRate"
                  :options="{ currency: 'USD' }"
                  placeholder="$/hr"
                />
              </ion-item>
              <ion-item>
                <ion-note>{{ paymentText }}</ion-note>
              </ion-item>

              <ion-item>
                <ion-label>Mark Day as Paid</ion-label>
                <ion-buttons slot="end">
                  <ion-note style="margin: auto;" v-if="state.day.data.paid"
                    ><ion-icon :icon="checkmark"></ion-icon> Paid</ion-note
                  >
                  <ion-note style="margin: auto;" v-else>Unpaid</ion-note>
                  <ion-toggle
                    @ionInput="$emit('update:modelValue', state.day)"
                    v-model="state.day.data.paid"
                    value="paid"
                  ></ion-toggle>
                </ion-buttons>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Notes on the Day</ion-label>
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
import { computed, reactive } from "@vue/reactivity";
import { checkmark } from "ionicons/icons";

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

<style></style>
