<template>
  <ion-reorder>
    <ion-item>
      <ion-buttons slot="start">
        <ion-checkbox
          @ionInput="$emit('update:modelValue', state.task)"
          v-model="state.task.complete"
        ></ion-checkbox>
      </ion-buttons>
      <ion-input
        placeholder="General name"
        @ionInput="$emit('update:modelValue', state.task)"
        :debounce="store.DEBOUNCE_AMOUNT"
        v-model="state.task.header"
        type="text"
      >
      </ion-input>
      <ion-thumbnail
        slot="end"
        v-if="state.task.image.ref"
        @click="state.imageModalIsOpen = true"
      >
        <img :src="state.imageURL" alt="Img" />
      </ion-thumbnail>
      <ion-buttons slot="end">
        <ImageUploader :hideText="true" @imageChange="changeImage" />
        <ion-button @click="$emit('deleteTask')">
          <ion-icon :icon="icons.trashOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-item>
    <ion-item v-if="state.showTextAreas">
      <ion-textarea
        placeholder="Task-specific notes"
        auto-grow
        rows="1"
        @ionInput="$emit('update:modelValue', state.task)"
        :debounce="store.DEBOUNCE_AMOUNT"
        v-model="state.task.notes"
      ></ion-textarea>
    </ion-item>
    <ion-modal
      :is-open="state.imageModalIsOpen"
      @didDismiss="state.imageModalIsOpen = false"
    >
      <ion-card>
        <ion-toolbar>
          <ion-buttons slot="end">
            <ion-button @click="state.imageModalIsOpen = false">
              <ion-icon :icon="icons.close"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

        <img class="expanded-image" :src="state.imageURL" alt="Image" />
      </ion-card>
    </ion-modal>
  </ion-reorder>
</template>

<script lang="ts">
import {
  IonItem,
  IonTextarea,
  IonCheckbox,
  IonButtons,
  IonButton,
  IonIcon,
  IonReorder,
  IonInput,
  IonThumbnail,
  IonModal,
  IonCard,
  IonToolbar,
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import store from "@/store";

import { trashOutline, cameraOutline, close } from "ionicons/icons";

import { getImageURL } from "@/helpers";
import ImageUploader from "@/components/ImageUploader.vue";

export default {
  name: "Task",
  props: {
    modelValue: Object,
  },
  components: {
    IonItem,
    IonTextarea,
    IonCheckbox,
    IonButtons,
    IonButton,
    IonIcon,
    IonReorder,
    IonInput,
    IonThumbnail,
    IonModal,
    IonCard,
    IonToolbar,
    ImageUploader,
  },
  emits: ["update:modelValue", "deleteTask"],
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      task: props.modelValue,
      showTextAreas: false,
      imageModalIsOpen: false,
      imageURL: "",
    });

    setTimeout(() => (state.showTextAreas = true), 250);

    const changeImage = async (imageRef: string) => {
      state.task.image.ref = imageRef;
      emit("update:modelValue", state.task);
      state.imageURL = await getImageURL(imageRef);
    };

    if (state.task.image.ref)
      getImageURL(state.task.image.ref).then((url) => (state.imageURL = url));

    return {
      state,
      store,
      changeImage,
      icons: { trashOutline, cameraOutline, close },
    };
  },
};
</script>

<style scoped>
ion-checkbox {
  margin-inline-end: 10px;
  margin-inline-start: 10px;
}
.ios > ion-checkbox {
  margin-top: 10px;
}
ion-textarea {
  margin: 5px;
}
ion-buttons {
  margin-right: 0;
}
ion-thumbnail {
  cursor: pointer;
}
ion-card {
  height: 100%;
  margin-top: 0;
}
.expanded-image {
  margin-top: auto;
  align-self: center;
  margin-bottom: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>
