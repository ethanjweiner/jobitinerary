<template>
  <ion-card class="ion-margin">
    <ion-item lines="none" class="ion-padding">
      <div slot="start">
        <ion-label color="tertiary">{{ state.expense.name }}</ion-label>
        <ion-note v-if="showDate">
          {{ state.expense.date }}
        </ion-note>
      </div>

      <ion-buttons slot="end" style="margin: 0;">
        <CurrencyInput
          v-model="state.expense.cost"
          placeholder="Cost"
          :options="{ currency: 'USD' }"
          disabled
          style="margin-right: 8px;"
        />
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
  </ion-card>
</template>

<script lang="ts">
import {
  IonButtons,
  IonCard,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonToggle,
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import { checkmark, trashOutline } from "ionicons/icons";

import CurrencyInput from "@/components/inputs/CurrencyInput.vue";
import { companiesCollection } from "@/main";
import store from "@/store";
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
    IonCard,
  },
};
</script>

<style scoped>
.currency-input {
  width: 80px;
}
</style>
