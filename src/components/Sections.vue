<template>
  <div>
    <!-- Sections segment -->
    <ion-segment
      @ionChange="changeSection($event)"
      :value="sections[0].id"
      class="ion-hide-md-up"
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
    <ion-grid>
      <ion-row>
        <ion-col
          v-for="section in sections"
          :key="section.id"
          :class="
            section.id != selectedSection
              ? 'ion-hide-md-down ' + section.id
              : section.id
          "
          size="12"
          :size-md="section.size"
        >
          <ion-card
            v-if="screenWidth > 768 && wrapCards"
            :class="section.id + '-card'"
            class="ion-margin"
          >
            <slot :name="section.id"></slot>
          </ion-card>
          <slot v-else :name="section.id"></slot>
        </ion-col>
      </ion-row>
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
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/vue";

export default {
  name: "Sections",
  props: {
    sections: Array,
    wrapCards: Boolean,
  },
  setup(props: any) {
    const selectedSection = ref<string>(props.sections[0].id);

    const changeSection = (e: CustomEvent) => {
      selectedSection.value = e.detail.value;
      console.log(selectedSection.value + e.detail.value);
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
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
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
