<template>
  <ion-toolbar id="address-toolbar">
    <ion-buttons slot="start">
      <ion-button :disabled="state.location.coordinates ? false : true">
        <ion-icon
          :icon="navigateOutline"
          :color="state.location.coordinates ? 'primary' : 'grey'"
        ></ion-icon>
      </ion-button>
    </ion-buttons>
    <ion-item>
      <ion-label position="stacked">Address </ion-label>

      <ion-input
        type="text"
        id="autocomplete"
        placeholder="Enter address"
        ref="autocompleteInput"
        :value="state.location.address"
        :debounce="store.DEBOUNCE_AMOUNT"
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
  IonToolbar,
  IonCard,
  IonItem,
  IonInput,
  IonIcon,
  IonLabel,
  IonButtons,
} from "@ionic/vue";

import { reactive } from "@vue/reactivity";
import { onMounted, ref, watch } from "vue";
import { navigateOutline } from "ionicons/icons";

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
      store,
      state,
      autocompleteInput,
      onInput,
      navigateOutline,
    };
  },
};
</script>

<style scoped></style>
