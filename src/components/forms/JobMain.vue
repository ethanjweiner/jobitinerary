<template>
  <ion-item>
    <ion-label position="stacked">Job Name</ion-label>
    <ion-input
      type="text"
      v-model="state.job.name"
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
            display-format="MM/DD/YYYY"
            v-model="state.job.startDate"
          ></ion-datetime>
        </ion-item>
      </ion-col>
      <ion-col size-xs="12" size-sm="12" size-md="12" size-lg="12" size-xl="6">
        <ion-item>
          <ion-label>Estimated End</ion-label>
          <ion-datetime
            display-format="MM/DD/YYYY"
            v-model="state.job.endDate"
          ></ion-datetime>
        </ion-item>
      </ion-col>
    </ion-row>
  </ion-grid>
  <ion-item>
    <ion-label position="stacked">Job Description</ion-label>
    <ion-textarea
      auto-grow
      type="text"
      v-model="state.job.description"
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
  <ion-item>
    <ion-label>
      Time Spent per Employee
    </ion-label>
    <ion-chip v-for="(employeeHour, index) in employeeHours" :key="index">
      <ion-label style="margin: auto;"
        >{{ employeeHour.employeeName }}:
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
import { watch } from "@vue/runtime-core";

import { Visit } from "@/types";

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

    // Job metrics

    // Step 1: Extract employees from visits
    const employeeNames = [
      ...new Set(props.visits.map((visit: Visit) => visit.employeeName)),
    ];

    // Step 2: For each employee, determine the amount of hours
    const employeeHours = computed(() => {
      return employeeNames.map((employeeName) => {
        return {
          employeeName,
          hours: props.visits.reduce((hoursAcc: number, visit: Visit) => {
            if (visit.employeeName == employeeName)
              return visit.time.hours + hoursAcc;
            return hoursAcc;
          }, 0),
        };
      });
    });

    // Step 3: Determine the total number of hours
    const totalHours = computed(() =>
      props.visits.reduce(
        (hoursAcc: number, visit: Visit) => hoursAcc + visit.time.hours,
        0
      )
    );

    watch(state.job, (newJob) => emit("update:modelValue", newJob));

    return {
      state,
      totalHours,
      employeeHours,
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
