<template>
  <ion-button @click="uploadImage">
    <ion-icon color="dark" :icon="icons.cameraOutline"></ion-icon>
    <ion-text color="dark" style="padding-left: 5px;" v-if="!hideText"
      >Upload Image</ion-text
    >
  </ion-button>
</template>

<script lang="ts">
import { IonButton, IonIcon, IonText, isPlatform } from "@ionic/vue";
import { cameraOutline } from "ionicons/icons";

import { generateUUID } from "@/helpers";
import { storage } from "@/main";
import { saveImage, takePhoto } from "@/mixins";
import store from "@/store";

export default {
  name: "Image Uploader",
  emits: ["imageChange"],
  components: {
    IonButton,
    IonIcon,
    IonText,
  },
  props: {
    hideText: Boolean,
  },
  setup(props: any, { emit }: { emit: any }) {
    const uploadImage = async () => {
      const image = await takePhoto();

      if (image && image.base64String) {
        if (isPlatform("ios")) await saveImage(image);

        const filePath = `${store.state.companyID}/images/${generateUUID()}.${
          image.format
        }`;
        const storageRef = storage.ref();
        // Store the image as a long string...
        await storageRef
          .child(filePath)
          .putString(image.base64String, "base64");
        emit("imageChange", filePath);
      }
    };
    return { icons: { cameraOutline }, uploadImage };
  },
};
</script>

<style></style>
