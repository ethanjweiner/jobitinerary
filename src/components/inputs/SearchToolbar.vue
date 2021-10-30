<template>
  <ion-toolbar color="primary" slot="fixed" class="ion-padding">
    <h2 slot="start">
      {{ title }}
    </h2>
    <AddButton v-if="!disableAdd" @click="addAction" slot="start" />
    <ion-item v-if="useDateInput && !disableSearch" color="light">
      <ion-input
        type="date"
        :value="modelValue"
        @ionInput="$emit('update:modelValue', $event.target.value)"
        placeholder="Search by date"
      ></ion-input>
    </ion-item>
    <ion-searchbar
      v-else-if="!disableSearch"
      class="ion-text-start"
      @ionInput="$emit('update:modelValue', $event.target.value)"
      :value="modelValue"
    ></ion-searchbar>
  </ion-toolbar>
  <slot name="filter"></slot>
  <!-- Input an optional filter -->
</template>

<script lang="ts">
import { IonToolbar, IonSearchbar, IonInput, IonItem } from "@ionic/vue";
import AddButton from "@/components/buttons/AddButton.vue";

export default {
  name: "Search Toolbar",
  emits: ["update:modelValue"],
  props: {
    title: String,
    modelValue: String,
    addAction: Function,
    useDateInput: Boolean,
    disableSearch: Boolean,
    disableAdd: Boolean,
  },
  components: { IonToolbar, IonSearchbar, AddButton, IonInput, IonItem },
};
</script>

<style scoped>
ion-item {
  max-width: 400px;
}
h2 {
  margin: 5px;
}
ion-toolbar {
  --background: var(--ion-color-tertiary);
}
</style>
