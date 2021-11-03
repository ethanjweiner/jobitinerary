<template>
  <ion-grid>
    <ion-row class="ion-justify-content-around ion-hide-md-up">
      <ion-chip style="margin: auto;" class="ion-text-center" @click="addImage">
        <ion-icon :icon="add"></ion-icon>
        <ion-label style="margin: 0 !important;">Add Image</ion-label>
      </ion-chip>
    </ion-row>

    <ion-row class="ion-justify-content-left">
      <ImageWithCaption
        v-for="(image, index) in state.images"
        :key="image.ref"
        :modelValue="image"
        @update:modelValue="(newImage) => (state.images[index] = newImage)"
        @deleteImage="deleteImage(index)"
        :showCaption="true"
        :showUploadOption="true"
      />
    </ion-row>
  </ion-grid>
</template>

<script lang="ts">
import { reactive } from "@vue/reactivity";
import ImageWithCaption from "../ImageWithCaption.vue";
import { watch } from "@vue/runtime-core";
import { IonGrid, IonRow, IonChip, IonIcon, IonLabel } from "@ionic/vue";
import { add } from "ionicons/icons";

export default {
  name: "Images",
  props: {
    modelValue: Array,
  },
  emits: ["update:modelValue"],
  components: {
    ImageWithCaption,
    IonGrid,
    IonRow,
    IonChip,
    IonIcon,
    IonLabel,
  },
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      images: props.modelValue,
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
      emit("update:modelValue", newImages);
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

<style scoped>
ion-grid {
  --ion-grid-padding-xs: 5px;
  --ion-grid-padding-sm: 5px;
  --ion-grid-padding-md: 5px;
  --ion-grid-padding-lg: 8px;
  --ion-grid-padding-xl: 8px;
  --ion-grid-column-padding-xs: 2px;
  --ion-grid-column-padding-sm: 2px;
  --ion-grid-column-padding-md: 4px;
  --ion-grid-column-padding-lg: 6px;
  --ion-grid-column-padding-xl: 6px;
}
</style>
