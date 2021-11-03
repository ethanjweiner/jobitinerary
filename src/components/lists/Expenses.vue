<template>
  <SearchToolbar :addAction="addExpense" disableSearch title="Expenses" />
  <List type="list" :items="state.expenses">
    <template v-slot:item="itemProps">
      <ExpenseItem
        @deleteExpense="deleteExpense"
        :expense="itemProps.item"
        :showDate="true"
        enableDelete
      />
    </template>
  </List>
</template>

<script lang="ts">
import { reactive } from "@vue/reactivity";

import ExpenseItem from "./items/ExpenseItem.vue";
import SearchToolbar from "@/components/inputs/SearchToolbar.vue";
import List from "./List.vue";
import { createExpense } from "@/db";
import { Expense } from "@/types/units";

export default {
  name: "Expenses Infinite",
  props: {
    title: String,
    modelValue: Array,
    date: String,
    employeeID: String,
  },
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      expenses: props.modelValue,
    });

    const addExpense = async () => {
      // Add expense to database & retrieve
      const expense = await createExpense(props.employeeID, {
        date: props.date,
      });
      state.expenses.unshift(expense);
      emit("update:modelValue", state.expenses);
    };

    const deleteExpense = async (expense: Expense) => {
      await expense.delete();
      state.expenses = state.expenses.filter(
        (_expense: Expense) => _expense.id != expense.id
      );
      emit("update:modelValue", state.expenses);
    };

    return {
      state,
      addExpense,
      deleteExpense,
    };
  },
  components: {
    ExpenseItem,
    SearchToolbar,
    List,
  },
};
</script>

<style scoped>
ion-card-content {
  height: 80%;
  padding: 0;
}
ion-grid {
  --ion-grid-padding-xs: 0;
  --ion-grid-padding-sm: 0;
  --ion-grid-padding-md: 0;
  --ion-grid-padding-lg: 0;
  --ion-grid-padding-xl: 0;
  --ion-grid-column-padding-xs: 0;
  --ion-grid-column-padding-sm: 0;
  --ion-grid-column-padding-md: 0;
  --ion-grid-column-padding-lg: 0;
  --ion-grid-column-padding-xl: 0;
}
</style>
