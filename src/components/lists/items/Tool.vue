<template>
  <ion-item-sliding>
    <ion-item-options
      side="start"
      @ionSwipe="state.tool.returned = !state.tool.returned"
    >
      <ion-item-option
        color="secondary"
        expandable
        @click="state.tool.returned = !state.tool.returned"
        >{{
          state.tool.returned ? "Unmark as Returned" : "Mark as Returned"
        }}</ion-item-option
      >
    </ion-item-options>

    <ion-item>
      <ion-buttons slot="start">
        <ion-reorder slot="start"></ion-reorder>
      </ion-buttons>
      <ion-input placeholder="Enter tool" v-model="state.tool.name"></ion-input>
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
  </ion-item-sliding>
</template>

<script lang="ts">
import { reactive } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

import {
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
} from "@ionic/vue";
import { trashOutline, checkmark } from "ionicons/icons";

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

    watch(state.tool, (newTool) => {
      emit("update:modelValue", newTool);
    });

    return {
      state,
      trashOutline,
      checkmark,
    };
  },
};
</script>

<style>
ion-buttons {
  margin-left: 0px;
  margin-right: 5px;
}
</style>
