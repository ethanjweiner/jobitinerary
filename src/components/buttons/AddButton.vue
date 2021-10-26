<template>
  <ion-chip outline color="light">
    <ion-icon :icon="icons.add"></ion-icon>
    <ion-label class="ion-text-center">{{ title ? title : "Add" }}</ion-label>
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
      icons: { add },
    };
  },
};
</script>

<style scoped>
ion-chip {
  min-width: 80px;
}
</style>
