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
    <ion-searchbar
      class="ion-text-start"
      @ionInput="$emit('update:modelValue', $event.target.value)"
      :value="modelValue"
    ></ion-searchbar>
  </ion-toolbar>
</template>

<script>
import { IonToolbar, IonSearchbar } from "@ionic/vue";
import AddButton from "@/components/buttons/AddButton.vue";

export default {
  name: "Search Toolbar",
  emits: ["update:modelValue"],
  props: {
    title: String,
    modelValue: String,
    addAction: Function,
    color: String,
  },
  components: { IonToolbar, IonSearchbar, AddButton },
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
