<template>
  <!-- TEMPORARY: Reload split pane upon route changes... -->
  <ion-split-pane content-id="main" when="md">
    <!-- Create a custom menu instead -->
    <ion-content color="light">
      <ion-list>
        <ion-item
          color="light"
          class="menu-item"
          button
          v-for="section in sections"
          :key="section.id"
          @click="selectedSection = section.id"
        >
          <ion-label>{{ section.name }}</ion-label>
          <ion-icon :icon="section.icon"></ion-icon>
        </ion-item>
      </ion-list>
    </ion-content>

    <ion-content id="main">
      <!-- Place whatever you need in here -->
      <ion-segment
        @ionChange="selectedSection = $event.detail.value"
        :value="selectedSection"
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
      <div class="main-content">
        <slot :name="selectedSection"></slot>
      </div>
    </ion-content>
  </ion-split-pane>
</template>

<script lang="ts">
import { ref } from "vue";

import {
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonLabel,
  IonSplitPane,
  IonItem,
  IonContent,
  IonList,
} from "@ionic/vue";

export default {
  name: "Sections",
  props: {
    sections: Array,
  },
  setup(props: any) {
    const selectedSection = ref<string>(props.sections[0].id);

    return { selectedSection };
  },
  components: {
    IonSegment,
    IonSegmentButton,
    IonIcon,
    IonLabel,
    IonSplitPane,
    IonItem,
    IonContent,
    IonList,
  },
};
</script>

<style scoped>
ion-split-pane {
  margin-top: 56px;
  --side-width: 180px;
  --side-min-width: 180px;
  --side-max-width: 180px;
}

.ios ion-split-pane {
  margin-top: 64px !important;
}

@media (min-width: 768px) {
  ion-segment {
    display: none;
  }
}

ion-label {
  margin-bottom: 2px !important;
}

ion-list ion-item {
  --min-height: 80px;
  font-weight: 500;
  font-size: 21px;
}

.main-content {
  height: 100%;
}
</style>
