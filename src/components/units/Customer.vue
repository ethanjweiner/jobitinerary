<template>
  <Sections v-if="state.customer" :sections="sections" :wrapCards="true">
    <template v-slot:dates>
      <div class="list">
        <CustomerDays
          :customerID="state.customer.data.id"
          title="Dates"
          :dbRef="daysRef"
        />
      </div>
    </template>
    <template v-slot:jobs>
      <div class="list">
        <Jobs :customerID="state.customer.data.id" :dbRef="jobsRef" />
      </div>
    </template>
    <template v-slot:customer-info>
      <CustomerForm v-model="state.customer" />
    </template>
    <template v-slot:sectionsAsGrid>
      <ion-row>
        <ion-col size="6">
          <ion-card>
            <div class="list">
              <CustomerDays
                :customerID="state.customer.data.id"
                title="Dates"
                :dbRef="daysRef"
              />
            </div>
          </ion-card>
        </ion-col>
        <ion-col size="6">
          <ion-card>
            <div class="list">
              <Jobs :customerID="state.customer.data.id" :dbRef="jobsRef" />
            </div>
          </ion-card>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="12">
          <ion-card class="ion-padding">
            <ion-card-header>
              <ion-card-title>
                Customer Info
              </ion-card-title>
            </ion-card-header>
            <CustomerForm v-model="state.customer" />
          </ion-card>
        </ion-col>
      </ion-row>
    </template>
  </Sections>
</template>

<script lang="ts">
import Jobs from "@/components/lists/Jobs.vue";
import CustomerDays from "@/components/lists/CustomerDays.vue";

import {
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/vue";
import { computed, reactive, ref } from "@vue/reactivity";

import {
  calendarOutline,
  calendarNumberOutline,
  personOutline,
} from "ionicons/icons";

import store from "@/store";
import { CollectionRef, SectionsType } from "@/types/auxiliary";

import Sections from "../Sections.vue";
import CustomerForm from "../forms/CustomerForm.vue";
import { Company, Customer } from "@/types/users";
import { companiesCollection } from "@/main";
import { watch } from "@vue/runtime-core";

interface State {
  customer: Customer | undefined;
}

export default {
  name: "Customer",
  props: {
    userID: String,
  },
  setup(props: any) {
    const state = reactive<State>({
      customer: undefined,
    });

    const daysRef = computed<CollectionRef>(() => {
      const base = companiesCollection
        .doc(`${store.state.companyID}/customers/${props.userID}`)
        .collection("days");

      return base;
    });

    const jobsRef = computed<CollectionRef>(() => {
      const base = companiesCollection
        .doc(`${store.state.companyID}/customers/${props.userID}`)
        .collection("jobs");

      return base;
    });

    // If the user is a Company, assign the customer based on the prop
    if (props.userID && store.state.user instanceof Company) {
      state.customer = store.state.user.customers.find(
        (customer) => customer.data.id == props.userID
      );

      // Otherwise, use the signed in user
    } else if (store.state.user instanceof Customer) {
      state.customer = store.state.user;
    }

    const sections = ref<SectionsType>([
      {
        name: "Dates",
        icon: calendarNumberOutline,
        id: "dates",
      },
      {
        name: "Jobs",
        icon: calendarOutline,
        id: "jobs",
      },
      {
        name: "Customer",
        icon: personOutline,
        id: "customer-info",
      },
    ]);

    if (state.customer) watch(state.customer.data, () => state.customer.save());

    return {
      sections,
      state,
      daysRef,
      jobsRef,
    };
  },
  components: {
    Jobs,
    Sections,
    CustomerDays,
    CustomerForm,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
  },
};
</script>

<style scoped>
.address-input-item {
  max-width: 600px;
}
#suggestions-card {
  width: calc(100% - 120px);
  margin-top: 0;
}
</style>
