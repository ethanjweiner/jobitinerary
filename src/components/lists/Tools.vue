<template>
  <ion-reorder-group @ionItemReorder="reorderTools($event)" disabled="false">
    <Tool
      v-for="(tool, index) in state.tools"
      :key="tool.id"
      @deleteTool="deleteTool(index)"
      :tool="tool"
      @updateTool="(newTool) => (state.tools[index] = newTool)"
    />
    <ion-item button color="secondary" @click="addTool">
      <ion-icon :icon="add"></ion-icon>
      <ion-label>Add Tool</ion-label>
    </ion-item>
  </ion-reorder-group>
</template>

<script lang="ts">
import { IonReorderGroup, IonIcon, IonItem, IonLabel } from "@ionic/vue";
import Tool from "./items/Tool.vue";
import { add } from "ionicons/icons";
import { reactive } from "@vue/reactivity";
import { defineComponent, watch } from "@vue/runtime-core";

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
