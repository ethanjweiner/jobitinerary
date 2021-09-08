<template>
  <ion-item>
    <div>
      <ion-label>
        <ion-text>
          {{ date.toDateString() }}
        </ion-text>
      </ion-label>
    </div>
  </ion-item>
</template>

<script lang="ts">
import { IonItem, IonLabel, IonText } from "@ionic/vue";

export default {
  name: "Visit Item",
  props: ["date"],
  components: {
    IonItem,
    IonLabel,
    IonText,
  },
};
</script>

<style scoped>
ion-item {
  cursor: pointer;
}
div {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
