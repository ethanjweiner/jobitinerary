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
    <div
      v-for="section in sections"
      :key="section.id"
      class="section-container"
      :class="[
        section.id !== selectedSection
          ? 'ion-hide-md-down ' + section.id
          : section.id,
      ]"
    >
      <slot :name="section.id"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";

import { IonSegment, IonSegmentButton, IonIcon, IonLabel } from "@ionic/vue";

export default {
  name: "Sections",
  props: {
    sections: Array,
  },
  setup(props: any) {
    const selectedSection = ref<string>(props.sections[0].id);

    const changeSection = (e: CustomEvent) => {
      selectedSection.value = e.detail.value;
    };

    return { changeSection, selectedSection };
  },
  components: {
    IonSegment,
    IonSegmentButton,
    IonIcon,
    IonLabel,
  },
};
</script>

<style scoped>
.section-container {
  display: inline-block;
  width: 100%;
}
@media (min-width: 768px) {
  .dates {
    width: 50%;
  }
  .jobs {
    width: 50%;
  }
}
</style>
