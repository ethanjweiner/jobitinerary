<template>
  <ion-item>
    <ion-input
      type="text"
      placeholder="Name"
      v-model="state.expense.name"
    ></ion-input>
    <CurrencyInput
      v-model="state.expense.cost"
      :options="{ currency: 'USD' }"
    />

    <ion-buttons slot="end">
      <ion-note style="margin: auto;" v-if="state.expense.paid"
        ><ion-icon :icon="checkmark"></ion-icon> Paid</ion-note
      >
      <ion-note style="margin: auto;" v-if="!state.expense.paid"
        >Unpaid</ion-note
      >
      <ion-toggle v-model="state.expense.paid" value="paid"></ion-toggle>
      <ion-button @click="$emit('deleteExpense')">
        <ion-icon :icon="trashOutline"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-item>
</template>

<script>
import {
  IonItem,
  IonInput,
  IonButton,
  IonButtons,
  IonNote,
  IonIcon,
  IonToggle,
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import { trashOutline, checkmark } from "ionicons/icons";
import CurrencyInput from "@/components/inputs/CurrencyInput.vue";

export default {
  name: "Expense",
  props: {
    expense: Object,
  },
  emits: ["deleteExpense"],
  components: {
    IonItem,
    IonInput,
    IonButton,
    IonButtons,
    IonNote,
    IonIcon,
    IonToggle,
    CurrencyInput,
  },
  setup(props) {
    const state = reactive({
      expense: props.expense,
    });
    return {
      state,
      trashOutline,
      checkmark,
    };
  },
};
</script>

<style></style>
