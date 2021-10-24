<template>
  <ion-item>
    <ion-label position="stacked">Job Name</ion-label>
    <ion-input
      type="text"
      @ionInput="$emit('update:modelValue', state.job)"
      :debounce="store.DEBOUNCE_AMOUNT"
      v-model="state.job.data.name"
      placeholder="Descriptive name for this job"
      class="job-title"
    ></ion-input>
  </ion-item>
  <ion-grid>
    <ion-row>
      <ion-col size-xs="12" size-sm="12" size-md="12" size-lg="12" size-xl="6">
        <ion-item>
          <ion-label>Estimated Start</ion-label>
          <ion-datetime
            @ionChange="changeStartDate($event)"
            display-format="MM/DD/YYYY"
            v-model="state.job.data.startDate"
          ></ion-datetime>
        </ion-item>
      </ion-col>
      <ion-col size-xs="12" size-sm="12" size-md="12" size-lg="12" size-xl="6">
        <ion-item>
          <ion-label>Estimated End</ion-label>
          <ion-datetime
            @ionChange="changeEndDate($event)"
            display-format="MM/DD/YYYY"
            v-model="state.job.data.endDate"
          ></ion-datetime>
        </ion-item>
      </ion-col>
    </ion-row>
  </ion-grid>
  <ion-item>
    <ion-label position="stacked">Job Description</ion-label>
    <ion-textarea
      @ionInput="$emit('update:modelValue', state.job)"
      :debounce="store.DEBOUNCE_AMOUNT"
      auto-grow
      type="text"
      v-model="state.job.data.description"
      placeholder="Longer description for this job"
    ></ion-textarea>
  </ion-item>
  <ion-item>
    <ion-label>
      Total Time Spent on this Job
    </ion-label>
    <ion-chip>
      <ion-label style="margin: auto;">{{ totalHours }} hours</ion-label>
    </ion-chip>
  </ion-item>
  <ion-item v-if="employeeHours.length">
    <ion-label>
      Time Spent per Employee
    </ion-label>
    <ion-chip v-for="(employeeHour, index) in employeeHours" :key="index">
      <ion-label style="margin: auto;"
        >{{ employeeHour.employeeID }}:
        {{ employeeHour.hours }} hours</ion-label
      >
    </ion-chip>
  </ion-item>
</template>

<script lang="ts">
import { computed, reactive } from "@vue/reactivity";
import {
  IonItem,
  IonLabel,
  IonInput,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonDatetime,
  IonTextarea,
} from "@ionic/vue";
import store from "@/store";

import { Visit } from "@/types/units";

export default {
  name: "Job Main",
  props: {
    modelValue: Object,
    visits: Array,
  },
  emits: ["update:modelValue"],
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      job: props.modelValue,
    });

    // JOB METRICS

    // Step 1: Extract employees from visits
    const employeeIDs = [
      ...new Set(props.visits.map((visit: Visit) => visit.data.employeeID)),
    ];

    // Step 2: For each employee, determine the amount of hours
    const employeeHours = computed(() => {
      return employeeIDs.map((employeeID) => {
        return {
          employeeID,
          hours: props.visits.reduce((hoursAcc: number, visit: Visit) => {
            if (visit.data.employeeID == employeeID)
              return visit.data.time
                ? visit.data.time.hours + hoursAcc
                : hoursAcc;
            return hoursAcc;
          }, 0),
        };
      });
    });

    // Step 3: Determine the total number of hours
    const totalHours = computed(() =>
      props.visits.reduce(
        (hoursAcc: number, visit: Visit) =>
          visit.data.time ? visit.data.time.hours + hoursAcc : hoursAcc,
        0
      )
    );

    const changeStartDate = (ev: CustomEvent) => {
      state.job.data.startDate = ev.detail.value.substring(0, 10);
      emit("update:modelValue", state.job);
    };

    const changeEndDate = (ev: CustomEvent) => {
      state.job.data.endDate = ev.detail.value.substring(0, 10);
      emit("update:modelValue", state.job);
    };

    return {
      state,
      store,
      totalHours,
      employeeHours,
      changeStartDate,
      changeEndDate,
    };
  },
  components: {
    IonItem,
    IonLabel,
    IonInput,
    IonChip,
    IonGrid,
    IonRow,
    IonCol,
    IonDatetime,
    IonTextarea,
  },
};
</script>

<style scoped>
ion-chip {
  cursor: default;
}
</style>
