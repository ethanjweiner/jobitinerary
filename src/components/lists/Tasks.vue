<template>
  <div class="ion-margin">
    <ion-item class="reorder-item" lines="none">
      <ion-toggle v-model="state.enableReorder"></ion-toggle>
      <div>
        <ion-label style="margin-left: 5px;">Reorder Tasks</ion-label>
        <ion-note style="margin-left: 5px;" v-if="state.enableReorder"
          >Drag to reorder</ion-note
        >
      </div>
    </ion-item>
    <ion-reorder-group
      @ionItemReorder="reorderTasks($event)"
      :disabled="!state.enableReorder"
      @click="state.enableReorder = false"
    >
      <Task
        v-for="(task, index) in state.tasks"
        :key="task.id"
        v-model="state.tasks[index]"
        @deleteTask="deleteTask(index)"
      />
    </ion-reorder-group>
    <ion-item class="ion-item-button" button @click="addTask" color="secondary">
      <ion-icon color="light" :icon="add"></ion-icon>
      <ion-label color="light">Add Task</ion-label>
    </ion-item>
  </div>
</template>

<script lang="ts">
import {
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonReorderGroup,
  IonToggle,
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import { defineComponent, watch } from "@vue/runtime-core";
import { add } from "ionicons/icons";

import Task from "./items/Task.vue";

export default defineComponent({
  name: "Tasks",
  props: {
    modelValue: Array,
  },
  emits: ["update:modelValue"],
  components: {
    IonReorderGroup,
    Task,
    IonItem,
    IonLabel,
    IonIcon,
    IonToggle,
    IonNote,
  },
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      tasks: [...props.modelValue],
      enableReorder: false,
    });

    // Task updates

    const addTask = () => {
      const id = `task-${Date.now()}`;
      state.tasks.push({
        text: "",
        complete: false,
        image: {
          id: Date.now(),
          ref: "",
          caption: "",
        },
        id,
      });
      setTimeout(() => {
        document.querySelector(`#${id}`).setFocus();
      }, 50);
    };

    const reorderTasks = (ev: CustomEvent) => {
      ev.detail.complete();
      const temp = state.tasks[ev.detail.from];
      state.tasks[ev.detail.from] = state.tasks[ev.detail.to];
      state.tasks[ev.detail.to] = temp;
    };

    const deleteTask = (index: number) => {
      state.tasks.splice(index, 1);
    };

    watch(state.tasks, (newTasks) => {
      emit("update:modelValue", newTasks);
    });

    return {
      state,
      add,
      reorderTasks,
      addTask,
      deleteTask,
    };
  },
});
</script>

<style scoped>
ion-reorder-group {
  cursor: grab;
}
</style>
