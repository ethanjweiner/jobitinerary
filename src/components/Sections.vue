<template>
  <ion-header>
    <ion-toolbar color="primary">
      <ion-title>
        {{ title }}
      </ion-title>
    </ion-toolbar>
    <!-- Sections segment -->
    <ion-toolbar color="primary" class="ion-hide-md-up" id="segment-toolbar">
      <ion-segment @ionChange="changeSection($event)" :value="sections[0].id">
        <ion-segment-button
          v-for="section in sections"
          :value="section.id"
          :key="section.id"
        >
          <ion-icon :icon="section.icon"></ion-icon>
          <ion-label>{{ section.name }}</ion-label>
        </ion-segment-button>
      </ion-segment>
    </ion-toolbar>
  </ion-header>
  <!-- Sections -->
  <ion-content>
    <div
      v-for="section in sections"
      :key="section.id"
      :class="[section.id !== selectedSection ? 'ion-hide-md-down' : '']"
    >
      <slot :name="section.id"></slot>
    </div>
  </ion-content>
</template>

<script lang="ts">
import { ref } from "vue";

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonContent,
  IonLabel,
} from "@ionic/vue";

export default {
  name: "Sections",
  props: {
    sections: Array,
    title: String,
  },
  setup(props: any) {
    const selectedSection = ref<string>(props.sections[0].id);

    const changeSection = (e: CustomEvent) => {
      selectedSection.value = e.detail.value;
    };

    return { changeSection, selectedSection };
  },
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonSegment,
    IonSegmentButton,
    IonIcon,
    IonContent,
    IonLabel,
  },
};
</script>

<style>
.md #segment-toolbar {
  border-top: 1px solid white;
}
</style>
