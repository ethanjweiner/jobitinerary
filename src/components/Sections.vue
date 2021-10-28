<template>
  <!-- TEMPORARY: Reload split pane upon route changes... -->
  <ion-split-pane
    :key="route.fullPath"
    :content-id="'main-' + sectionsID"
    when="md"
  >
    <ion-menu :content-id="'main-' + sectionsID">
      <ion-content>
        <ion-item
          class="menu-item"
          button
          v-for="section in sections"
          :key="section.id"
          @click="selectedSection = section.id"
        >
          <ion-label>{{ section.name }}</ion-label>
          <ion-icon :icon="section.icon"></ion-icon>
        </ion-item>
      </ion-content>
    </ion-menu>

    <ion-content :id="'main-' + sectionsID">
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
  IonMenu,
} from "@ionic/vue";
import { useRoute } from "vue-router";

export default {
  name: "Sections",
  props: {
    sections: Array,
    cssClass: String,
    sectionsID: String,
  },
  setup(props: any) {
    const selectedSection = ref<string>(props.sections[0].id);
    const route = useRoute();

    return { selectedSection, route };
  },
  components: {
    IonSegment,
    IonSegmentButton,
    IonIcon,
    IonLabel,
    IonSplitPane,
    IonItem,
    IonContent,
    IonMenu,
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
  ion-menu {
    display: block;
  }
}

ion-label {
  margin-bottom: 2px !important;
}

ion-menu ion-content,
ion-menu ion-item {
  --background: var(--ion-color-light);
}

ion-menu ion-item {
  --min-height: 80px;
}
</style>
