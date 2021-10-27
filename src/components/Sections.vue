<template>
  <!-- Sections segment -->

  <ion-split-pane content-id="main" when="md" :class="cssClass">
    <ion-menu content-id="main" ref="menu" menu-id="first">
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

    <ion-content id="main">
      <!-- Place whatever you need in here -->
      <ion-segment
        slot="fixed"
        @ionChange="selectedSection = $event.detail.value"
        :value="selectedSection"
        color="secondary"
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
      <slot :name="selectedSection" class="main-content"></slot>
    </ion-content>
  </ion-split-pane>
</template>

<script lang="ts">
import { onMounted, ref } from "vue";

import {
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonLabel,
  IonSplitPane,
  IonItem,
  IonContent,
  IonMenu,
  menuController,
} from "@ionic/vue";

export default {
  name: "Sections",
  props: {
    sections: Array,
    cssClass: String,
  },
  setup(props: AsyncIterator) {
    const selectedSection = ref<string>(props.sections[0].id);

    const screenWidth = ref(0);

    onMounted(async () => {
      screenWidth.value = window.innerWidth;
      window.addEventListener("resize", () => {
        screenWidth.value = window.innerWidth;
      });
      menuController.enable(true, "first");
      const open = await menuController.isOpen("first");
      console.log(open);
    });

    return { selectedSection, screenWidth };
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
  margin-top: 57px;
  --side-width: 180px;
  --side-min-width: 180px;
  --side-max-width: 180px;
}

@media (min-width: 768px) {
  ion-segment {
    display: none;
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
