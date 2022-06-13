<template>
  <SearchToolbar
    :addAction="addExpense"
    disableSearch
    title="Expenses"
    v-if="!hideToolbar"
  >
    <template v-slot:filter>
      <ion-radio-group
        :value="filterUnpaid"
        @ionChange="filterUnpaid = !filterUnpaid"
      >
        <ion-grid>
          <ion-row>
            <ion-col size="12" size-sm="6" size-md="5" size-lg="4">
              <ion-item color="primary" class="toggle-item">
                <ion-radio
                  color="light"
                  slot="start"
                  :value="false"
                ></ion-radio>
                <ion-label>All Expenses</ion-label>
              </ion-item>
            </ion-col>
            <ion-col size="12" size-sm="6" size-md="5" size-lg="4">
              <ion-item color="primary" class="toggle-item">
                <ion-radio color="light" slot="start" :value="true"></ion-radio>
                <ion-label>Unpaid Expenses</ion-label>
              </ion-item>
            </ion-col>
            <ion-col class="ion-hide-md-down" size-md="2" size-lg="4">
              <ion-item color="primary"></ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-radio-group>
    </template>
  </SearchToolbar>
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
    <List type="list" :items="state.expenses" :key="key">
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
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonRow,
} from '@ionic/vue';
import { reactive, ref } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
import { add } from 'ionicons/icons';

import SearchToolbar from '@/components/inputs/SearchToolbar.vue';
import { createExpense } from '@/db';
import { formatDate } from '@/helpers';
import { Expense } from '@/types/units';

import ExpenseItem from './items/ExpenseItem.vue';
import List from './List.vue';

export default {
  name: 'Expenses Infinite',
  props: {
    title: String,
    modelValue: Array,
    date: String,
    employeeID: String,
    hideToolbar: Boolean,
  },
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      allExpenses: props.modelValue,
      expenses: props.modelValue,
    });

    const filterUnpaid = ref(true);

    if (filterUnpaid.value === true) {
      state.expenses = state.allExpenses.filter(
        (expense) => expense.data.paid === false
      );
    } else {
      state.expenses = state.allExpenses;
    }

    const key = ref(0);

    watch(filterUnpaid, (status) => {
      if (status === true) {
        state.expenses = state.allExpenses.filter(
          (expense) => expense.data.paid === false
        );
      } else {
        state.expenses = state.allExpenses;
      }

      key.value += 1;
    });

    const addExpense = async () => {
      // Add expense to database & retrieve
      const expense = await createExpense(props.employeeID, {
        date: props.date ? props.date : formatDate(new Date().toISOString()),
      });
      state.expenses.unshift(expense);
      emit('update:modelValue', state.expenses);
    };

    const deleteExpense = async (expense: Expense) => {
      await expense.delete();
      state.expenses = state.expenses.filter(
        (_expense: Expense) => _expense.id != expense.id
      );
      emit('update:modelValue', state.expenses);
    };

    return {
      state,
      addExpense,
      deleteExpense,
      filterUnpaid,
      icons: { add },
      key,
    };
  },
  components: {
    ExpenseItem,
    SearchToolbar,
    List,
    IonIcon,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonRadioGroup,
    IonRadio,
    IonLabel,
    IonItem,
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
