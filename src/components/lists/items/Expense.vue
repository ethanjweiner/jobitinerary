<template>
  <ion-item>
    <div slot="start">
      <ion-input
        type="text"
        placeholder="Name"
        v-model="state.expense.name"
        :disabled="hideControls"
      ></ion-input>
      <ion-note style="margin: 0;" v-if="showDate">
        {{ state.expense.date }}
      </ion-note>
    </div>

    <CurrencyInput
      slot="end"
      v-model="state.expense.cost"
      placeholder="Cost"
      :options="{ currency: 'USD' }"
      :disabled="hideControls"
    />

    <ion-buttons slot="end" style="margin: 0;">
      <ion-note style="margin: auto;" v-if="state.expense.paid"
        ><ion-icon :icon="checkmark"></ion-icon> Paid</ion-note
      >
      <ion-note style="margin: auto;" v-if="!state.expense.paid"
        >Unpaid</ion-note
      >
      <ion-toggle v-model="state.expense.paid" value="paid"></ion-toggle>
      <ion-button @click="$emit('deleteExpense')" v-if="!hideControls">
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
    hideControls: Boolean,
    showDate: Boolean,
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

<style scoped>
.currency-input {
  width: 80px;
}
</style>
