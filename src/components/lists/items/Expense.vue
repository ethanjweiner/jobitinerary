<template>
  <ion-item>
    <div slot="start">
      <ion-input
        type="text"
        placeholder="Name"
        v-model="state.expense.data.name"
        @ionInput="$emit('update:modelValue', state.expense)"
        :debounce="config.constants.DEBOUNCE_AMOUNT"
        :disabled="hideControls"
      ></ion-input>
      <ion-note style="margin: 0;" v-if="showDate">
        {{ state.expense.data.date }}
      </ion-note>
    </div>

    <CurrencyInput
      v-model="state.expense.data.cost"
      @update:modelValue="$emit('update:modelValue', state.expense)"
      :debounce="config.constants.DEBOUNCE_AMOUNT"
      placeholder="Cost"
      :options="{ currency: 'USD' }"
      :disabled="hideControls"
      style="margin-right: 10px;"
    />

    <ion-buttons slot="end" style="margin: 0;">
      <ion-note style="margin: auto;" v-if="state.expense.data.paid"
        ><ion-icon :icon="icons.checkmark"></ion-icon> Paid</ion-note
      >
      <ion-note style="margin: auto;" v-if="!state.expense.data.paid"
        >Unpaid</ion-note
      >
      <ion-toggle
        @ionInput="$emit('update:modelValue', state.expense)"
        v-model="state.expense.data.paid"
        value="paid"
      ></ion-toggle>
      <ion-button @click="$emit('deleteExpense')" v-if="!hideControls">
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
  IonInput,
  IonItem,
  IonNote,
  IonToggle,
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { checkmark,trashOutline } from "ionicons/icons";

import CurrencyInput from "@/components/inputs/CurrencyInput.vue";
import config from "@/config/config";
import store from "@/store";

export default {
  name: "Expense",
  props: {
    modelValue: Object,
    hideControls: Boolean,
    showDate: Boolean,
  },
  emits: ["update:modelValue", "deleteExpense"],
  setup(props: any) {
    const state = reactive({
      expense: props.modelValue,
    });

    watch(state.expense.data, () => state.expense.save());

    return {
      state,
      store,
      icons: {
        trashOutline,
        checkmark,
      },
      config,
    };
  },
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
};
</script>

<style scoped>
.currency-input {
  width: 80px;
}
</style>
