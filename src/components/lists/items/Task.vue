<template>
  <ion-item>
    <ion-buttons slot="start">
      <ion-reorder slot="start"></ion-reorder>
      <ion-checkbox slot="start" v-model="state.task.complete"></ion-checkbox>
    </ion-buttons>
    <ion-textarea
      placeholder="Enter task"
      auto-grow
      rows="1"
      v-model="state.task.text"
    ></ion-textarea>
    <ion-buttons slot="end">
      <div v-if="task.image">Image Thumbnail</div>
      <ion-button v-else>
        <ion-icon :icon="cameraOutline"></ion-icon>
      </ion-button>
      <ion-button @click="$emit('deleteTask')">
        <ion-icon :icon="trashOutline"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-item>
</template>

<script lang="ts">
import {
  IonItem,
  IonTextarea,
  IonCheckbox,
  IonButtons,
  IonButton,
  IonIcon,
  IonReorder,
} from "@ionic/vue";
import { trashOutline, cameraOutline } from "ionicons/icons";
import { reactive } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

export default {
  name: "Task",
  props: {
    task: Object,
  },
  components: {
    IonItem,
    IonTextarea,
    IonCheckbox,
    IonButtons,
    IonButton,
    IonIcon,
    IonReorder,
  },
  emits: ["updateTask", "deleteTask"],
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      task: props.task,
    });

    watch(state.task, (newTask) => {
      emit("updateTask", newTask);
    });

    return {
      state,
      trashOutline,
      cameraOutline,
    };
  },
};
</script>

<style scoped>
ion-checkbox {
  margin-inline-end: 10px;
  margin-inline-start: 10px;
}
.ios > ion-checkbox {
  margin-top: 10px;
}
ion-textarea {
  margin: 5px;
}
ion-buttons {
  margin-right: 0;
}
</style>
