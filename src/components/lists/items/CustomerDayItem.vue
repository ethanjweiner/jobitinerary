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
  name: "Customer Day Item",
  props: {
    day: Object,
  },
  components: {
    IonItem,
    IonLabel,
    IonText,
  },
};
</script>

<style></style>
