<template>
  <!-- ADD A PAID STATUS FILTER -->
  <ExpenseComponent
    v-for="(expense, index) in state.expenses"
    :key="expense.id"
    v-model="state.expenses[index]"
    @deleteExpense="deleteExpense(expense)"
  />
  <ion-item
    style="margin-top: 10px;"
    button
    color="primary"
    @click="addExpense"
  >
    <ion-icon :icon="add"></ion-icon>
    <ion-label>Add Expense</ion-label>
  </ion-item>
</template>

<script lang="ts">
import { IonItem, IonIcon, IonLabel } from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import { add } from "ionicons/icons";

import ExpenseComponent from "./items/Expense.vue";
import { createExpense } from "@/db";
import { Expense } from "@/types/units";

export default {
  name: "Expenses",
  props: {
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
      state.expenses.push(expense);
      emit("update:modelValue", state.expenses);
    };

    const deleteExpense = async (expense: Expense) => {
      // DELETE VISIT FROM DATABASE
      await expense.delete();
      state.expenses = state.expenses.filter(
        (_expense: Expense) => expense.id != _expense.id
      );
      emit("update:modelValue", state.expenses);
    };

    return {
      state,
      addExpense,
      deleteExpense,
      add,
    };
  },
  components: { IonItem, IonIcon, IonLabel, ExpenseComponent },
};
</script>

<style></style>
