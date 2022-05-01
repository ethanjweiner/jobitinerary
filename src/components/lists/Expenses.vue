<template>
  <SearchToolbar
    :addAction="addExpense"
    disableSearch
    title="Expenses"
    v-if="!hideToolbar"
  />
  <div class="expenses-list">
    <ion-button
      class="ion-margin"
      color="tertiary"
      @click="addExpense"
      fill="outline"
      expand="block"
      size="lg"
    >
      <ion-icon :icon="icons.add"></ion-icon>
      Add Expense
    </ion-button>
    <List type="list" :items="state.expenses">
      <template v-slot:item="itemProps">
        <ExpenseItem
          :key="itemProps.item.id"
          @deleteExpense="deleteExpense"
          :expense="itemProps.item"
          :showDate="true"
          enableDelete
        />
      </template>
    </List>
  </div>
</template>

<script lang="ts">
import { IonButton, IonIcon } from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import { add } from "ionicons/icons";

import SearchToolbar from "@/components/inputs/SearchToolbar.vue";
import { createExpense } from "@/db";
import { formatDate } from "@/helpers";
import { Expense } from "@/types/units";

import ExpenseItem from "./items/ExpenseItem.vue";
import List from "./List.vue";

export default {
  name: "Expenses Infinite",
  props: {
    title: String,
    modelValue: Array,
    date: String,
    employeeID: String,
    hideToolbar: Boolean,
  },
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      expenses: props.modelValue,
    });

    const addExpense = async () => {
      // Add expense to database & retrieve
      const expense = await createExpense(props.employeeID, {
        date: props.date ? props.date : formatDate(new Date().toISOString()),
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
      icons: { add },
    };
  },
  components: {
    ExpenseItem,
    SearchToolbar,
    List,
    IonIcon,
    IonButton,
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
.expenses-list {
  max-width: 800px;
}
</style>
