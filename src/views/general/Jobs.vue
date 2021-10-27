<template>
  <ion-page>
    <ion-content>
      Test
    </ion-content>
  </ion-page>
</template>

<script>
import { IonContent, IonPage } from "@ionic/vue";

export default {
  name: "Jobs",
  props: {
    customerID: String,
    dbRef: Object,
  },
  components: { IonContent, IonPage },
};
</script>

<style></style>
