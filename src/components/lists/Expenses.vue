<template>
  <Expense
    v-for="(expense, index) in state.expenses"
    :key="expense.id"
    :expense="expense"
    @deleteExpense="state.expenses.splice(index, 1)"
  />
  <ion-item button color="primary" @click="addExpense">
    <ion-icon :icon="add"></ion-icon>
    <ion-label>Add Expense</ion-label>
  </ion-item>
</template>

<script lang="ts">
// RETRIEVE & UPDATE EXPENSES LOCALLY ON THIS COMPONENT
import { add } from "ionicons/icons";
import { reactive } from "@vue/reactivity";
import { sampleExpense, emptyExpense } from "@/types";
import { IonItem, IonIcon, IonLabel } from "@ionic/vue";
import Expense from "./items/Expense.vue";

export default {
  name: "Expenses",
  props: {
    date: String,
  },
  components: { IonItem, IonIcon, IonLabel, Expense },
  setup() {
    const state = reactive({
      expenses: [sampleExpense],
    });

    const deleteExpense = (index: number) => {
      state.expenses.splice(index, 1);
    };

    const addExpense = () => {
      // Add expense to database & retrieve
      state.expenses.push(emptyExpense(Date.now().toString()));
    };

    return {
      state,
      deleteExpense,
      addExpense,
      add,
    };
  },
};
</script>

<style></style>
