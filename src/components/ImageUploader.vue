<template>
  <button-with-spinner :loading="loading" @click="uploadImage">
    <ion-icon color="dark" :icon="icons.cameraOutline"></ion-icon>
    <ion-text color="dark" style="padding-left: 5px;" v-if="!hideText"
      >Upload Image</ion-text
    >
  </button-with-spinner>
</template>

<script lang="ts">
import { IonIcon, IonText } from "@ionic/vue";
import { ref } from "@vue/reactivity";
import { cameraOutline } from "ionicons/icons";

import { generateUUID } from "@/helpers";
import { storage } from "@/main";
import { takePhoto } from "@/mixins";
import store from "@/store";

import ButtonWithSpinner from "./buttons/ButtonWithSpinner.vue";

export default {
  name: "Image Uploader",
  emits: ["imageChange"],
  components: {
    IonIcon,
    IonText,
    ButtonWithSpinner,
  },
  props: {
    hideText: Boolean,
  },
  setup(props: any, { emit }: { emit: any }) {
    const loading = ref(false);

    const uploadImage = async () => {
      const { format, base64String } = await takePhoto();

      if (base64String) {
        loading.value = true;

        const filePath = `${
          store.state.companyID
        }/images/${generateUUID()}.${format}`;
        const storageRef = storage.ref();
        // Store the image as a long string...
        await storageRef.child(filePath).putString(base64String, "base64");
        emit("imageChange", filePath);
        loading.value = false;
      }
    };
    return { icons: { cameraOutline }, uploadImage, loading };
  },
};
</script>

<style></style>
