<template>
  <ion-item>
    <div>
      <ion-label>{{ job.name }} </ion-label>
      <ion-note v-if="showCustomer">for {{ job.customerID }}</ion-note>
    </div>
    <div slot="end">
      <div style="padding: 0;" v-if="job.startDate">
        <ion-note color="dark">Start: {{ job.startDate }}</ion-note>
      </div>
      <div style="padding: 0;" v-if="job.endDate">
        <ion-note color="dark">End: {{ job.endDate }}</ion-note>
      </div>
    </div>
  </ion-item>
</template>

<script lang="ts">
import { IonItem, IonLabel, IonNote } from "@ionic/vue";
import router from "@/router";

export default {
  name: "Job Item",
  props: {
    job: Object,
    showCustomer: Boolean,
  },
  setup() {
    return {
      router,
    };
  },
  components: {
    IonItem,
    IonLabel,
    IonNote,
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
