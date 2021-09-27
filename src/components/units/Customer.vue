<template>
  <Sections v-if="state.customer" :sections="sections" :wrapCards="true">
    <template v-slot:dates>
      <div class="list">
        <CustomerDays :customerName="state.customer.data.name" />
      </div>
    </template>
    <template v-slot:jobs>
      <div class="list">
        <Jobs :customerName="state.customer.data.name" />
      </div>
    </template>
    <template v-slot:customer-info>
      <CustomerForm
        v-model="state.customer"
        @update:modelValue="state.customer.save()"
      />
    </template>
    <template v-slot:sectionsAsGrid>
      <ion-row>
        <ion-col size="6">
          <ion-card>
            <div class="list">
              <CustomerDays :customerName="state.customer.data.name" />
            </div>
          </ion-card>
        </ion-col>
        <ion-col size="6">
          <ion-card>
            <div class="list">
              <Jobs :customerName="state.customer.data.name" />
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
            <CustomerForm
              v-model="state.customer"
              @update:modelValue="state.customer.save()"
            />
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
import { Company, Customer } from "@/types/users";

interface State {
  customer: Customer | undefined;
}

export default {
  name: "Customer",
  props: {
    username: String,
  },
  setup(props: any) {
    const state = reactive<State>({
      customer: undefined,
    });

    // If the user is a Company, assign the customer based on the prop
    if (props.username && store.state.user instanceof Company) {
      state.customer = store.state.user.customers.find(
        (customer) => customer.data.name == props.username
      );

      // Otherwise, use the signed in user
    } else if (store.state.user instanceof Customer) {
      state.customer = store.state.user;
    }

    console.log(state.customer);

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
