<template>
  <ion-toolbar
    :color="color ? color : 'primary'"
    slot="fixed"
    class="ion-padding"
  >
    <h2 slot="start">
      {{ title }}
    </h2>
    <AddButton @click="addAction" slot="start" />
    <ion-item v-if="useDateInput" color="light">
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
    color: String,
    useDateInput: Boolean,
    disableSearch: Boolean,
  },
  components: { IonToolbar, IonSearchbar, AddButton, IonInput, IonItem },
};
</script>

<style scoped>
h2 {
  margin: 5px;
}
ion-toolbar {
  --background: var(--ion-color-tertiary);
}
</style>
