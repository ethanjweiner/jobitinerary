<template>
  <Sections :sections="sections" :wrapCards="true">
    <template v-slot:dates>
      <div class="list">
        <EmployeeDays
          :days="state.days"
          :employeeName="state.employee.name"
          @maxReached="(ev) => loadData(ev, pushDays, state.dateFilter)"
          @searchChanged="refreshDays"
          title="Dates"
        />
      </div>
    </template>
    <template v-slot:pay>
      <PaymentInfo v-model="state.employee" />
    </template>
    <template v-slot:employee-info>
      <EmployeeForm v-model="state.employee" />
    </template>
    <template v-slot:sectionsAsGrid>
      <ion-row>
        <ion-col size="6">
          <ion-card>
            <div style="height: 500px;">
              <EmployeeDays
                :days="state.days"
                :employeeName="state.employee.name"
                @maxReached="(ev) => loadData(ev, pushDays, state.dateFilter)"
                @searchChanged="refreshDays"
                title="Dates"
              />
            </div>
          </ion-card>
        </ion-col>
        <ion-col size="6">
          <ion-row>
            <ion-card class="ion-padding" style="width: 100%;">
              <ion-card-header>
                <ion-card-title>
                  Employee Info
                </ion-card-title>
              </ion-card-header>
              <EmployeeForm v-model="state.employee" />
            </ion-card>
          </ion-row>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="12">
          <ion-card>
            <ion-card-header>
              <ion-card-title>
                Payment Info
              </ion-card-title>
            </ion-card-header>
            <PaymentInfo v-model="state.employee" />
          </ion-card>
        </ion-col>
      </ion-row>
    </template>
  </Sections>
</template>

<script lang="ts">
import {
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/vue";
import { reactive, ref } from "@vue/reactivity";

import {
  calendarNumberOutline,
  personOutline,
  cashOutline,
} from "ionicons/icons";

import store from "@/store";

import { Day, Employee, sampleDay, SectionsType } from "@/types";
import Sections from "../Sections.vue";

import EmployeeDays from "@/components/lists/EmployeeDays.vue";
import PaymentInfo from "@/components/PaymentInfo.vue";
import EmployeeForm from "@/components/forms/EmployeeForm.vue";
import { includeItemInSearch, loadData } from "@/helpers";

const DAYS_PUSH_QUANTITY = 5;

interface State {
  employee: Employee | undefined;
  days: Array<Day>;
  daysOffset: number;
  dateFilter: string;
}

export default {
  name: "Employee",
  props: {
    username: String,
  },
  setup(props: any) {
    const state = reactive<State>({
      employee: store.state.companyState.employees.find(
        (employee) => employee.name == props.username
      ),
      days: [],
      daysOffset: 0,
      dateFilter: "",
    });

    const sections = ref<SectionsType>([
      {
        name: "Dates",
        icon: calendarNumberOutline,
        id: "dates",
      },
      {
        name: "Pay",
        icon: cashOutline,
        id: "pay",
      },
      {
        name: "Employee",
        icon: personOutline,
        id: "employee-info",
      },
    ]);

    const loaders = {
      pushDays: async (searchFilter?: string): Promise<0 | 1> => {
        console.log("Loading more days at offset ", state.daysOffset);
        const max = state.days.length + DAYS_PUSH_QUANTITY;
        const min = max - DAYS_PUSH_QUANTITY;

        // QUERY THE COLLECTION -> QUERY INDIVIDUAL DOCS AND PUSH UNTIL MAX IS REACHED
        for (let i = min; i < max; i++) {
          if (searchFilter)
            if (includeItemInSearch(sampleDay, searchFilter, ["date"]))
              state.days.push(sampleDay);
            else continue;
          else state.days.push(sampleDay);
        }

        state.daysOffset += DAYS_PUSH_QUANTITY;

        return 0;
      },
    };

    const refreshDays = (dateFilter: string) => {
      state.days = [];
      state.daysOffset = 0;
      loaders.pushDays(dateFilter);
      state.dateFilter = dateFilter;
    };

    loaders.pushDays();

    // Retrieve employee-specific data (dates, messages)
    return {
      sections,
      store,
      state,
      ...loaders,
      loadData,
      refreshDays,
    };
  },
  components: {
    Sections,
    EmployeeDays,
    PaymentInfo,
    EmployeeForm,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
  },
};
</script>

<style scoped></style>
