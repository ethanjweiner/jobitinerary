<template>
  <form>
    <Sections
      :sections="sections"
      :separateByDefault="separateByDefault"
      wrapCards
    >
      <template v-slot:main>
        <VisitMain
          v-model="state.visit"
          :hideJob="hideJob"
          :hideCustomerSelect="hideCustomerSelect"
          :hideEmployeeSelect="hideEmployeeSelect"
        />
      </template>
      <template v-slot:tasks>
        <Tasks v-model="state.visit.tasks" />
      </template>
      <template v-slot:tools>
        <Tools v-model="state.visit.tools" />
      </template>
      <template v-slot:images>
        <Images v-model="state.visit.images" />
      </template>
      <template v-slot:sectionsAsGrid>
        <ion-row>
          <ion-col size="6">
            <ion-row>
              <ion-card style="width: 100%;">
                <VisitMain
                  v-model="state.visit"
                  :hideJob="hideJob"
                  :hideCustomerSelect="hideCustomerSelect"
                  :hideEmployeeSelect="hideEmployeeSelect"
                />
              </ion-card>
            </ion-row>

            <ion-row>
              <ion-card style="width: 100%;">
                <ion-card-header
                  class="ion-text-center"
                  style="padding-bottom: 2px;"
                >
                  <ion-card-title>
                    <ion-icon :icon="icons.imagesOutline"></ion-icon>
                    Images
                  </ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  <Images v-model="state.visit.images" />
                </ion-card-content>
              </ion-card>
            </ion-row>
          </ion-col>
          <ion-col size="6">
            <ion-card>
              <ion-card-header class="ion-text-center">
                <ion-card-title>
                  <ion-icon :icon="icons.constructOutline"></ion-icon>
                  Tasks</ion-card-title
                >
              </ion-card-header>
              <ion-card-content>
                <Tasks v-model="state.visit.tasks" />
              </ion-card-content>
            </ion-card>

            <ion-card>
              <ion-card-header class="ion-text-center">
                <ion-card-title>
                  <ion-icon :icon="icons.hammerOutline"></ion-icon>
                  Tools</ion-card-title
                >
                <ion-card-subtitle
                  class="ion-text-start"
                  style="margin-top: 5px; margin-left: 15px;"
                  >Swipe right to mark a tool as returned</ion-card-subtitle
                >
              </ion-card-header>
              <ion-card-content>
                <Tools v-model="state.visit.tools" />
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </template>
    </Sections>
  </form>
</template>

<script lang="ts">
import {
  IonIcon,
  IonCard,
  IonCol,
  IonRow,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
} from "@ionic/vue";
import { reactive, ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

import {
  documentTextOutline,
  constructOutline,
  hammerOutline,
  calendarOutline,
  calendarNumberOutline,
  imagesOutline,
} from "ionicons/icons";

import { Visit } from "@/types/work_units";
import { SectionsType } from "@/types/auxiliary";

import Sections from "@/components/Sections.vue";
import VisitMain from "@/components/forms/VisitMain.vue";
import Tasks from "@/components/lists/Tasks.vue";
import Tools from "@/components/lists/Tools.vue";
import Images from "@/components/lists/Images.vue";

export default {
  name: "VisitView",
  props: {
    modelValue: Object,
    hideJob: Boolean,
    separateByDefault: Boolean,
    hideEmployeeSelect: Boolean,
    hideCustomerSelect: Boolean,
  },
  emits: ["update:modelValue"],
  setup(props: any, { emit }: { emit: any }) {
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
    });

    // AUTO-SAVING FUNCTIONALITY

    const saveVisit = (newVisit: Visit) => {
      // SAVE VISIT DIRECTLY TO DATABASE
    };

    watch(state.visit, (newVisit) => {
      emit("update:modelValue", newVisit); // Keep things in sync (if necessary)
      saveVisit(newVisit as Visit); // Autosave visit
    });

    // REPLACE THIS WITH A LISTENER TO THE CREATED VISITS DOCUMENT
    // UPDATE THE ASSOCIATED CUSTOMER DAY UPON THE PROPER CHANGES
    // UNSUBSCRIBE FROM THIS LISTENER UPON COMPLETION
    watch(
      ref(state.visit.customerName),
      (newCustomerName: string, oldCustomerName: string) => {
        if (state.visit.date) {
          // SAVE THE DATE UNDER THE NEW CUSTOMER
          // DELETE THE DATE FROIM THE OLD CUSTOMER
        }
      }
    );

    watch(ref(state.visit.date), (newDate: string, oldDate: string) => {
      if (state.visit.customerName) {
        // SAVE THE DATE UNDER THE NEW CUSTOMER
        // DELETE THE DATE FROM THE OLD CUSTOMER
      }
    });

    return {
      sections,
      state,
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
    Sections,
    IonIcon,
    VisitMain,
    IonCard,
    IonCol,
    IonRow,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    Tasks,
    Tools,
    IonCardSubtitle,
    Images,
  },
};
</script>

<style scoped>
ion-title {
  padding-left: 5px;
}
</style>
