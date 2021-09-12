<template>
  <ion-item>
    <ion-icon v-if="type == 'customer'" :icon="cartOutline"></ion-icon>
    <ion-icon v-if="type == 'employee'" :icon="hammerOutline"></ion-icon>
    <ion-label style="margin-left: 10px;"
      >Select {{ type.charAt(0).toUpperCase() + type.slice(1) }}</ion-label
    >
    <ion-select
      style="border: none !important;"
      @ionChange="selectName($event)"
      :value="selectedName"
    >
      <ion-select-option v-for="name in names" :key="name" :value="name">{{
        name
      }}</ion-select-option>
    </ion-select>
  </ion-item>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import {
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonIcon,
} from "@ionic/vue";

import { cartOutline, hammerOutline } from "ionicons/icons";

export default defineComponent({
  name: "User Select",
  props: ["names", "selectedName", "type"],
  components: {
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonIcon,
  },
  setup(props, { emit }) {
    const selectName = (e: CustomEvent) => {
      if (e.detail.value) {
        emit("userChange", e.detail.value);
      }
    };
    return {
      cartOutline,
      hammerOutline,
      selectName,
    };
  },
});
</script>

<style scoped>
ion-card {
  max-width: 500px;
}
ion-item {
  padding-bottom: 0;
  margin-bottom: 0;
}
</style>
