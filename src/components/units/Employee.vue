<template>
  <Sections :sections="sections" :wrapCards="true">
    <template v-slot:dates>
      <div class="list">
        <!-- PASS DATABASE REFERENCE -->
        <EmployeeDays :employeeName="state.employee.name" title="Dates" />
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
              <!-- PASS DATABASE REFERENCE -->
              <EmployeeDays :employeeName="state.employee.name" title="Dates" />
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

import { Day, Employee, SectionsType } from "@/types";
import Sections from "../Sections.vue";

import EmployeeDays from "@/components/lists/EmployeeDays.vue";
import PaymentInfo from "@/components/PaymentInfo.vue";
import EmployeeForm from "@/components/forms/EmployeeForm.vue";

interface State {
  employee: Employee | undefined;
  days: Array<Day>;
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

    // Retrieve employee-specific data (dates, messages)
    return {
      sections,
      store,
      state,
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
