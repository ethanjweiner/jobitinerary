<template>
  <ion-list class="address-input-item">
    <ion-list-header>Address</ion-list-header>
    <ion-toolbar id="address-toolbar">
      <ion-item>
        <ion-input
          type="text"
          id="autocomplete"
          placeholder="Enter address"
          ref="autocompleteInput"
          :value="state.location.address"
          @input="onInput"
        ></ion-input>
      </ion-item>

      <ion-buttons slot="end">
        <ion-button v-if="state.location.coordinates">
          <ion-icon :icon="navigateOutline" color="grey"></ion-icon>
          <span style="padding-left: 5px;">Directions</span>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
    <ion-card id="suggestions-card">
      <ion-item v-for="(suggestion, index) in state.suggestions" :key="index">{{
        suggestion
      }}</ion-item>
    </ion-card>
  </ion-list>
</template>

<script>
import {
  IonButton,
  IonToolbar,
  IonCard,
  IonButtons,
  IonItem,
  IonList,
  IonListHeader,
  IonInput,
  IonIcon,
} from "@ionic/vue";

import { reactive } from "@vue/reactivity";
import { onMounted, ref, watch } from "vue";
import { navigateOutline } from "ionicons/icons";

export default {
  name: "Address",
  components: {
    IonButton,
    IonToolbar,
    IonCard,
    IonButtons,
    IonItem,
    IonList,
    IonListHeader,
    IonInput,
    IonIcon,
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

    watch(state.location, (newLocation) =>
      emit("update:modelValue", newLocation)
    );

    const autocompleteInput = ref();

    onMounted(async () => {
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
    });

    const onInput = (e) => {
      if (!e.detail.value) {
        state.location.coordinates = null;
      }
    };

    return {
      state,
      autocompleteInput,
      onInput,
      navigateOutline,
    };
  },
};
</script>

<style></style>
