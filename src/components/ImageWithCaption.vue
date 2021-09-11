<template>
  <ion-card style="width: fit-content;">
    <ion-toolbar>
      <ion-buttons slot="start" v-if="showUploadOption">
        <ion-button @click="uploadImage">
          <ion-icon :icon="cameraOutline"></ion-icon>
          <span style="padding-left: 5px;">Upload Image</span>
        </ion-button>
      </ion-buttons>

      <ion-buttons slot="end">
        <ion-button @click="$emit('deleteImage')">
          <ion-icon :icon="close"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
    <img v-if="image.ref" src="../images/splash.png" alt="Image" />
    <ion-textarea
      v-model="state.image.caption"
      placeholder="Caption"
      v-if="showCaption"
    ></ion-textarea>
  </ion-card>
</template>

<script lang="ts">
import { computed, reactive } from "@vue/reactivity";
import { close, cameraOutline } from "ionicons/icons";
import {
  IonCard,
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
  IonTextarea,
} from "@ionic/vue";
import { watch } from "@vue/runtime-core";

export default {
  name: "Image With Caption",
  props: ["image", "showUploadOption", "showCaption"],
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      image: props.image,
    });

    const uploadImage = () => {
      console.log("Uplading image...");
    };

    const imageURL = computed(() => {
      // Upon any ref change, retrieve a new image URL
      return state.image.ref;
    });

    watch(state.image, (newImage) => {
      emit("imageChange", newImage);
    });

    return {
      imageURL,
      close,
      cameraOutline,
      state,
      uploadImage,
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
  max-height: 400px;
}
ion-textarea {
  margin: 0;
  padding-left: 8px !important;
}
</style>
