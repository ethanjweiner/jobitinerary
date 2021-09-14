<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start" :collapse="true">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>New Job</ion-title>
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
              <h3 class="text-secondary">Select a Customer</h3>
            </div>
            <UserSelect
              :names="
                store.state.companyState.customers.map(
                  (customer) => customer.name
                )
              "
              :selectedName="state.customerName"
              type="customer"
              @userChange="(name) => (state.customerName = name)"
            />
            <div class="ion-text-start">
              <h3 class="text-secondary">Create a Name</h3>
            </div>
            <ion-input
              type="text"
              placeholder="Descriptive name for the job"
              v-model="state.jobName"
            ></ion-input>
            <ion-button expand="block" color="primary" @click="createJob"
              >Create Job</ion-button
            >
            <ion-note
              >Note: You won't be able to change the customer later.</ion-note
            >
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
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
  IonInput,
} from "@ionic/vue";

import router from "@/router";
import store from "@/store";
import UserSelect from "@/components/selects/UserSelect.vue";
import { reactive } from "@vue/reactivity";

export default {
  name: "Select Date",
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
    IonInput,
  },
  props: {
    customerName: String,
  },
  setup(props: any) {
    const state = reactive({
      customerName: props.customerName == "new" ? "" : props.customerName,
      jobName: "",
    });

    const createJob = () => {
      // Create a job with an id
      if (state.customerName && state.jobName)
        router.push({
          name: "Job",
          params: { username: state.customerName, jobID: "sample_job_id" },
        });
      else throw Error("Please select an employee and date.");
    };

    return {
      router,
      state,
      store,
      createJob,
    };
  },
};
</script>

<style></style>