<template>
  <ion-reorder-group @ionItemReorder="reorderTasks($event)" disabled="false">
    <Task
      v-for="(task, index) in state.tasks"
      :key="task.id"
      @deleteTask="deleteTask(index)"
      :task="task"
      @updateTask="(newTask) => (state.tasks[index] = newTask)"
    />
    <ion-item button color="primary" @click="addTask">
      <ion-icon :icon="add"></ion-icon>
      <ion-label>Add Task</ion-label>
    </ion-item>
  </ion-reorder-group>
</template>

<script lang="ts">
import { IonReorderGroup, IonIcon, IonItem, IonLabel } from "@ionic/vue";
import Task from "./items/Task.vue";
import { add } from "ionicons/icons";
import { reactive } from "@vue/reactivity";
import { defineComponent, watch } from "@vue/runtime-core";

export default defineComponent({
  name: "Tasks",
  props: ["tasks"],
  emits: ["tasksChanged"],
  components: {
    IonReorderGroup,
    Task,
    IonItem,
    IonLabel,
    IonIcon,
  },
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      tasks: [...props.tasks],
    });

    const addTask = () => {
      state.tasks.push({
        text: "",
        complete: false,
        image: null,
        id: Date.now(),
      });
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
      emit("tasksChanged", newTasks);
    });

    return {
      add,
      reorderTasks,
      addTask,
      deleteTask,
      state,
    };
  },
});
</script>

<style></style>
