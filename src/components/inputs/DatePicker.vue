<template>
  <ion-item button="true" :id="id">
    <ion-label>
      <ion-icon :icon="icons.calendarNumberOutline"></ion-icon>
      {{ title }}
    </ion-label>
    <ion-text slot="end">{{ formatDate(state.date) }}</ion-text>
    <ion-popover class="date-popover" :trigger="id" :show-backdrop="true">
      <ion-datetime
        color="primary"
        v-model="state.date"
        presentation="date"
        ref="dateRef"
      >
        <ion-buttons slot="buttons">
          <ion-button color="primary" @click="confirm()">Confirm</ion-button>
        </ion-buttons>
      </ion-datetime>
    </ion-popover>
  </ion-item>
</template>

<script lang="ts">
import {
  IonButton,
  IonButtons,
  IonDatetime,
  IonIcon,
  IonItem,
  IonLabel,
  IonPopover,
  IonText,
} from "@ionic/vue";
import { reactive, ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { calendarNumberOutline } from "ionicons/icons";

import { formatDate, generateUUID } from "@/helpers";

export default {
  name: "Date Picker",
  components: {
    IonItem,
    IonPopover,
    IonDatetime,
    IonButtons,
    IonButton,
    IonLabel,
    IonIcon,
    IonText,
  },
  props: {
    modelValue: String,
    title: String,
  },
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      date: props.modelValue,
    });
    const id = generateUUID();

    watch(state, (newState) => {
      emit("update:modelValue", formatDate(newState.date));
    });

    const dateRef = ref();

    const confirm = () => {
      if (dateRef.value == undefined) return;
      dateRef.value.$el.confirm(true);
    };

    return {
      state,
      id,
      confirm,
      dateRef,
      formatDate,
      icons: { calendarNumberOutline },
    };
  },
};
</script>
