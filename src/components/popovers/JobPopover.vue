<template>
  <ion-list>
    <ion-item button @click="$emit('deleteJob')">
      <ion-text color="danger">
        <ion-icon :icon="trash" color="danger"></ion-icon>
        Delete Job
      </ion-text>
    </ion-item>
  </ion-list>
</template>

<script>
import { trash } from "ionicons/icons";
import { IonList, IonItem, IonText, IonIcon } from "@ionic/vue";
export default {
  name: "Job Popover",
  components: { IonList, IonItem, IonText, IonIcon },
  setup() {
    return { trash };
  },
};
</script>

<style>
ion-list {
  padding: 0 !important;
}
</style>
