<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start" :collapse="true">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Plan a Day</ion-title>
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
              <div class="ion-text-start">
                <h3 class="text-secondary">Select a Customer</h3>
              </div>
              <UserSelect
                :names="
                  store.state.user.customers.map((customer) => customer.name)
                "
                :selectedName="state.customerID"
                type="customer"
                :key="state.customerID"
                mode="light"
                v-model="state.customerID"
              />
              <div class="ion-text-start">
                <h3 class="text-secondary">Select a Date</h3>
              </div>
              <DateSelect v-model="state.date" />
              <ion-button expand="block" color="secondary" @click="create"
                >Create Day</ion-button
              >
              <ion-note
                >Note: You won't be able to change the date or customer
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
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";

import DateSelect from "@/components/selects/DateSelect.vue";
import UserSelect from "@/components/selects/UserSelect.vue";
import { createCustomerDay } from "@/db";
import { dateToString } from "@/helpers";
import router from "@/router";
import store from "@/store";

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
    IonCard,
  },
  props: {
    customerID: String,
  },
  setup(props: any) {
    const state = reactive({
      customerID: props.customerID == "new" ? "" : props.customerID,
      date: dateToString(new Date()),
    });

    const create = async () => {
      if (state.customerID && state.date) {
        await createCustomerDay(state.date, state.customerID);
        router.replace({
          name: "Customer Day",
          params: { userID: state.customerID, date: state.date },
        });
      } else throw Error("Please select an customer and date.");
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
