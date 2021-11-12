<template>
  <ion-reorder-group @ionItemReorder="reorderTools($event)" disabled="false">
    <Tool
      v-for="(tool, index) in state.tools"
      :key="tool.id"
      v-model="state.tools[index]"
      @deleteTool="deleteTool(index)"
    />
    <ion-item class="ion-item-button" button color="secondary" @click="addTool">
      <ion-icon color="light" :icon="add"></ion-icon>
      <ion-label color="light">Add Tool</ion-label>
    </ion-item>
  </ion-reorder-group>
</template>

<script lang="ts">
import { IonIcon, IonItem, IonLabel,IonReorderGroup } from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import { defineComponent, watch } from "@vue/runtime-core";
import { add } from "ionicons/icons";

import Tool from "./items/Tool.vue";

export default defineComponent({
  name: "Tasks",
  props: {
    modelValue: Array,
  },
  emits: ["update:modelValue"],
  components: {
    IonReorderGroup,
    Tool,
    IonItem,
    IonLabel,
    IonIcon,
  },
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      tools: [...props.modelValue],
    });

    const addTool = () => {
      state.tools.push({
        name: "",
        returned: false,
        id: Date.now(),
      });
    };

    const reorderTools = (ev: CustomEvent) => {
      ev.detail.complete();
      const temp = state.tools[ev.detail.from];
      state.tools[ev.detail.from] = state.tools[ev.detail.to];
      state.tools[ev.detail.to] = temp;
    };

    const deleteTool = (index: number) => {
      state.tools.splice(index, 1);
    };

    watch(state.tools, (newTools) => {
      emit("update:modelValue", newTools);
    });

    return {
      add,
      reorderTools,
      addTool,
      deleteTool,
      state,
    };
  },
});
</script>

<style></style>
