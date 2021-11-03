<template>
  <ion-segment
    @ionChange="selectedSection = $event.detail.value"
    :value="selectedSection"
    color="tertiary"
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

  <div :class="separateByDefault ? '' : 'ion-hide-md-up'">
    <VisitMain
      v-if="selectedSection == 'main'"
      v-model="state.visit"
      :hideJob="hideJob"
      :hideCustomerSelect="hideCustomerSelect"
      :hideEmployeeSelect="hideEmployeeSelect"
    />
    <Tasks
      v-else-if="selectedSection == 'tasks'"
      v-model="state.visit.data.tasks"
    />
    <Tools
      v-else-if="selectedSection == 'tools'"
      v-model="state.visit.data.tools"
    />
    <Images
      v-else-if="selectedSection == 'images'"
      v-model="state.visit.data.images"
    />
  </div>

  <ion-grid :class="separateByDefault ? 'ion-hide' : 'ion-hide-md-down'">
    <ion-row class="ion-justify-content-around">
      <ion-col size="12" size-md="6">
        <ion-card>
          <ion-card-header>
            <ion-card-title>INFO</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <VisitMain
              v-model="state.visit"
              :hideJob="hideJob"
              :hideCustomerSelect="hideCustomerSelect"
              :hideEmployeeSelect="hideEmployeeSelect"
            />
          </ion-card-content>
        </ion-card>
      </ion-col>
      <ion-col size="12" size-md="6">
        <ion-row>
          <ion-col style="padding: 0 !important;">
            <ion-card>
              <ion-card-header>
                <ion-card-title>TASKS</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <Tasks v-model="state.visit.data.tasks" />
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col style="padding: 0 !important;">
            <ion-card>
              <ion-card-header>
                <ion-card-title>TOOLS</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <Tools v-model="state.visit.data.tools" />
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-col>

      <ion-col size="12">
        <ion-card>
          <ion-card-header>
            <ion-card-title>
              IMAGES
              <AddButton @click="addImage" mode="dark" />
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <Images v-model="state.visit.data.images" />
          </ion-card-content>
        </ion-card>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts">
import { reactive, ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

import {
  IonGrid,
  IonRow,
  IonCol,
  IonSegment,
  IonSegmentButton,
  IonCard,
  IonIcon,
  IonLabel,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/vue";

import {
  documentTextOutline,
  constructOutline,
  hammerOutline,
  calendarOutline,
  calendarNumberOutline,
  imagesOutline,
} from "ionicons/icons";

import { SectionsType } from "@/types/auxiliary";

import VisitMain from "@/components/forms/VisitMain.vue";
import Tasks from "@/components/lists/Tasks.vue";
import Tools from "@/components/lists/Tools.vue";
import Images from "@/components/lists/Images.vue";
import AddButton from "../buttons/AddButton.vue";

export default {
  name: "VisitView",
  props: {
    modelValue: Object,
    hideJob: Boolean,
    hideEmployeeSelect: Boolean,
    hideCustomerSelect: Boolean,
    separateByDefault: Boolean,
  },
  emits: ["update:modelValue"],
  setup(props: any) {
    const sections = ref<SectionsType>([
      {
        // Includes date, employee, customer, notes, & messaging
        name: "Main",
        icon: documentTextOutline,
        id: "main",
      },
      {
        name: "Tasks",
        icon: constructOutline,
        id: "tasks",
      },
      {
        name: "Tools",
        icon: hammerOutline,
        id: "tools",
      },
      {
        name: "Images",
        icon: imagesOutline,
        id: "images",
      },
    ]);

    const state = reactive({
      visit: props.modelValue,
      enableSave: true,
    });

    const addImage = () => {
      state.visit.data.images.unshift({
        ref: "",
        caption: "",
      });
    };

    const selectedSection = ref<string>(sections.value[0].id);

    // AUTO-SAVING FUNCTIONALITY
    watch(state.visit.data, () => state.visit.save());

    return {
      sections,
      state,
      selectedSection,
      addImage,
      icons: {
        calendarOutline,
        calendarNumberOutline,
        hammerOutline,
        constructOutline,
        imagesOutline,
      },
    };
  },
  components: {
    VisitMain,
    Tasks,
    Tools,
    Images,
    IonGrid,
    IonRow,
    IonCol,
    IonSegment,
    IonSegmentButton,
    IonCard,
    IonIcon,
    IonLabel,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    AddButton,
  },
};
</script>

<style scoped>
ion-title {
  padding-left: 5px;
}
ion-segment {
  --background: white;
}
</style>
