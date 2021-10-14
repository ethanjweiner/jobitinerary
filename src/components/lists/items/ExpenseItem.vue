<template>
  <ion-item>
    <div slot="start">
      <ion-input
        type="text"
        placeholder="Name"
        :value="state.expense.name"
        :debounce="store.DEBOUNCE_AMOUNT"
        disabled
      ></ion-input>
      <ion-note style="margin: 0;" v-if="showDate">
        {{ state.expense.date }}
      </ion-note>
    </div>

    <CurrencyInput
      :value="state.expense.cost"
      :debounce="store.DEBOUNCE_AMOUNT"
      placeholder="Cost"
      :options="{ currency: 'USD' }"
      disabled
      style="margin-right: 10px;"
    />

    <ion-buttons slot="end" style="margin: 0;">
      <ion-note style="margin: auto;" v-if="state.expense.paid"
        ><ion-icon :icon="icons.checkmark"></ion-icon> Paid</ion-note
      >
      <ion-note style="margin: auto;" v-if="!state.expense.paid"
        >Unpaid</ion-note
      >
      <ion-toggle
        :checked="state.expense.paid"
        @ionChange="togglePaid"
        value="paid"
      ></ion-toggle>
    </ion-buttons>
  </ion-item>
</template>

<script lang="ts">
import {
  IonItem,
  IonInput,
  IonButtons,
  IonNote,
  IonIcon,
  IonToggle,
} from "@ionic/vue";
import { trashOutline, checkmark } from "ionicons/icons";
import CurrencyInput from "@/components/inputs/CurrencyInput.vue";
import store from "@/store";
import { companiesCollection } from "@/main";
import { reactive } from "@vue/reactivity";
import { ExpenseInterface } from "@/types/work_units";
import { nameToID } from "@/helpers";

export default {
  name: "Expense",
  props: {
    expense: Object,
    showDate: Boolean,
  },
  setup(props: any) {
    const state = reactive<{ expense: ExpenseInterface }>({
      expense: props.expense,
    });

    const togglePaid = async () => {
      state.expense.paid = !state.expense.paid;
      await companiesCollection
        .doc(
          `${state.expense.companyID}/employees/${nameToID(
            state.expense.employeeName
          )}/expenses/${state.expense.id}`
        )
        .update({ "data.paid": state.expense.paid });
    };

    return {
      state,
      store,
      togglePaid,
      icons: {
        trashOutline,
        checkmark,
      },
    };
  },
  components: {
    IonItem,
    IonInput,
    IonButtons,
    IonNote,
    IonIcon,
    IonToggle,
    CurrencyInput,
  },
};
</script>

<style scoped>
.currency-input {
  width: 80px;
}
</style>
