<template>
  <div>
    <div class="ion-text-start">
      <h3 class="text-secondary">Select a Date</h3>
    </div>
    <ion-item>
      <ion-label position="stacked"></ion-label>
      <ion-datetime display-format="MM/DD/YYYY" v-model="date"></ion-datetime>
    </ion-item>
    <ion-button
      expand="block"
      color="primary"
      @click="$emit('dateSelected', date.substring(0, 10))"
      >Confirm Date</ion-button
    >
    <ion-note
      >You won't be able to change the date later, so make sure this is
      right.</ion-note
    >
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { IonItem, IonLabel, IonDatetime, IonButton, IonNote } from "@ionic/vue";
import { dateToString } from "@/helpers";
export default {
  name: "Date Select",
  components: {
    IonItem,
    IonLabel,
    IonDatetime,
    IonButton,
    IonNote,
  },
  setup() {
    const date = ref(dateToString(new Date()));
    return {
      date,
    };
  },
};
</script>

<style></style>
