<template>
  <Sections v-if="state.customer" :sections="sections">
    <template v-slot:dates>
      <CustomerDays
        :customerID="state.customer.data.id"
        title="Dates"
        :dbRef="daysRef"
      />
    </template>
    <template v-slot:jobs>
      <Jobs :customerID="state.customer.data.id" :dbRef="jobsRef" />
    </template>
    <template v-slot:customer-info>
      <CustomerForm v-model="state.customer" />
    </template>
  </Sections>
</template>

<script lang="ts">
import { computed, reactive, ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import {
  calendarNumberOutline,
  calendarOutline,
  personOutline,
} from "ionicons/icons";
import { useRoute } from "vue-router";

import CustomerDays from "@/components/lists/CustomerDays.vue";
import Jobs from "@/components/lists/Jobs.vue";
import { companiesCollection } from "@/main";
import store from "@/store";
import { CollectionRef, SectionsType } from "@/types/auxiliary";
import { Company, Customer } from "@/types/users";

import CustomerForm from "../forms/CustomerForm.vue";
import Sections from "../Sections.vue";

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
        name: "Info",
        icon: personOutline,
        id: "customer-info",
      },
    ]);
    const route = useRoute();

    if (state.customer)
      watch(state.customer.data, () => {
        if (state.customer) state.customer.save();
      });

    return {
      sections,
      state,
      daysRef,
      jobsRef,
      route,
    };
  },
  components: {
    Jobs,
    Sections,
    CustomerDays,
    CustomerForm,
  },
};
</script>

<style></style>
