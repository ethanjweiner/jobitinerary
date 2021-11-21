<template>
  <ion-card class="ion-text-start ion-margin">
    <ion-toolbar color="light">
      <ion-buttons slot="start" v-if="!hideUploadOption">
        <ImageUploader @imageChange="changeImage" />
      </ion-buttons>

      <ion-buttons slot="end">
        <ion-button @click="$emit('deleteImage')" v-if="!hideClose">
          <ion-icon color="dark" :icon="icons.close"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
    <!-- Change the src to be the image url -->
    <img v-if="state.image.ref" :src="state.imageURL" alt="Image" />
    <ion-card-content>
      <ion-textarea
        v-model="state.image.caption"
        auto-grow
        placeholder="Caption"
        v-if="!hideCaption"
        :debounce="config.constants.DEBOUNCE_AMOUNT"
      ></ion-textarea>
    </ion-card-content>
  </ion-card>
</template>

<script lang="ts">
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonIcon,
  IonTextarea,
  IonToolbar,
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { cameraOutline, close } from "ionicons/icons";

import config from "@/config/config";
import { getImageURL } from "@/helpers";

import ImageUploader from "./ImageUploader.vue";

export default {
  name: "Image With Caption",
  props: {
    modelValue: Object,
    hideUploadOption: Boolean,
    hideCaption: Boolean,
    hideClose: Boolean,
    color: String,
  },
  emits: ["update:modelValue", "deleteImage"],
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      image: props.modelValue,
      imageURL: "",
    });

    const changeImage = async (imageRef: string) => {
      state.image.ref = imageRef;
      state.imageURL = await getImageURL(imageRef);
    };

    if (state.image.ref)
      getImageURL(state.image.ref).then((url) => (state.imageURL = url));

    watch(state.image, (newImage) => {
      emit("update:modelValue", newImage);
    });

    // Retrieve image URL on load with saved ref

    return {
      state,
      icons: { close, cameraOutline },
      changeImage,
      config,
    };
  },
  components: {
    IonCard,
    IonCardContent,
    IonToolbar,
    IonButton,
    IonButtons,
    IonIcon,
    IonTextarea,
    ImageUploader,
  },
};
</script>

<style scoped>
ion-card {
  width: fit-content;
  display: inline-block;
}
img {
  max-height: 400px;
  max-width: 400px;
}
ion-textarea {
  margin: 0;
}
</style>
