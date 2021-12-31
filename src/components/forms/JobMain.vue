<template>
  <ion-grid>
    <ion-row class="ion-justify-content-around">
      <ion-col size="12" size-md="6">
        <ion-card>
          <ion-card-header color="primary">
            <ion-card-title>INFO</ion-card-title>
            <ion-card-subtitle>{{ state.job.data.name }}</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item color="white" lines="inset">
                <ion-label position="stacked">Job Name</ion-label>
                <ion-input
                  type="text"
                  @ionInput="$emit('update:modelValue', state.job)"
                  :debounce="config.constants.DEBOUNCE_AMOUNT"
                  v-model="state.job.data.name"
                  placeholder="Descriptive name for this job"
                  class="job-title"
                ></ion-input>
              </ion-item>
              <ion-item color="white" lines="inset">
                <ion-label position="stacked">
                  <ion-icon :icon="icons.timeOutline"></ion-icon>
                  Estimated Start</ion-label
                >
                <ion-datetime
                  placeholder="MM/DD/YYYY"
                  @ionChange="changeStartDate($event)"
                  display-format="MM/DD/YYYY"
                  v-model="state.job.data.startDate"
                ></ion-datetime>
              </ion-item>
              <ion-item color="white" lines="inset">
                <ion-label position="stacked">
                  <ion-icon :icon="icons.timeOutline"></ion-icon>
                  Estimated End</ion-label
                >
                <ion-datetime
                  placeholder="MM/DD/YYYY"
                  @ionChange="changeEndDate($event)"
                  display-format="MM/DD/YYYY"
                  v-model="state.job.data.endDate"
                ></ion-datetime>
              </ion-item>
              <ion-item color="white" lines="inset">
                <ion-label position="stacked">
                  <ion-icon :icon="icons.documentTextOutline"></ion-icon>
                  Job Description</ion-label
                >
                <ion-textarea
                  @ionInput="$emit('update:modelValue', state.job)"
                  :debounce="config.constants.DEBOUNCE_AMOUNT"
                  auto-grow
                  type="text"
                  v-model="state.job.data.description"
                  placeholder="Longer description for this job"
                ></ion-textarea>
              </ion-item>
              <ion-item color="white" lines="inset">
                <div class="ion-padding">
                  <ion-label color="tertiary" style="font-weight: bold;">
                    Total Time on Job
                  </ion-label>
                  <ion-chip>
                    <ion-label style="margin: auto;"
                      >{{ totalHours }} hours</ion-label
                    >
                  </ion-chip>
                </div>
              </ion-item>
              <ion-item color="white" v-if="employeeHours.length">
                <div class="ion-padding">
                  <ion-label color="tertiary" style="font-weight: bold;">
                    Time Spent per Employee
                  </ion-label>
                  <ion-chip
                    v-for="(employeeHour, index) in employeeHours"
                    :key="index"
                  >
                    <ion-label
                      v-if="employeeHour.employeeID"
                      style="margin: auto;"
                      >{{ idToName(employeeHour.employeeID) }}:
                      {{ employeeHour.hours }} hours</ion-label
                    >
                  </ion-chip>
                </div>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>
      </ion-col>
      <ion-col size="12" size-md="6">
        <ion-card>
          <ion-card-header color="primary">
            <ion-card-title>TASKS</ion-card-title>
            <ion-card-subtitle>{{ state.job.data.name }}</ion-card-subtitle>
          </ion-card-header>
          <Tasks v-model="state.job.data.tasks" />
        </ion-card>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonCol,
  IonDatetime,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonTextarea,
} from "@ionic/vue";
import { computed, reactive } from "@vue/reactivity";
import {
  calendarNumberOutline,
  documentTextOutline,
  timeOutline,
} from "ionicons/icons";

import Tasks from "@/components/lists/Tasks.vue";
import config from "@/config/config";
import { idToName } from "@/helpers";
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
      return employeeIDs
        .map((employeeID) => {
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
        })
        .filter((employeeHour) => employeeHour.employeeID);
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
      config,
      idToName,
      icons: { calendarNumberOutline, documentTextOutline, timeOutline },
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
    Tasks,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonList,
    IonIcon,
  },
};
</script>

<style scoped>
ion-chip {
  cursor: default;
}
ion-card-content {
  padding: 5px;
}
</style>
