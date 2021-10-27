<template>
  <div class="image-container">
    <ion-card class="ion-text-start">
      <ion-toolbar color="light">
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
      <ion-card-content>
        <ion-textarea
          v-model="state.image.caption"
          auto-grow
          placeholder="Caption"
          v-if="!hideCaption"
        ></ion-textarea>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script lang="ts">
import { reactive } from "@vue/reactivity";
import { close, cameraOutline } from "ionicons/icons";
import {
  IonCard,
  IonCardContent,
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
}
ion-textarea {
  margin: 0;
}

.image-container {
  padding: 10px;
  width: fit-content;
}
</style>
