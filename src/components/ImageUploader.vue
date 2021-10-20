<template>
  <ion-button @click="uploadImage">
    <ion-icon :icon="icons.cameraOutline"></ion-icon>
    <span style="padding-left: 5px;" v-if="!hideText">Upload Image</span>
  </ion-button>
</template>

<script lang="ts">
import { IonButton, IonIcon } from "@ionic/vue";
import { cameraOutline } from "ionicons/icons";
import { storage } from "@/main";
import { Camera, CameraResultType } from "@capacitor/camera";
import { generateUUID } from "@/helpers";
import store from "@/store";

export default {
  name: "Image Uploader",
  emits: ["imageChange"],
  components: {
    IonButton,
    IonIcon,
  },
  props: {
    hideText: Boolean,
  },
  setup(props: any, { emit }: { emit: any }) {
    const uploadImage = async () => {
      console.log("Uploading image...");

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64,
      });

      if (image && image.base64String) {
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
