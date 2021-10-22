<template>
  <Sections v-if="state.employee" :sections="sections" :wrapCards="true">
    <template v-slot:dates>
      <div class="list">
        <!-- PASS DATABASE REFERENCE -->
        <EmployeeDays
          :employeeID="state.employee.data.id"
          :dbRef="daysRef"
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
              <!-- PASS DATABASE REFERENCE -->
              <EmployeeDays
                :dbRef="daysRef"
                :employeeID="state.employee.data.id"
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
import { computed, reactive, ref } from "@vue/reactivity";

import {
  calendarNumberOutline,
  personOutline,
  cashOutline,
} from "ionicons/icons";

import store from "@/store";

import { CollectionRef, SectionsType } from "@/types/auxiliary";
import { Company, Employee } from "@/types/users";
import Sections from "../Sections.vue";

import EmployeeDays from "@/components/lists/EmployeeDays.vue";
import PaymentInfo from "@/components/PaymentInfo.vue";
import EmployeeForm from "@/components/forms/EmployeeForm.vue";
import { companiesCollection } from "@/main";
import { watch } from "@vue/runtime-core";

interface State {
  employee: Employee | undefined;
}

export default {
  name: "Employee",
  props: {
    userID: String,
  },
  setup(props: any) {
    const state = reactive<State>({
      employee: undefined,
    });

    const daysRef = computed<CollectionRef>(() => {
      const base = companiesCollection
        .doc(`${store.state.companyID}/employees/${props.userID}`)
        .collection("days");

      return base;
    });

    // If the user is a Company, assign the employee based on the prop
    if (props.userID && store.state.user instanceof Company) {
      state.employee = store.state.user.employees.find(
        (employee) => employee.data.id == props.userID
      );
      // Otherwise, just use the signed in user
    } else if (store.state.user instanceof Employee) {
      state.employee = store.state.user;
    }

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

    if (state.employee)
      watch(state.employee.data, () => {
        if (state.employee) state.employee.save();
      });

    // Retrieve employee-specific data (dates, messages)
    return {
      sections,
      store,
      state,
      daysRef,
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
