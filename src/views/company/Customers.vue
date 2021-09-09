<template>
  <Users
    :users="state.companyState.customers"
    :username="username"
    type="customer"
  >
    <CustomerComponent v-if="state.companyState.selectedCustomer" />
  </Users>
</template>

<script lang="ts">
import Users from "./Users.vue";
import CustomerComponent from "@/components/units/Customer.vue";
import store from "@/store";

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
    if (props.username) store.fetchSelectedCustomer(props.username);

    return {
      state: store.state,
    };
  },
};
</script>

<style></style>
