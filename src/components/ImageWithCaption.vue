<template>
  <ion-card style="width: fit-content;">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button>
          <ion-icon :icon="cameraOutline"></ion-icon>
          <span style="padding-left: 5px;">Upload Image</span>
        </ion-button>
      </ion-buttons>

      <ion-buttons slot="end">
        <ion-button>
          <ion-icon :icon="close"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
    <img src="../images/splash.png" alt="Attach an Image" />
    <ion-textarea :value="image.caption" placeholder="Caption"></ion-textarea>
  </ion-card>
</template>

<script lang="ts">
import { computed } from "@vue/reactivity";
import { close, cameraOutline } from "ionicons/icons";
import {
  IonCard,
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
  IonTextarea,
} from "@ionic/vue";

export default {
  name: "Image With Caption",
  props: ["image"],
  setup(props: any) {
    const imageURL = computed(() => {
      // Upon any ref change, retrieve a new image URL
      return props.image.ref;
    });

    return {
      imageURL,
      close,
      cameraOutline,
    };
  },
  components: {
    IonCard,
    IonToolbar,
    IonButton,
    IonButtons,
    IonIcon,
    IonTextarea,
  },
};
</script>

<style scoped>
img {
  max-height: 300px;
}
ion-textarea {
  margin: 0;
  padding-left: 8px !important;
}
</style>
