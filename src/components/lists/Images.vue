<template>
  <ion-grid>
    <ion-row class="ion-justify-content-around">
      <AddButton
        style="margin: auto;"
        @click="addImage"
        mode="dark"
        title="Add Image"
      />
    </ion-row>

    <ion-row class="ion-justify-content-left">
      <ion-col v-for="(image, index) in state.images" :key="image.ref">
        <ImageWithCaption
          :modelValue="image"
          @update:modelValue="(newImage) => (state.images[index] = newImage)"
          @deleteImage="deleteImage(index)"
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
import { IonGrid, IonRow } from "@ionic/vue";
import { add } from "ionicons/icons";
import AddButton from "../buttons/AddButton.vue";

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
    AddButton,
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
  --ion-grid-padding-sm: 10px;
  --ion-grid-padding-md: 15px;
  --ion-grid-padding-lg: 20px;
  --ion-grid-padding-xl: 20px;
  --ion-grid-column-padding-xs: 2px;
  --ion-grid-column-padding-sm: 2px;
  --ion-grid-column-padding-md: 3px;
  --ion-grid-column-padding-lg: 4px;
  --ion-grid-column-padding-xl: 5px;
}
</style>
