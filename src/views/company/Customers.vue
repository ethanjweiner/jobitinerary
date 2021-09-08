<template>
  <Users :users="customers" :username="username" type="customer">
    <CustomerComponent v-if="state.companyState.selectedCustomer" />
  </Users>
</template>

<script lang="ts">
import Users from "./Users.vue";
import CustomerComponent from "@/components/units/Customer.vue";
import store from "@/store";
import { Customer, sampleCustomer } from "@/types";
import { ref } from "@vue/reactivity";

// Sort customers alphabetically, with none selected
// Show customer if a customer is selected
export default {
  name: "Customers",
  props: ["username"],
  components: {
    Users,
    CustomerComponent,
  },
  setup(props: any) {
    // Fetch customers here
    const customers = ref<Array<Customer>>([
      sampleCustomer,
      sampleCustomer,
      sampleCustomer,
    ]);

    if (props.username) store.fetchSelectedCustomer(props.username);

    // Fetch customers

    return {
      state: store.state,
      customers,
    };
  },
};
</script>

<style></style>
