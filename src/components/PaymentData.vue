<template>
  <div>
    <div style="width: 100%; margin-top: 10px;">
      <h2>
        <ion-text class="ion-text-center">Payment Data</ion-text>
      </h2>
      <div class="ion-text-left ion-padding">
        <ion-note
          >Note: The data displayed is only as accurated as the numHours and
          expenses logged by the company or employee.</ion-note
        >
      </div>
    </div>
    <ion-grid>
      <ion-chip>
        <ion-label
          ><span class="payment-data">{{ numDays }}</span>
          <span v-if="filterUnpaid">&nbsp;Unpaid </span>
          Work Days</ion-label
        >
      </ion-chip>
      <ion-chip>
        <ion-label
          ><span class="payment-data">{{ numHours }} </span>
          <span v-if="filterUnpaid">&nbsp;Unpaid </span>
          Work Hours</ion-label
        >
      </ion-chip>
      <ion-chip>
        <ion-label
          ><span class="payment-data">${{ hoursAmount }} </span>
          <span v-if="filterUnpaid">&nbsp;Owed in Work Hours</span>
          <span v-else>&nbsp;Made from Hours Worked</span>
        </ion-label>
      </ion-chip>
      <ion-chip v-if="filterUnpaid">
        <ion-label
          ><span class="payment-data">${{ expensesAmount }}</span>
          Owed in Expenses
        </ion-label>
        <!-- Highlight this chip -->
      </ion-chip>
      <ion-chip v-if="filterUnpaid">
        <ion-label
          ><span class="payment-data">${{ totalAmount }} </span>
          Owed Total
        </ion-label>
      </ion-chip>
    </ion-grid>
  </div>
</template>

<script lang="ts">
import { IonText, IonNote, IonChip, IonLabel, IonGrid } from "@ionic/vue";

import { computed, reactive } from "@vue/reactivity";
import { CollectionRef } from "@/types/auxiliary";
import { EmployeeDayInterface, ExpenseInterface } from "@/types/units";

interface State {
  days: Array<EmployeeDayInterface>;
  expenses: Array<ExpenseInterface>;
}

export default {
  name: "Payment Data",
  props: {
    daysRef: {
      type: Object as () => CollectionRef,
    },
    expensesRef: {
      type: Object as () => CollectionRef,
    },
    filterUnpaid: Boolean,
  },
  setup(props: any) {
    const state = reactive<State>({
      days: [],
      expenses: [],
    });

    const initialize = async () => {
      // Set up day and expense snapshots

      const dayDocs = (await props.daysRef.get()).docs;
      if (dayDocs) {
        state.days = dayDocs.map(
          (doc: any) => doc.data().data as EmployeeDayInterface
        );
      }
      const expenseDocs = (await props.expensesRef.get()).docs;
      if (expenseDocs) {
        state.expenses = expenseDocs.map(
          (doc: any) => doc.data().data as ExpenseInterface
        );
      }
    };

    initialize();

    const numDays = computed(() => state.days.length);

    const numHours = computed(() =>
      state.days.reduce(
        (acc: number, day: EmployeeDayInterface) => acc + day.time.hours * 1,
        0
      )
    );

    const hoursAmount = computed(() =>
      state.days.reduce(
        (acc: number, day: EmployeeDayInterface) =>
          acc + day.time.hours * day.hourlyRate,
        0
      )
    );

    const expensesAmount = computed(() =>
      state.expenses.reduce(
        (acc: number, expense: ExpenseInterface) => acc + expense.cost,
        0
      )
    );

    const totalAmount = computed(
      () => hoursAmount.value + expensesAmount.value
    );

    return {
      numDays,
      numHours,
      hoursAmount,
      expensesAmount,
      totalAmount,
    };
  },
  components: { IonText, IonNote, IonChip, IonLabel, IonGrid },
};
</script>

<style></style>
