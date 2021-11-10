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
                v-model="state.customerID"
                type="customer"
                mode="light"
              />
              <div class="ion-text-start">
                <h3 class="text-secondary">Create a Job Name</h3>
              </div>
              <ion-item color="white">
                <ion-input
                  type="text"
                  placeholder="Descriptive name for the job"
                  v-model="state.jobName"
                  @keyup.enter="create"
                ></ion-input>
              </ion-item>

              <ion-button color="dark" expand="block" @click="create"
                >Create Job</ion-button
              >
              <ion-note
                >Note: You won't be able to change the customer later.</ion-note
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
  IonItem,
} from "@ionic/vue";

import router from "@/router";
import store from "@/store";
import UserSelect from "@/components/selects/UserSelect.vue";
import { reactive } from "@vue/reactivity";
import { createJob } from "@/db";
import { nameToID } from "@/helpers";

export default {
  name: "Select Date",
  props: {
    customerID: String,
  },
  setup(props: any) {
    const state = reactive({
      customerID: props.customerID == "new" ? "" : props.customerID,
      jobName: "",
    });

    const create = async () => {
      // Create a job with an id
      if (state.customerID && state.jobName) {
        await createJob(state.jobName, state.customerID);
        router.push({
          name: "Job",
          params: {
            userID: state.customerID,
            jobID: nameToID(state.jobName),
          },
        });
      } else throw Error("Please select a customer and job name.");
    };

    return {
      store,
      router,
      state,
      create,
    };
  },
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
    IonItem,
  },
};
</script>

<style scoped></style>
