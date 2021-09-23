<template>
  <Expense
    v-for="(expense, index) in state.expenses"
    :key="expense.id"
    v-model="state.expenses[index]"
    @deleteExpense="state.expenses.splice(index, 1)"
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
import { watch } from "@vue/runtime-core";
import { reactive } from "@vue/reactivity";
import { add } from "ionicons/icons";

import { emptyExpense, sampleExpense } from "@/types";

import Expense from "./items/Expense.vue";

export default {
  name: "Expenses",
  props: {
    dbRef: String,
    date: String,
  },
  setup(props: any) {
    const state = reactive({
      expenses: [sampleExpense, sampleExpense],
    });

    watch(state.expenses, (newExpenses) => {
      // UPDATE IN DATABASE
      console.log(props.dbRef, newExpenses);
    });

    const addExpense = () => {
      // Add expense to database & retrieve
      state.expenses.push(emptyExpense(Date.now().toString()));
    };
    return {
      state,
      addExpense,
      add,
    };
  },
  components: { IonItem, IonIcon, IonLabel, Expense },
};
</script>

<style></style>
