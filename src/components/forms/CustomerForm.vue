<template>
  <form>
    <ion-list>
      <ion-list-header>Contact Info</ion-list-header>
      <ion-grid>
        <ion-row class="ion-justify-content-around">
          <ion-col size="12" size-sm="6">
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
          <ion-col size="12" size-sm="6">
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
        </ion-row>
      </ion-grid>
    </ion-list>
    <Address v-model="state.customer.location" />
    <ion-list>
      <ion-list-header>Notes</ion-list-header>
      <ion-grid>
        <ion-row class="ion-justify-content-around">
          <ion-col size="12" size-md="6">
            <ion-item>
              <ion-label position="stacked">Customer Notes</ion-label>
              <ion-textarea
                auto-grow
                placeholder="Notes on customer"
                v-model="state.customer.customerNotes"
              ></ion-textarea>
            </ion-item>
          </ion-col>
          <ion-col size="12" size-md="6">
            <ion-item>
              <ion-label position="stacked">Property Notes</ion-label>
              <ion-textarea
                auto-grow
                placeholder="Notes on property"
                :value="state.customer.propertyNotes"
              ></ion-textarea>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-list>
    <ion-list>
      <ion-list-header>
        <h4 style="margin; 0">
          Property Images
        </h4>

        <AddButton @click="addImage" />
      </ion-list-header>
      <ion-grid>
        <ion-row class="ion-justify-content-left">
          <ion-col
            v-for="(image, index) in state.customer.propertyImages"
            :key="image.ref"
            size-xs="12"
            size-sm="6"
            size-md="4"
            size-lg="3"
            size-xl="3"
          >
            <ImageWithCaption
              :modelValue="image"
              :showCaption="true"
              @deleteImage="state.customer.propertyImages.splice(index, 1)"
            />
          </ion-col>
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

import ImageWithCaption from "@/components/ImageWithCaption.vue";
import Address from "@/components/Address.vue";
import { mailOutline, callOutline } from "ionicons/icons";
import { reactive } from "@vue/reactivity";
import { emptyImage } from "@/types";
import AddButton from "@/components/buttons/AddButton.vue";

export default {
  name: "Customer Form",
  props: {
    modelValue: Object,
  },
  emits: ["update:modelValue"],
  setup(props: any) {
    const state = reactive({
      customer: props.modelValue,
    });

    const addImage = () => {
      state.customer.propertyImages.unshift(emptyImage(Date.now()));
    };

    return {
      state,
      addImage,
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
  max-width: 600px;
}
#suggestions-card {
  width: calc(100% - 120px);
  margin-top: 0;
}
</style>
