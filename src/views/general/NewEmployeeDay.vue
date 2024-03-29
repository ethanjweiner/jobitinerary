<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start" :collapse="true">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Select Day</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" style="height: 100%;">
      <ion-grid style="width: 100%; height: 100%;">
        <ion-row
          class="ion-justify-content-center ion-align-items-center"
          style="height: 100%;"
        >
          <ion-col
            size-xs="12"
            size-sm="10"
            size-md="8"
            size-lg="6"
            size-xl="4"
          >
            <ion-card class="input-card">
              <div class="ion-text-start" v-if="showSelect">
                <h3 class="text-secondary">Select an Employee</h3>
              </div>
              <UserSelect
                v-if="showSelect"
                :names="
                  store.state.user.employees.map((employee) => employee.name)
                "
                :selectedName="state.employeeID"
                type="employee"
                :key="state.employeeID"
                mode="light"
                v-model="state.employeeID"
              />
              <div class="ion-text-start">
                <h3 class="text-secondary">Select a Date</h3>
              </div>
              <date-picker
                title="Select a Date"
                v-model="state.date"
              ></date-picker>
              <ion-button expand="block" color="primary" @click="create"
                >Create Day</ion-button
              >
              <ion-note
                >Note: You won't be able to change the date or employee
                later.</ion-note
              >
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonNote,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { reactive } from '@vue/reactivity';

import DatePicker from '@/components/inputs/DatePicker.vue';
import UserSelect from '@/components/selects/UserSelect.vue';
import { createEmployeeDay } from '@/db';
import { dateToString } from '@/helpers';
import router from '@/router';
import store from '@/store';

export default {
  name: 'Select Date',
  components: {
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
    UserSelect,
    IonButton,
    IonNote,
    IonCard,
    DatePicker,
  },
  props: {
    employeeID: String,
    showSelect: Boolean,
  },
  setup(props: any) {
    const state = reactive({
      employeeID: props.employeeID == 'new' ? '' : props.employeeID,
      date: dateToString(new Date()),
    });

    const create = async () => {
      if (state.employeeID && state.date) {
        await createEmployeeDay(state.date, state.employeeID);
        router.replace({
          name: `Employee Day / ${store.state.userType}`,
          params: { userID: state.employeeID, id: state.date },
        });
      } else throw Error('Please select an employee and date.');
    };

    return {
      router,
      state,
      store,
      create,
    };
  },
};
</script>

<style></style>
