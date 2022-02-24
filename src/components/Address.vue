<template>
  <ion-toolbar id="address-toolbar" color="tertiary">
    <ion-buttons slot="start">
      <ion-button :disabled="modelValue.coordinates ? false : true">
        <ion-icon
          :icon="navigateOutline"
          :color="modelValue.coordinates ? 'light' : 'medium'"
        ></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-item color="light">
      <ion-label position="stacked">Address</ion-label>

      <ion-input
        type="text"
        id="autocomplete"
        placeholder="Enter address"
        ref="autocompleteInput"
        :value="modelValue.address"
        :debounce="config.constants.DEBOUNCE_AMOUNT"
        @input="onInput"
      ></ion-input>
    </ion-item>
  </ion-toolbar>
  <ion-card id="suggestions-card">
    <ion-item v-for="(suggestion, index) in state.suggestions" :key="index">{{
      suggestion
    }}</ion-item>
  </ion-card>
</template>

<script>
import {
  IonButton,
  IonButtons,
  IonCard,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonToolbar,
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import { navigateOutline } from "ionicons/icons";
import { onMounted, ref, watch } from "vue";

import config from "@/config/config";
import store from "@/store";

export default {
  name: "Address",
  components: {
    IonButton,
    IonToolbar,
    IonCard,
    IonItem,
    IonInput,
    IonIcon,
    IonLabel,
    IonButtons,
  },
  props: {
    modelValue: Object,
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const state = reactive({
      location: {
        address: props.modelValue.address,
        coordinates: props.modelValue.coordinates,
      },
      suggestions: [],
      autocomplete: null,
    });

    watch(state.location, (newLocation) => {
      emit("update:modelValue", newLocation);
    });

    const autocompleteInput = ref();

    onMounted(async () => {
      setTimeout(async () => {
        const input = await autocompleteInput.value.$el.getInputElement();
        state.autocomplete = new window.google.maps.places.Autocomplete(input, {
          types: ["address"],
          fields: ["formatted_address", "geometry"],
        });
        state.autocomplete.addListener("place_changed", () => {
          const place = state.autocomplete.getPlace();
          state.location.address = place.formatted_address;
          state.location.coordinates = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
        });
      }),
        0;
    });

    const onInput = (e) => {
      if (!e.detail.value) {
        state.location.coordinates = null;
      }
    };

    return {
      store,
      state,
      autocompleteInput,
      onInput,
      navigateOutline,
      config,
    };
  },
};
</script>

<style scoped>
#suggestions-card {
  width: calc(100% - 120px);
  margin-top: 0;
}
</style>
