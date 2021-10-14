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
        <ion-row v-if="state.visits" class="ion-justify-content-around">
          <ion-col
            size-xs="12"
            size-sm="12"
            size-md="12"
            size-lg="6"
            size-xl="6"
            v-for="(visit, index) in state.visits"
            :key="visit.id"
          >
            <ion-card>
              <ion-card-header>
                <ion-card-title v-if="visit.data.employeeName">
                  Visit by {{ visit.data.employeeName }}
                </ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <VisitInline
                  v-model="state.visits[index]"
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
import { ellipsisVertical } from "ionicons/icons";

import { CustomerDay, Visit } from "@/types/work_units";
import VisitInline from "@/components/units/Visit.vue";
import AddButton from "@/components/buttons/AddButton.vue";
import { createVisit } from "@/db";
import { retrieveVisitsOnDay } from "@/helpers";

interface State {
  day: CustomerDay | null;
  visits: Array<Visit>;
}

export default {
  name: "Customer Day",
  props: {
    username: String,
    date: String,
  },
  setup(props: any) {
    const state = reactive<State>({
      day: null,
      visits: [],
    });

    const initialize = async () => {
      // Initialze Visits
      state.visits = await retrieveVisitsOnDay(props.date, {
        customerName: props.username,
      });
    };

    initialize();

    const totalHours = computed(() =>
      state.visits.reduce(
        (hoursAcc: number, visit: Visit) => hoursAcc + visit.data.time.hours,
        0
      )
    );

    const workTypes = computed(() => {
      const types: Array<string> = [];
      state.visits.forEach((visit: Visit) => {
        if (visit.data.workType && !types.includes(visit.data.workType))
          types.push(visit.data.workType);
      });
      return types;
    });

    const employees = computed(() => {
      const names: Array<string> = [];
      state.visits.forEach((visit: Visit) => {
        if (visit.data.employeeName && !names.includes(visit.data.employeeName))
          names.push(visit.data.employeeName);
      });
      return names;
    });

    const addVisit = async () => {
      // ADD VISIT TO DATABASE

      const visit = await createVisit({ customerName: props.username });

      state.visits.unshift(visit);
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
