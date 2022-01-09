<template>
  <ion-split-pane content-id="main" when="md">
    <ion-content color="dark">
      <ion-list style="padding: 0;">
        <ion-item
          color="dark"
          class="menu-item"
          button
          v-for="section in sections"
          :key="section.id"
          @click="selectedSection = section.id"
        >
          <ion-label color="light">{{ section.name }}</ion-label>
          <ion-icon color="light" :icon="section.icon"></ion-icon>
        </ion-item>
      </ion-list>
    </ion-content>

    <ion-content id="main">
      <ion-item v-if="title" color="primary">
        {{ title }}
      </ion-item>
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
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonSplitPane,
} from "@ionic/vue";
import { ref } from "vue";

export default {
  name: "Sections",
  props: {
    sections: Array,
    title: String,
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
  --border: none;
}

ion-item {
  border-bottom: 1px solid rgb(134, 134, 134);
}

.ios ion-split-pane {
  margin-top: 44px;
}

.ios .large-header > ion-split-pane {
  margin-top: 64px;
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
