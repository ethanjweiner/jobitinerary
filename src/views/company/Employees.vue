<template>
  <Users
    :users="state.companyState.employees"
    :username="username"
    type="employee"
  >
    <EmployeeComponent v-if="state.companyState.selectedEmployee" />
  </Users>
</template>

<script lang="ts">
import Users from "./Users.vue";
import EmployeeComponent from "@/components/units/Employee.vue";
import store from "@/store";

// Sort employees alphabetically, with none selected
// Show employee if a employee is selected
export default {
  name: "Employees",
  props: ["username"],
  components: {
    Users,
    EmployeeComponent,
  },
  setup(props: any) {
    if (props.username) store.fetchSelectedEmployee(props.username);

    return {
      state: store.state,
    };
  },
};
</script>

<style></style>
