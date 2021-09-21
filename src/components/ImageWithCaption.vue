<template>
  <ion-card style="width: fit-content;">
    <ion-toolbar>
      <ion-buttons slot="start" v-if="!hideUploadOption">
        <ImageUploader @imageChange="changeImage" />
      </ion-buttons>

      <ion-buttons slot="end">
        <ion-button @click="$emit('deleteImage')" v-if="!hideClose">
          <ion-icon :icon="icons.close"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
    <!-- Change the src to be the image url -->
    <img v-if="state.image.ref" :src="state.imageURL" alt="Image" />
    <ion-textarea
      v-model="state.image.caption"
      placeholder="Caption"
      v-if="!hideCaption"
    ></ion-textarea>
  </ion-card>
</template>

<script lang="ts">
import { reactive } from "@vue/reactivity";
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
import ImageUploader from "./ImageUploader.vue";
import { getImageURL } from "@/helpers";

export default {
  name: "Image With Caption",
  props: {
    modelValue: Object,
    hideUploadOption: Boolean,
    hideCaption: Boolean,
    hideClose: Boolean,
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
    };
  },
  components: {
    IonCard,
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
img {
  max-height: 400px;
}
ion-textarea {
  margin: 0;
}
</style>
