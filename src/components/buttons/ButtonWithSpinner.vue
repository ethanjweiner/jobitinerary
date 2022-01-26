<template>
  <ion-button>
    <slot></slot>
    <span class="ion-margin">{{ title }}</span>
    <ion-spinner v-if="loading"></ion-spinner>
  </ion-button>
</template>

<script lang="ts">
import { IonButton, IonSpinner } from "@ionic/vue";

export default {
  name: "Button With Spinner",
  props: {
    loading: Boolean,
    title: String,
  },
  components: {
    IonButton,
    IonSpinner,
  },
};
</script>

<style></style>
