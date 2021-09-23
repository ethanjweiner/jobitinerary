<template>
  <ion-chip style="margin-left: 10px;">
    <ion-icon :icon="add"></ion-icon>
    <ion-label>{{ title ? title : "Add New" }}</ion-label>
  </ion-chip>
</template>

<script lang="ts">
import { IonChip, IonIcon, IonLabel } from "@ionic/vue";
import { add } from "ionicons/icons";

export default {
  name: "Add Button",
  props: {
    title: String,
  },
  components: {
    IonChip,
    IonIcon,
    IonLabel,
  },
  setup() {
    return {
      add,
    };
  },
};
</script>

<style></style>
