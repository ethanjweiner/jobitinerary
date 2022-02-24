<template>
  <ion-item button="true" :id="id" :detail="false">
    <ion-label position="stacked">
      <ion-icon :icon="icons.timeOutline"></ion-icon>
      {{ title }}
    </ion-label>
    <ion-text style="padding: 5px;">{{
      modelValue ? formatTime(modelValue) : ""
    }}</ion-text>
    <ion-popover :trigger="id" :show-backdrop="false">
      <ion-datetime
        color="primary"
        v-model="state.time"
        presentation="time"
        ref="timeRef"
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
import { timeOutline } from "ionicons/icons";

import { formatTime, generateUUID } from "@/helpers";

export default {
  name: "Time Picker",
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
      time: props.modelValue,
    });
    const id = generateUUID();

    watch(state, (newState) => {
      emit("update:modelValue", newState.time);
    });

    const timeRef = ref();

    const confirm = () => {
      if (timeRef.value == undefined) return;
      timeRef.value.$el.confirm(true);
    };

    return {
      state,
      id,
      confirm,
      timeRef,
      formatTime,
      icons: { timeOutline },
    };
  },
};
</script>

<style></style>
