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
      <Expenses
        v-model="state.expenses"
        title="Expenses"
        :employeeID="state.employee.data.id"
      />
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
import { watch } from "@vue/runtime-core";
import {
  calendarNumberOutline,
  cashOutline,
  personOutline,
  pricetagsOutline,
} from "ionicons/icons";

import EmployeeForm from "@/components/forms/EmployeeForm.vue";
import EmployeeDays from "@/components/lists/EmployeeDays.vue";
import Expenses from "@/components/lists/Expenses.vue";
import PaymentInfo from "@/components/PaymentInfo.vue";
import { companiesCollection } from "@/main";
import store from "@/store";
import { CollectionRef, SectionsType } from "@/types/auxiliary";
import { Expense } from "@/types/units";
import { Company, Employee } from "@/types/users";

import Sections from "../Sections.vue";

interface State {
  employee: Employee | undefined;
  expenses: Array<Expense>;
}

export default {
  name: "Employee",
  props: {
    userID: String,
  },
  setup(props: any) {
    const state = reactive<State>({
      employee: undefined,
      expenses: [],
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

    const initializeExpenses = async () => {
      const expenseDocs = (
        await companiesCollection
          .doc(`${store.state.companyID}/employees/${props.userID}`)
          .collection("expenses")
          .get()
      ).docs;

      for (const doc of expenseDocs) {
        const expense = new Expense(
          doc.id,
          store.state.companyID,
          props.userID
        );
        expense.init(doc.data().data).then(() => {
          state.expenses.push(expense);
        });
      }
    };

    // If the user is a Company, assign the employee based on the prop
    if (props.userID && store.state.user instanceof Company) {
      state.employee = store.state.user.employees.find(
        (employee) => employee.data.id == props.userID
      );
      // Otherwise, just use the signed in user
    } else if (store.state.user instanceof Employee) {
      state.employee = store.state.user;
    }

    if (state.employee) {
      watch(state.employee.data, () => {
        if (state.employee) state.employee.save();
      });
      initializeExpenses();
    }

    // Retrieve employee-specific data (dates, messages)
    return {
      sections,
      store,
      state,
      daysRef,
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
