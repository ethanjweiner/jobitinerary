<template>
  <ion-item lines="full" class="ion-padding">
    <div slot="start">
      <ion-label color="tertiary">{{ state.expense.name }}</ion-label>
      <ion-note v-if="showDate">
        {{ state.expense.date }}
      </ion-note>
    </div>

    <CurrencyInput
      v-model="state.expense.cost"
      placeholder="Cost"
      :options="{ currency: 'USD' }"
      disabled
    />

    <ion-buttons slot="end" style="margin: 0;">
      <ion-note style="margin-right: 7px;" v-if="state.expense.paid"
        ><ion-icon :icon="icons.checkmark"></ion-icon> Paid</ion-note
      >
      <ion-note style="margin-right: 7px;" v-if="!state.expense.paid"
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
  IonButtons,
  IonNote,
  IonIcon,
  IonToggle,
  IonLabel,
} from "@ionic/vue";
import { trashOutline, checkmark } from "ionicons/icons";
import CurrencyInput from "@/components/inputs/CurrencyInput.vue";
import store from "@/store";
import { companiesCollection } from "@/main";
import { reactive } from "@vue/reactivity";
import { ExpenseInterface } from "@/types/units";

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
          `${state.expense.companyID}/employees/${state.expense.employeeID}/expenses/${state.expense.id}`
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
    IonButtons,
    IonNote,
    IonIcon,
    IonToggle,
    CurrencyInput,
    IonLabel,
  },
};
</script>

<style scoped>
.currency-input {
  width: 80px;
}
</style>
