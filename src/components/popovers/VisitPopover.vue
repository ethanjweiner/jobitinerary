<template>
  <ion-list>
    <ion-item button @click="$emit('deleteVisit')">
      <ion-text color="danger">
        <ion-icon :icon="trash" color="danger"></ion-icon>
        Delete Visit
      </ion-text>
    </ion-item>
  </ion-list>
</template>

<script>
import { trash } from "ionicons/icons";
import { IonList, IonItem, IonText, IonIcon } from "@ionic/vue";
export default {
  name: "Visit Popover",
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
