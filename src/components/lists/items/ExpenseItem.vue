<template>
  <ion-item lines="full" class="ion-padding">
    <div slot="start">
      <ion-label color="tertiary">{{ state.expense.data.name }}</ion-label>
      <ion-note v-if="showDate">
        {{ state.expense.data.date }}
      </ion-note>
    </div>

    <CurrencyInput
      v-model="state.expense.data.cost"
      placeholder="Cost"
      :options="{ currency: 'USD' }"
      :disabled="disableInput"
    />

    <ion-buttons slot="end" style="margin: 0;">
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
</template>

<script lang="ts">
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonToggle,
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { checkmark,trashOutline } from "ionicons/icons";

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
  },
};
</script>

<style scoped>
.currency-input {
  width: 80px;
}
</style>
