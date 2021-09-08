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
          :value="location.address"
          @input="onInput"
        ></ion-input>
      </ion-item>

      <ion-buttons slot="end">
        <ion-button v-if="location.coordinates">
          <ion-icon :icon="navigateOutline" color="grey"></ion-icon>
          <span style="padding-left: 5px;">Directions</span>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
    <ion-card id="suggestions-card">
      <ion-item v-for="(suggestion, index) in suggestions" :key="index">{{
        suggestion
      }}</ion-item>
    </ion-card>
  </ion-list>
</template>

<script lang="ts">
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

import { reactive, toRefs } from "@vue/reactivity";
import { onMounted, ref } from "vue";
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
  props: ["value"],
  setup(props) {
    const state = reactive({
      location: {
        address: props.value.address,
        coordinates: props.value.coordinates,
      },
      suggestions: [],
      autocomplete: null,
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
        console.log(state.location);
      });
    });

    const onInput = (e) => {
      if (!e.detail.value) {
        state.location.coordinates = null;
      }
    };

    return {
      ...toRefs(state),
      autocompleteInput,
      onInput,
      navigateOutline,
    };
  },
};
</script>

<style></style>
