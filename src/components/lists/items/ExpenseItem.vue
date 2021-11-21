<template>
  <ion-card class="ion-margin">
    <ion-item lines="none" class="ion-padding">
      <ion-label position="stacked" v-if="showDate">
        {{ state.expense.data.date }}
      </ion-label>
      <ion-input v-model="state.expense.data.name" placeholder="Name">
      </ion-input>

      <ion-buttons slot="end" style="margin: 0;">
        <CurrencyInput
          v-model="state.expense.data.cost"
          placeholder="Cost"
          :options="{ currency: 'USD' }"
          :disabled="disableInput"
          style="margin-right: 8px;"
        />
        <ion-note style="margin-right: 7px;" v-if="state.expense.data.paid"
          ><ion-icon :icon="icons.checkmark"></ion-icon> Paid</ion-note
        >
        <ion-note style="margin-right: 7px;" v-else>Unpaid</ion-note>
        <ion-toggle v-model="state.expense.data.paid" value="paid"></ion-toggle>
        <ion-button
          @click="$emit('deleteExpense', state.expense)"
          v-if="enableDelete"
        >
          <ion-icon :icon="icons.trashOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-item>
  </ion-card>
</template>

<script lang="ts">
import {
  IonButton,
  IonButtons,
  IonCard,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonToggle,
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { checkmark, trashOutline } from "ionicons/icons";

import CurrencyInput from "@/components/inputs/CurrencyInput.vue";
import store from "@/store";
import { Expense } from "@/types/units";

export default {
  name: "Expense",
  props: {
    expense: Object,
    showDate: Boolean,
    enableDelete: Boolean,
    disableInput: Boolean,
  },
  emits: ["deleteExpense", "costChange"],
  setup(props: any) {
    const state = reactive<{ expense: Expense }>({
      expense: props.expense,
    });

    watch(state.expense.data, () => state.expense.save());

    return {
      state,
      store,
      icons: {
        trashOutline,
        checkmark,
      },
    };
  },
  components: {
    IonItem,
    IonButtons,
    IonButton,
    IonNote,
    IonIcon,
    IonToggle,
    CurrencyInput,
    IonLabel,
    IonInput,
    IonCard,
  },
};
</script>

<style scoped>
.currency-input {
  width: 80px;
}
</style>
