<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start" :collapse="true">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>New Day</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" style="height: 100%;">
      <ion-grid style="width: 100%; height: 100%;">
        <ion-row
          class="ion-justify-content-center ion-align-items-center"
          style="height: 100%;"
        >
          <ion-col size-xs="11" size-sm="8" size-md="5" size-lg="4" size-xl="3">
            <div class="ion-text-start">
              <h3 class="text-secondary">Select an Employee</h3>
            </div>
            <UserSelect
              :names="
                store.state.companyState.employees.map(
                  (employee) => employee.name
                )
              "
              :selectedName="state.employeeName"
              type="employee"
              :key="state.employeeName"
              v-model="state.employeeName"
            />
            <div class="ion-text-start">
              <h3 class="text-secondary">Select a Date</h3>
            </div>
            <DateSelect v-model="state.date" />
            <ion-button expand="block" color="primary" @click="createDay"
              >Create Day</ion-button
            >
            <ion-note
              >Note: You won't be able to change the date or employee
              later.</ion-note
            >
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import DateSelect from "@/components/selects/DateSelect.vue";
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonBackButton,
  IonButton,
  IonNote,
} from "@ionic/vue";

import router from "@/router";
import store from "@/store";
import UserSelect from "@/components/selects/UserSelect.vue";
import { reactive } from "@vue/reactivity";
import { dateToString } from "@/helpers";

export default {
  name: "Select Date",
  components: {
    IonPage,
    IonContent,
    DateSelect,
    IonGrid,
    IonRow,
    IonCol,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonBackButton,
    UserSelect,
    IonButton,
    IonNote,
  },
  props: {
    employeeName: String,
  },
  setup(props: any) {
    const state = reactive({
      employeeName: props.employeeName == "new" ? "" : props.employeeName,
      date: dateToString(new Date()),
    });

    const createDay = () => {
      if (state.employeeName && state.date)
        router.push({
          name: "Employee Day",
          params: { username: state.employeeName, date: state.date },
        });
      else throw Error("Please select an employee and date.");
    };

    return {
      router,
      state,
      store,
      createDay,
    };
  },
};
</script>

<style></style>
