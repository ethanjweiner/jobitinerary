<template>
  <ion-item :color="visit.read ? '' : 'light'">
    <div style="width: 20px;">
      <span class="dot" v-if="!visit.read"></span>
    </div>
    <div>
      <ion-label>{{ visit.customerName }} </ion-label>
      <ion-note>by {{ visit.employeeName }}</ion-note>
    </div>

    <ion-text slot="end" color="dark">{{
      visit.date.toLocaleDateString()
    }}</ion-text>
  </ion-item>
</template>

<script lang="ts">
import { IonItem, IonLabel, IonNote, IonText } from "@ionic/vue";

export default {
  name: "Visit Item",
  props: ["visit"],
  components: {
    IonItem,
    IonLabel,
    IonNote,
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
