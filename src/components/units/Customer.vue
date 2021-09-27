<template>
  <Sections :sections="sections" :wrapCards="true">
    <template v-slot:dates>
      <div class="list">
        <CustomerDays :customerName="state.customer.name" />
      </div>
    </template>
    <template v-slot:jobs>
      <div class="list">
        <Jobs :customerName="state.customer.name" />
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
              <CustomerDays :customerName="state.customer.name" />
            </div>
          </ion-card>
        </ion-col>
        <ion-col size="6">
          <ion-card>
            <div class="list">
              <Jobs :customerName="state.customer.name" />
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
import { reactive, ref } from "@vue/reactivity";

import {
  calendarOutline,
  calendarNumberOutline,
  personOutline,
} from "ionicons/icons";

import store from "@/store";
import { SectionsType } from "@/types/auxiliary";

import Sections from "../Sections.vue";
import CustomerForm from "../forms/CustomerForm.vue";
import { Customer } from "@/types/users";

interface State {
  employee: Customer | undefined;
}

export default {
  name: "Customer",
  props: {
    username: String,
  },
  setup(props: any) {
    const state = reactive<State>({
      customer: null,
    });

    if (props.username && store.state.user) {
      state.customer = store.state.user.customers.find(
        (customer) => customer.name == props.username
      );
    } else {
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

    return {
      sections,
      state,
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
