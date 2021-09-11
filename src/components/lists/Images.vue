<template>
  <ion-grid>
    <ion-row class="ion-justify-content-around">
      <ion-chip class="ion-text-center" @click="addImage">
        <ion-icon :icon="add"></ion-icon>
        <ion-label style="margin: 0 !important;">Add Image</ion-label>
      </ion-chip>
    </ion-row>

    <ion-row class="ion-justify-content-around">
      <ion-col
        v-for="(image, index) in state.images"
        :key="image.id"
        size-xs="12"
        size-sm="6"
        size-md="4"
        size-lg="3"
        size-xl="3"
      >
        <ImageWithCaption
          :image="image"
          @imageChange="(newImage) => (state.images[index] = newImage)"
          @deleteImage="deleteImage(index)"
          style="margin: auto;"
          :showCaption="true"
          :showUploadOption="true"
        />
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts">
import { reactive } from "@vue/reactivity";
import ImageWithCaption from "../ImageWithCaption.vue";
import { watch } from "@vue/runtime-core";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonIcon,
  IonLabel,
} from "@ionic/vue";
import { add } from "ionicons/icons";

export default {
  name: "Images",
  props: {
    images: Array,
  },
  emits: ["imagesChange"],
  components: {
    ImageWithCaption,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonIcon,
    IonLabel,
  },
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      images: props.images,
    });

    const addImage = () => {
      state.images.unshift({
        ref: "",
        caption: "",
      });
    };

    const deleteImage = (index: number) => {
      state.images.splice(index, 1);
    };

    watch(state.images, (newImages) => {
      emit("imagesChange", newImages);
    });

    return {
      state,
      add,
      addImage,
      deleteImage,
    };
  },
};
</script>

<style></style>
