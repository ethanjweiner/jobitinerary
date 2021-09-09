<template>
  <ion-item>
    <div>
      <ion-label>{{ job.name }} </ion-label>
      <ion-note v-if="showCustomer">for {{ job.customerName }}</ion-note>
    </div>
    <div slot="end">
      <ion-text color="dark">{{ job.startDate.toLocaleDateString() }}</ion-text>
    </div>
  </ion-item>
</template>

<script lang="ts">
import { IonItem, IonLabel, IonNote, IonText } from "@ionic/vue";

export default {
  name: "Visit Item",
  props: ["job", "showCustomer"],
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
