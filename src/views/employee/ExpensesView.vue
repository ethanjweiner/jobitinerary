<template>
  <ion-page>
    <ion-content>
      <div class="top-spacing">
        <Expenses
          v-model="state.expenses"
          title="Expenses"
          :employeeID="state.employee.data.id"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonContent, IonPage } from '@ionic/vue';
import { reactive } from '@vue/reactivity';

import Expenses from '@/components/lists/Expenses.vue';
import { companiesCollection } from '@/main';
import store from '@/store';
import { Expense } from '@/types/units';
export default {
  name: 'Expenses View',
  setup() {
    const state = reactive({
      employee: store.state.user,
      expenses: [],
    });

    const initializeExpenses = async () => {
      const expenseDocs = (
        await companiesCollection
          .doc(`${store.state.companyID}/employees/${store.state.user.data.id}`)
          .collection('expenses')
          .orderBy('data.date', 'desc')
          .get()
      ).docs;

      for (const doc of expenseDocs) {
        const expense = new Expense(
          doc.id,
          store.state.companyID,
          store.state.user.data.id
        );
        expense.init(doc.data().data).then(() => {
          state.expenses.push(expense);
        });
      }
    };

    initializeExpenses();

    return { state };
  },
  components: { IonContent, IonPage, Expenses },
};
</script>

<style></style>
