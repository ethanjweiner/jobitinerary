<template>
  <Sections v-if="state.employee" :sections="sections" :wrapCards="true">
    <template v-slot:dates>
      <EmployeeDays
        :employeeID="state.employee.data.id"
        title="Dates"
        :dbRef="daysRef"
        :showPaidToggle="true"
      />
    </template>
    <template v-slot:expenses>
      <Expenses :key="expensesRef" title="Expenses" :dbRef="expensesRef" />
    </template>
    <template v-slot:pay>
      <PaymentInfo v-model="state.employee" />
    </template>
    <template v-slot:employee-info>
      <EmployeeForm v-model="state.employee" />
    </template>
  </Sections>
</template>

<script lang="ts">
import { computed, reactive, ref } from "@vue/reactivity";

import {
  calendarNumberOutline,
  personOutline,
  cashOutline,
  pricetagsOutline,
} from "ionicons/icons";

import store from "@/store";

import { CollectionRef, Query, SectionsType } from "@/types/auxiliary";
import { Company, Employee } from "@/types/users";
import Sections from "../Sections.vue";

import Expenses from "@/components/lists/ExpensesInfinite.vue";
import EmployeeDays from "@/components/lists/EmployeeDays.vue";
import PaymentInfo from "@/components/PaymentInfo.vue";
import EmployeeForm from "@/components/forms/EmployeeForm.vue";
import { companiesCollection } from "@/main";
import { watch } from "@vue/runtime-core";
import { nameToID } from "@/helpers";

interface State {
  employee: Employee | undefined;
}

export default {
  name: "Employee",
  props: {
    userID: String,
  },
  setup(props: any) {
    const state = reactive<State>({
      employee: undefined,
    });

    const sections = ref<SectionsType>([
      {
        name: "Dates",
        icon: calendarNumberOutline,
        id: "dates",
      },
      {
        name: "Expenses",
        icon: pricetagsOutline,
        id: "expenses",
      },
      {
        name: "Pay",
        icon: cashOutline,
        id: "pay",
      },
      {
        name: "Info",
        icon: personOutline,
        id: "employee-info",
      },
    ]);

    const daysRef = computed<CollectionRef>(() => {
      const base = companiesCollection
        .doc(`${store.state.companyID}/employees/${props.userID}`)
        .collection("days");

      return base;
    });

    const expensesRef = computed<Query>(() => {
      const base = companiesCollection
        .doc(`${store.state.companyID}/employees/${nameToID(props.userID)}`)
        .collection("expenses");

      return base;
    });

    // If the user is a Company, assign the employee based on the prop
    if (props.userID && store.state.user instanceof Company) {
      state.employee = store.state.user.employees.find(
        (employee) => employee.data.id == props.userID
      );
      // Otherwise, just use the signed in user
    } else if (store.state.user instanceof Employee) {
      state.employee = store.state.user;
    }

    if (state.employee)
      watch(state.employee.data, () => {
        if (state.employee) state.employee.save();
      });

    // Retrieve employee-specific data (dates, messages)
    return {
      sections,
      store,
      state,
      daysRef,
      expensesRef,
      icons: { pricetagsOutline },
    };
  },
  components: {
    Sections,
    EmployeeDays,
    PaymentInfo,
    EmployeeForm,
    Expenses,
  },
};
</script>

<style scoped></style>
