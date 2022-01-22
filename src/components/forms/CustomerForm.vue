<template>
  <form>
    <ion-grid>
      <ion-row class="ion-justify-content-around">
        <ion-col size="12" size-md="6">
          <ion-card>
            <ion-card-header>
              <ion-card-title>CONTACT</ion-card-title>
              <ion-card-subtitle>{{
                state.customer.data.name
              }}</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <ion-list>
                <ion-item color="white">
                  <ion-label position="stacked">
                    <ion-icon :icon="icons.mailOutline"></ion-icon>
                    <span style="padding: 5px;">Email</span>
                  </ion-label>
                  <ion-input
                    type="email"
                    placeholder="email"
                    :debounce="config.constants.DEBOUNCE_AMOUNT"
                    v-model="state.customer.data.email"
                    @ionInput="$emit('update:modelValue', state.customer)"
                  ></ion-input>
                </ion-item>
                <ion-item color="white">
                  <ion-label position="stacked">
                    <ion-icon :icon="icons.callOutline"></ion-icon>
                    <span style="padding: 5px;">Phone</span>
                  </ion-label>
                  <ion-input
                    type="tel"
                    inputmode="tel"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    placeholder="123-123-1234"
                    :debounce="config.constants.DEBOUNCE_AMOUNT"
                    @ionInput="$emit('update:modelValue', state.customer)"
                    v-model="state.customer.data.phone"
                  ></ion-input>
                </ion-item>
                <Address
                  @update:modelValue="
                    $emit('update:modelValue', state.customer)
                  "
                  v-model="state.customer.data.location"
                />
              </ion-list>
            </ion-card-content>
          </ion-card>
        </ion-col>
        <ion-col size="12" size-md="6">
          <ion-card>
            <ion-card-header>
              <ion-card-title>NOTES</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-list>
                <ion-item color="white">
                  <ion-label position="stacked">Customer Notes</ion-label>
                  <ion-textarea
                    v-if="state.showTextAreas"
                    auto-grow
                    placeholder="Notes on customer"
                    :debounce="config.constants.DEBOUNCE_AMOUNT"
                    @ionInput="$emit('update:modelValue', state.customer)"
                    v-model="state.customer.data.customerNotes"
                  ></ion-textarea>
                </ion-item>
                <ion-item color="white">
                  <ion-label position="stacked">Property Notes</ion-label>
                  <ion-textarea
                    v-if="state.showTextAreas"
                    auto-grow
                    placeholder="Notes on property"
                    :debounce="config.constants.DEBOUNCE_AMOUNT"
                    @ionInput="$emit('update:modelValue', state.customer)"
                    v-model="state.customer.data.propertyNotes"
                  ></ion-textarea>
                </ion-item>
              </ion-list>
            </ion-card-content>
          </ion-card>
        </ion-col>
        <ion-col size="12">
          <ion-card>
            <ion-card-header style="padding-bottom: 0;">
              <ion-card-title
                >PROPERTY IMAGES
                <AddButton @click="addImage" mode="dark" />
              </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <Images
                v-model="state.customer.data.propertyImages"
                @update:modelValue="$emit('update:modelValue', state.customer)"
              />
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-grid>
  </form>
</template>

<script lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonTextarea,
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import { callOutline, mailOutline } from "ionicons/icons";

import Address from "@/components/Address.vue";
import AddButton from "@/components/buttons/AddButton.vue";
import config from "@/config/config";
import { showTextAreas } from "@/helpers";
import store from "@/store";
import { newImage } from "@/types/auxiliary";

import Images from "../lists/Images.vue";

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

    showTextAreas(state);

    const addImage = () => {
      state.customer.data.propertyImages.unshift(newImage());
      emit("update:modelValue", state.customer);
    };

    const deleteImage = (index: number) => {
      state.customer.data.propertyImages.splice(index, 1);
      emit("update:modelValue", state.customer);
    };

    return {
      store,
      state,
      addImage,
      deleteImage,
      icons: {
        mailOutline,
        callOutline,
      },
      config,
    };
  },
  components: {
    IonInput,
    IonItem,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonTextarea,
    IonIcon,
    Address,
    AddButton,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCardSubtitle,
    IonList,
    Images,
  },
};
</script>

<style scoped>
.address-input-item {
  width: 100%;
}
</style>
