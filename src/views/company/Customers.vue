<template>
  <Users :users="customers" :username="username" type="customer">
    <CustomerComponent
      v-if="username"
      :customer="customers.find((customer) => customer.name == username)"
    />
  </Users>
</template>

<script lang="ts">
import Users from "./Users.vue";
import { onMounted, ref } from "vue";
import CustomerComponent from "@/components/units/Customer.vue";
import { Customer, Company, sampleCustomer } from "@/types";
import { fetchCustomers } from "@/companyState";
import { globalState } from "@/globalState";
// Sort customers alphabetically, with none selected
// Show customer if a customer is selected
export default {
  name: "Customers",
  props: ["username"],
  components: {
    Users,
    CustomerComponent,
  },
  setup() {
    // Fetch customers

    onMounted(() => {
      if (globalState.user) fetchCustomers(globalState.user as Company);
    });

    const customers = ref<Array<Customer>>([
      sampleCustomer,
      sampleCustomer,
      sampleCustomer,
    ]);

    return {
      customers,
    };
  },
};
</script>

<style></style>
