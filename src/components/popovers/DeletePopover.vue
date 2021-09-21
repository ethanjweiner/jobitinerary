<template>
  <ion-list>
    <ion-item button @click="$emit('delete')">
      <ion-text color="danger">
        <ion-icon :icon="trash" color="danger"></ion-icon>
        Delete {{ unitName }}
      </ion-text>
    </ion-item>
  </ion-list>
</template>

<script>
import { trash } from "ionicons/icons";
import { IonList, IonItem, IonText, IonIcon } from "@ionic/vue";
export default {
  name: "Delete Popover",
  components: { IonList, IonItem, IonText, IonIcon },
  props: {
    unitName: String,
  },
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
