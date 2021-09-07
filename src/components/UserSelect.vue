<template>
  <ion-item>
    <ion-icon id="user-select" :icon="personOutline"></ion-icon>
    <ion-label style="margin-left: 10px;"
      >Select {{ type.charAt(0).toUpperCase() + type.slice(1) }}</ion-label
    >
    <ion-select
      style="border: none !important;"
      @ionChange="selectUser($event)"
      :value="selectedUser"
    >
      <ion-select-option
        v-for="user in users"
        :key="user.name"
        :value="user.name"
        >{{ user.name }}</ion-select-option
      >
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

import { personOutline } from "ionicons/icons";

export default defineComponent({
  name: "User Select",
  props: ["users", "selectedUser", "type"],
  components: {
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonIcon,
  },
  setup(props, { emit }) {
    const selectUser = (e: CustomEvent) => {
      emit("userChange", { name: e.detail.value });
    };
    return {
      personOutline,
      selectUser,
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
