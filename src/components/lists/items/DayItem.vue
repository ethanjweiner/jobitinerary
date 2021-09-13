<template>
  <ion-item>
    <div>
      <ion-label>
        <ion-text>
          {{ day.date }}
        </ion-text>
      </ion-label>
    </div>
  </ion-item>
</template>

<script lang="ts">
import { IonItem, IonLabel, IonText } from "@ionic/vue";

export default {
  name: "Visit Item",
  props: ["day"],
  components: {
    IonItem,
    IonLabel,
    IonText,
  },
  setup() {
    return {};
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
