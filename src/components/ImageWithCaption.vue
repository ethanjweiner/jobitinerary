<template>
  <ion-card>
    <img src="@/images/splash.png" alt="Image" />
    <ion-textarea
      :value="imageRef.caption"
      placeholder="Caption"
    ></ion-textarea>
  </ion-card>
</template>

<script>
import { IonCard, IonTextarea } from "@ionic/vue";
export default {
  name: "Image With Caption",
  props: ["imageRef"],
  components: { IonCard, IonTextarea },
};
</script>

<style></style>
