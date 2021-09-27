<template>
  <form>
    <ion-list>
      <ion-list-header>
        <h5>Contact</h5>
      </ion-list-header>
      <ion-grid>
        <ion-row class="ion-justify-content-around">
          <ion-col size="12" size-sm="6" size-lg="3">
            <ion-item>
              <ion-label position="stacked">
                <ion-icon :icon="icons.mailOutline"></ion-icon>
                <span style="padding: 5px;">Email</span>
              </ion-label>
              <ion-input
                type="email"
                disabled
                placeholder="email"
                v-model="state.customer.email"
              ></ion-input>
            </ion-item>
          </ion-col>
          <ion-col size="12" size-sm="6" size-lg="3">
            <ion-item>
              <ion-label position="stacked">
                <ion-icon :icon="icons.callOutline"></ion-icon>
                <span style="padding: 5px;">Phone</span>
              </ion-label>
              <ion-input
                type="tel"
                inputmode="tel"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                placeholder="123-123-1234"
                v-model="state.customer.phone"
              ></ion-input>
            </ion-item>
          </ion-col>
          <ion-col size="12" size-sm="12" size-lg="6">
            <Address v-model="state.customer.location" />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-list>
    <ion-list>
      <ion-list-header>
        <h5>Notes</h5>
      </ion-list-header>
      <ion-grid>
        <ion-row class="ion-justify-content-around">
          <ion-col size="12" size-lg="6">
            <ion-item>
              <ion-label position="stacked">Customer Notes</ion-label>
              <ion-textarea
                v-if="state.showTextAreas"
                auto-grow
                placeholder="Notes on customer"
                v-model="state.customer.customerNotes"
              ></ion-textarea>
            </ion-item>
          </ion-col>
          <ion-col size="12" size-lg="6">
            <ion-item>
              <ion-label position="stacked">Property Notes</ion-label>
              <ion-textarea
                v-if="state.showTextAreas"
                auto-grow
                placeholder="Notes on property"
                v-model="state.customer.propertyNotes"
              ></ion-textarea>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-list>
    <ion-list>
      <ion-list-header>
        <h5>
          Property Images
        </h5>

        <AddButton @click="addImage" />
      </ion-list-header>
      <ion-grid>
        <ion-row class="ion-justify-content-left">
          <ImageWithCaption
            v-for="(image, index) in state.customer.propertyImages"
            :key="image.ref"
            :modelValue="image"
            :showCaption="true"
            @deleteImage="deleteImage(index)"
          />
        </ion-row>
      </ion-grid>
    </ion-list>
  </form>
</template>

<script lang="ts">
import {
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonTextarea,
  IonIcon,
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

import { mailOutline, callOutline } from "ionicons/icons";
import { emptyImage } from "@/types/auxiliary";

import AddButton from "@/components/buttons/AddButton.vue";
import Address from "@/components/Address.vue";
import ImageWithCaption from "@/components/ImageWithCaption.vue";

export default {
  name: "Customer Form",
  props: {
    modelValue: Object,
  },
  emits: ["update:modelValue"],
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      customer: props.modelValue,
      showTextAreas: false,
    });

    watch(state.customer, (newCustomer) =>
      emit("update:modelValue", newCustomer)
    );

    setTimeout(() => (state.showTextAreas = true), 250);

    const addImage = () => {
      state.customer.propertyImages.unshift(emptyImage(Date.now()));
    };

    const deleteImage = (index: number) => {
      state.customer.propertyImages.splice(index, 1);
    };

    return {
      state,
      addImage,
      deleteImage,
      icons: {
        mailOutline,
        callOutline,
      },
    };
  },
  components: {
    IonList,
    IonListHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonTextarea,
    IonIcon,
    Address,
    ImageWithCaption,
    AddButton,
  },
};
</script>

<style scoped>
.address-input-item {
  width: 100%;
}
#suggestions-card {
  width: calc(100% - 120px);
  margin-top: 0;
}
</style>
