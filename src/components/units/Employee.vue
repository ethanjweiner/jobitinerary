<template>
  <Sections :sections="sections" :wrapCards="true">
    <template v-slot:messages>
      <div class="list">
        <!-- change to messages -->
        <Messages />
      </div>
    </template>
    <template v-slot:dates>
      <div class="list">
        <!-- change to employee days -->
        <EmployeeDays />
      </div>
    </template>
    <template v-slot:pay>
      <PaymentInfo />
    </template>
    <template v-slot:employee-info>
      <EmployeeForm />
    </template>
    <template v-slot:sectionsAsGrid>
      <ion-row>
        <ion-col size="6">
          <ion-card>
            <div class="list">
              <!-- change to messages -->
              <Messages />
            </div>
          </ion-card>
        </ion-col>
        <ion-col size="6">
          <ion-card>
            <div class="list">
              <!-- change to employee days -->
              <EmployeeDays />
            </div>
          </ion-card>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="6">
          <ion-card class="ion-padding">
            <ion-card-header>
              <ion-card-title>
                Employee Info
              </ion-card-title>
            </ion-card-header>
            <EmployeeForm />
          </ion-card>
        </ion-col>
        <ion-col size="6">
          <ion-card>
            <ion-card-header>
              <ion-card-title>
                Payment Info
              </ion-card-title>
            </ion-card-header>
            <PaymentInfo />
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
    return {
      state: store.state,
      sections,
    };
  },
};
</script>

<style scoped></style>
