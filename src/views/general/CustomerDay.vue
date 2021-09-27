<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title> {{ username }} on {{ date }} </ion-title>
        <ion-buttons :collapse="true" slot="end">
          <ion-button @click="toggleDaySettings(true, $event)">
            <ion-icon :icon="icons.ellipsisVertical"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid class="ion-padding">
        <ion-row class="ion-justify-content-primary customer-day-info">
          <ion-chip>
            <ion-label>
              <span style="font-weight: bold;">{{ totalHours }}</span> hours
              worked on this date
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
                v-for="(name, index) in employees"
                :key="index"
                style="font-weight: bold;"
              >
                {{ name }}<span v-if="index != employees.length - 1">, </span>
              </span>
            </ion-label>
          </ion-chip>
        </ion-row>
        <ion-row class="ion-justify-content-center ion-margin">
          <AddButton :title="`Add Visit on ${date}`" @click="addVisit" />
        </ion-row>
        <ion-row v-if="state.day.visits" class="ion-justify-content-around">
          <ion-col
            size-xs="12"
            size-sm="12"
            size-md="12"
            size-lg="6"
            size-xl="6"
            v-for="(visit, index) in state.day.visits"
            :key="visit.id"
          >
            <ion-card>
              <ion-card-header>
                <ion-card-title>
                  Visit by {{ visit.employeeName }}
                </ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <VisitInline
                  v-model="state.day.visits[index]"
                  :separateByDefault="true"
                  :hideCustomerSelect="true"
                />
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonLabel,
  IonChip,
  IonButton,
  IonButtons,
  IonBackButton,
} from "@ionic/vue";

import { computed, reactive } from "@vue/reactivity";
import { retrieveVisitsOnDay } from "@/helpers";
import { ellipsisVertical } from "ionicons/icons";

import { CustomerDay, emptyVisit, Visit } from "@/types/work_units";
import VisitInline from "@/components/units/Visit.vue";
import AddButton from "@/components/buttons/AddButton.vue";

interface State {
  day: CustomerDay;
}

export default {
  name: "Customer Day",
  props: {
    username: String,
    date: String,
  },
  setup(props: any) {
    const state = reactive<State>({
      day: { customerName: props.username, date: props.date, visits: [] },
    });
    retrieveVisitsOnDay(state.day).then(
      (visits) => (state.day.visits = visits)
    );
    const totalHours = computed(() =>
      state.day.visits.reduce(
        (hoursAcc: number, visit: Visit) => hoursAcc + visit.time.hours,
        0
      )
    );

    const workTypes = computed(() => {
      const types: Array<string> = [];
      state.day.visits.forEach((visit) => {
        if (visit.workType && !types.includes(visit.workType))
          types.push(visit.workType);
      });
      console.log(types);
      return types;
    });

    const employees = computed(() => {
      const names: Array<string> = [];
      state.day.visits.forEach((visit) => {
        if (visit.employeeName && !names.includes(visit.employeeName))
          names.push(visit.employeeName);
      });
      return names;
    });

    const addVisit = () => {
      // Create an empty visit with the new date
      const visit = emptyVisit({
        date: props.date,
        customerName: props.username,
      });

      console.log(visit);

      // ADD VISIT TO DATABASE
      state.day.visits.unshift(visit);
    };

    return {
      state,
      icons: { ellipsisVertical },
      totalHours,
      workTypes,
      employees,
      addVisit,
    };
  },
  components: {
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonPage,
    IonGrid,
    IonRow,
    VisitInline,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonLabel,
    IonChip,
    IonButton,
    IonButtons,
    IonBackButton,
    AddButton,
  },
};
</script>

<style scoped>
.customer-day-info {
}
</style>
