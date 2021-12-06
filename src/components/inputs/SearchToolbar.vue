<template>
  <ion-toolbar color="primary" slot="fixed" class="ion-padding">
    <h2 slot="start">
      <ion-text color="light">
        {{ title }}
      </ion-text>
    </h2>
    <AddButton v-if="!disableAdd" @click="addAction" slot="start" />
    <ion-item
      style="margin-left: 10px;"
      v-if="useDateInput && !disableSearch"
      color="light"
    >
      <ion-input
        type="date"
        :value="modelValue"
        @ionInput="$emit('update:modelValue', $event.target.value)"
        placeholder="Search by date"
        clear-on-edit
      ></ion-input>
    </ion-item>
    <ion-searchbar
      color="light"
      v-else-if="!disableSearch"
      class="ion-text-start"
      @ionInput="$emit('update:modelValue', $event.target.value)"
      :value="modelValue"
    ></ion-searchbar>

    <ion-buttons slot="end" v-if="modalClose" style="margin-left: 10px;">
      <ion-button @click="$emit('close')">
        <ion-icon :icon="icons.close"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
  <slot name="filter"></slot>
  <!-- Input an optional filter -->
</template>

<script lang="ts">
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonInput,
  IonItem,
  IonSearchbar,
  IonText,
  IonToolbar,
} from "@ionic/vue";
import { close } from "ionicons/icons";

import AddButton from "@/components/buttons/AddButton.vue";

export default {
  name: "Search Toolbar",
  emits: ["update:modelValue", "close"],
  props: {
    title: String,
    modelValue: String,
    addAction: Function,
    useDateInput: Boolean,
    disableSearch: Boolean,
    disableAdd: Boolean,
    modalClose: Boolean,
  },
  setup() {
    return {
      icons: { close },
    };
  },
  components: {
    IonToolbar,
    IonSearchbar,
    AddButton,
    IonInput,
    IonItem,
    IonIcon,
    IonButton,
    IonButtons,
    IonText,
  },
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

ion-searchbar {
  margin-left: 10px;
}
.md ion-searchbar {
  background-color: white;
  padding: 0;
}
</style>
