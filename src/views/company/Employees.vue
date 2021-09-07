<template>
  <Users :users="employees" :username="username" type="employee">
    <EmployeeComponent
      v-if="username"
      :employee="employees.find((employee) => employee.name == username)"
    />
  </Users>
</template>

<script lang="ts">
import Users from "./Users.vue";
import { ref } from "vue";
import EmployeeComponent from "@/components/units/Employee.vue";
import { Employee, sampleEmployee } from "@/types";
// Sort employees alphabetically, with none selected
// Show employee if a employee is selected
export default {
  name: "Employees",
  props: ["username"],
  components: {
    Users,
    EmployeeComponent,
  },
  setup() {
    const employees = ref<Array<Employee>>([
      sampleEmployee,
      sampleEmployee,
      sampleEmployee,
    ]);

    return {
      employees,
    };
  },
};
</script>

<style></style>
