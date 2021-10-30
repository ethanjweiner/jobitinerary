<template>
  <ion-grid>
    <ion-row class="ion-justify-content-center">
      <ion-col size="12" size-md="8">
        <ion-card>
          <ion-card-header>
            <ion-card-title>MAIN</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-chip>
              <ion-label>
                <span style="font-weight: bold;">{{ totalHours }}</span>
                hours worked on this date
              </ion-label>
            </ion-chip>
            <ion-chip v-if="workTypes.length">
              <ion-label>
                Types of Work:
                <span
                  v-for="(type, index) in workTypes"
                  :key="index"
                  style="font-weight: bold;"
                >
                  {{ type }}<span v-if="index != workTypes.length - 1">, </span>
                </span>
              </ion-label>
            </ion-chip>
            <ion-chip v-if="employees.length">
              <ion-label>
                Employees Working:
                <span
                  v-for="(id, index) in employees"
                  :key="index"
                  style="font-weight: bold;"
                >
                  {{ idToName(id)
                  }}<span v-if="index != employees.length - 1">, </span>
                </span>
              </ion-label>
            </ion-chip>
            <ion-item>
              <ion-label position="stacked">Notes</ion-label>
              <ion-textarea
                :debounce="store.DEBOUNCE_AMOUNT"
                placeholder="Notes on this day"
                v-model="state.day.data.notes"
                @ionInput="$emit('update:modelValue', state.day)"
              >
              </ion-textarea>
            </ion-item>
          </ion-card-content>
        </ion-card>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts">
import {
  IonCard,
  IonCardContent,
  IonItem,
  IonTextarea,
  IonChip,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/vue";

import { computed, reactive } from "@vue/reactivity";
import store from "@/store";
import { idToName } from "@/helpers";
import { Visit } from "@/types/units";

export default {
  name: "Customer Day Main",
  props: {
    modelValue: Object,
    visits: Array,
  },
  emits: ["update:modelValue"],
  setup(props: any) {
    const state = reactive({
      day: props.modelValue,
    });

    const totalHours = computed(() =>
      props.visits.reduce(
        (hoursAcc: number, visit: Visit) => hoursAcc + visit.data.time.hours,
        0
      )
    );

    const workTypes = computed(() => {
      const types: Array<string> = [];
      props.visits.forEach((visit: Visit) => {
        if (visit.data.workType && !types.includes(visit.data.workType))
          types.push(visit.data.workType);
      });
      return types;
    });

    const employees = computed(() => {
      const names: Array<string> = [];
      props.visits.forEach((visit: Visit) => {
        if (visit.data.employeeID && !names.includes(visit.data.employeeID))
          names.push(visit.data.employeeID);
      });
      return names;
    });

    return {
      store,
      state,
      totalHours,
      workTypes,
      employees,
      idToName,
    };
  },
  components: {
    IonCard,
    IonCardContent,
    IonItem,
    IonTextarea,
    IonChip,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonCardHeader,
    IonCardTitle,
  },
};
</script>

<style></style>
