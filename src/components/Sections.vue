<template>
  <div>
    <!-- Sections segment -->
    <ion-segment
      @ionChange="changeSection($event)"
      :value="sections[0].id"
      :class="separateByDefault ? '' : 'ion-hide-md-up'"
    >
      <ion-segment-button
        v-for="section in sections"
        :value="section.id"
        :key="section.id"
      >
        <ion-icon :icon="section.icon"></ion-icon>
        <ion-label>{{ section.name }}</ion-label>
      </ion-segment-button>
    </ion-segment>
    <!-- Sections -->
    <div v-if="screenWidth < 768 || separateByDefault">
      <div v-for="section in sections" :key="section.id" :class="section.id">
        <slot :name="section.id" v-if="section.id == selectedSection"></slot>
      </div>
    </div>

    <ion-grid v-else>
      <slot name="sectionsAsGrid" />
    </ion-grid>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from "vue";

import {
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonLabel,
  IonGrid,
} from "@ionic/vue";

export default {
  name: "Sections",
  props: {
    sections: Array,
    wrapCards: Boolean,
    separateByDefault: Boolean,
  },
  setup(props: any) {
    const selectedSection = ref<string>(props.sections[0].id);

    const changeSection = (e: CustomEvent) => {
      selectedSection.value = e.detail.value;
    };

    const screenWidth = ref(0);

    onMounted(() => {
      screenWidth.value = window.innerWidth;
      window.addEventListener("resize", () => {
        screenWidth.value = window.innerWidth;
      });
    });

    return { changeSection, selectedSection, screenWidth };
  },
  components: {
    IonSegment,
    IonSegmentButton,
    IonIcon,
    IonLabel,
    IonGrid,
  },
};
</script>

<style scoped>
.section-container {
  display: inline-block;
}
ion-label {
  margin-bottom: 2px !important;
}
</style>
