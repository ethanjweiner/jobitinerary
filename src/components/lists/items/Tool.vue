<template>
  <ion-item-sliding class="ion-padding">
    <ion-item-options side="start" @ionSwipe="toggleReturned">
      <ion-item-option color="secondary" expandable @click="toggleReturned">{{
        state.tool.returned ? "Unmark as Returned" : "Mark as Returned"
      }}</ion-item-option>
    </ion-item-options>
    <div class="tool-container">
      <ion-item color="light" lines="none">
        <ion-buttons slot="start">
          <ion-reorder slot="start"></ion-reorder>
        </ion-buttons>
        <ion-input
          placeholder="Enter tool"
          v-model="state.tool.name"
          @ionInput="$emit('update:modelValue', state.tool)"
          :debounce="config.constants.DEBOUNCE_AMOUNT"
          :id="state.tool.id"
        ></ion-input>
        <ion-buttons slot="end">
          <ion-note v-if="state.tool.returned">
            <ion-icon :icon="checkmark"></ion-icon>
            Returned
          </ion-note>

          <ion-button @click="$emit('deleteTool')">
            <ion-icon :icon="trashOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-item>
    </div>
  </ion-item-sliding>
</template>

<script lang="ts">
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonNote,
  IonReorder,
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import { checkmark, trashOutline } from "ionicons/icons";

import config from "@/config/config";
import store from "@/store";

export default {
  name: "Tool",
  props: {
    modelValue: Object,
  },
  emits: ["update:modelValue", "deleteTool"],
  components: {
    IonItem,
    IonButtons,
    IonButton,
    IonIcon,
    IonInput,
    IonReorder,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonNote,
  },
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      tool: props.modelValue,
    });

    const toggleReturned = () => {
      state.tool.returned = !state.tool.returned;
      emit("update:modelValue", state.tool);
    };

    return {
      state,
      store,
      toggleReturned,
      trashOutline,
      checkmark,
      config,
    };
  },
};
</script>

<style>
ion-buttons {
  margin-left: 0px;
  margin-right: 5px;
}
.tool-container {
  border: 1px solid var(--ion-color-secondary);
  border-radius: 10px;
}
</style>
