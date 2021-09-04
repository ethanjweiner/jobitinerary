<template>
  <ion-item>
    <div>
      <ion-label>{{ job.name }} </ion-label>
      <ion-note>for {{ job.customerName }}</ion-note>
    </div>
    <div slot="end">
      <p>starts</p>
      <ion-text color="dark">{{ job.startDate.toLocaleDateString() }}</ion-text>
    </div>
  </ion-item>
</template>

<script lang="ts">
import { IonItem, IonLabel, IonNote, IonText } from "@ionic/vue";

export default {
  name: "Visit Item",
  props: ["job"],
  components: {
    IonItem,
    IonLabel,
    IonNote,
    IonText,
  },
};
</script>

<style scoped>
div {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
