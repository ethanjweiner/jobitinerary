<template>
  <Sections :sections="sections" :wrapCards="true">
    <template v-slot:dates>
      <div class="list">
        <EmployeeDays :employeeName="employee.name" />
      </div>
    </template>
    <template v-slot:messages>
      <div class="list">
        <Messages />
      </div>
    </template>
    <template v-slot:pay>
      <PaymentInfo :employee="employee" />
    </template>
    <template v-slot:employee-info>
      <EmployeeForm :employee="employee" />
    </template>
    <template v-slot:sectionsAsGrid>
      <ion-row>
        <ion-col size="6">
          <ion-card>
            <div style="height: 500px;">
              <EmployeeDays :employeeName="employee.name" />
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
              <EmployeeForm :employee="employee" />
            </ion-card>
          </ion-row>
          <ion-row>
            <ion-card style="width: 100%;">
              <div style="height: 300px;">
                <Messages />
              </div>
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
            <PaymentInfo :employee="employee" />
          </ion-card>
        </ion-col>
      </ion-row>
    </template>
  </Sections>
</template>

<script lang="ts">
import Messages from "@/components/lists/Messages.vue";

import EmployeeDays from "@/components/lists/EmployeeDays.vue";
import {
  mailOpenOutline,
  calendarNumberOutline,
  personOutline,
  cashOutline,
} from "ionicons/icons";
import Sections from "../Sections.vue";
import store from "@/store";
import { SectionType } from "@/types";
import { ref } from "@vue/reactivity";
import PaymentInfo from "@/components/PaymentInfo.vue";
import EmployeeForm from "@/components/forms/EmployeeForm.vue";
import {
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/vue";

export default {
  name: "Employee",
  components: {
    Sections,
    Messages,
    EmployeeDays,
    PaymentInfo,
    EmployeeForm,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
  },
  props: {
    employee: Object,
  },
  setup() {
    const sections = ref<Array<SectionType>>([
      {
        name: "Messages",
        icon: mailOpenOutline,
        id: "messages",
      },
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
      state: store.state,
      sections,
    };
  },
};
</script>

<style scoped></style>
