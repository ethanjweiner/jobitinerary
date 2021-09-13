<template>
  <Users
    :users="store.state.companyState.employees"
    :username="username"
    type="employee"
  >
    <EmployeeComponent :employee="state.selectedEmployee" />
  </Users>
</template>

<script lang="ts">
import Users from "./Users.vue";
import EmployeeComponent from "@/components/units/Employee.vue";
import store from "@/store";
import { reactive } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { Employee } from "@/types";

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
    const state = reactive<{ selectedEmployee: Employee | undefined }>({
      selectedEmployee: undefined,
    });

    state.selectedEmployee = store.state.companyState.employees.find(
      (employee) => employee.name == props.username
    );

    console.log(state.selectedEmployee);

    if (state.selectedEmployee) {
      watch(state.selectedEmployee, (newEmployee) => {
        // Update this employee in the database
        console.log(newEmployee);
      });
    }

    return {
      store,
      state,
    };
  },
};
</script>

<style></style>
