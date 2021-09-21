<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title style="padding-inline-end: 5px;"
          >Visit<span v-if="state.visit.date"> on </span
          >{{ state.visit.date }}</ion-title
        >

        <div style="padding-left: 20px;">
          <ion-note v-if="state.visit.customerName"
            >for {{ state.visit.customerName }} |
          </ion-note>
          <ion-note v-if="state.visit.employeeName"
            >by {{ state.visit.employeeName }}</ion-note
          >
        </div>
        <ion-buttons :collapse="true" slot="end">
          <ion-button
            v-if="!isModal"
            @click="toggleVisitSettings(true, $event)"
          >
            <ion-icon :icon="ellipsisVertical"></ion-icon>
          </ion-button>
          <ion-button v-else @click="$emit('close')">
            Return to Day
            <ion-icon :icon="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-popover
      :is-open="popoverIsOpen"
      :translucent="true"
      :event="popoverEvent"
      @didDismiss="toggleVisitSettings(false)"
    >
      <DeletePopover unitName="Visit" @delete="deleteVisit" />
    </ion-popover>
    <ion-content :fullscreen="true">
      <form>
        <Sections :sections="sections" :separateByDefault="isModal" wrapCards>
          <template v-slot:main>
            <VisitMain
              v-model="state.visit"
              :hideJob="hideJob"
              :hideEmployeeSelect="visitID == 'new'"
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
                    <VisitMain v-model="state.visit" :hideJob="hideJob" />
                  </ion-card>
                </ion-row>

                <ion-row>
                  <ion-card style="width: 100%;">
                    <ion-card-header
                      class="ion-text-center"
                      style="padding-bottom: 2px;"
                    >
                      <ion-card-title>
                        <ion-icon :icon="imagesOutline"></ion-icon>
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
                      <ion-icon :icon="constructOutline"></ion-icon>
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
                      <ion-icon :icon="hammerOutline"></ion-icon>
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
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonNote,
  IonIcon,
  IonButtons,
  IonPopover,
  IonButton,
  IonCard,
  IonCol,
  IonRow,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
  IonBackButton,
} from "@ionic/vue";

import Sections from "@/components/Sections.vue";

import { sampleVisit1, SectionsType, Visit, emptyVisit } from "@/types";
import { reactive, ref } from "@vue/reactivity";
import {
  documentTextOutline,
  constructOutline,
  hammerOutline,
  calendarOutline,
  calendarNumberOutline,
  ellipsisVertical,
  imagesOutline,
  close,
} from "ionicons/icons";
import store from "@/store";
import DeletePopover from "@/components/popovers/DeletePopover.vue";
import VisitMain from "@/components/forms/VisitMain.vue";
import Tasks from "@/components/lists/Tasks.vue";
import Tools from "@/components/lists/Tools.vue";
import Images from "@/components/lists/Images.vue";
import router from "@/router";
import { watch } from "@vue/runtime-core";

export default {
  name: "VisitView",
  props: {
    visitID: String,
    isModal: Boolean,
    modelValue: Object,
    hideJob: Boolean,
  },
  emits: ["close", "update:modelValue"],
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
      visit: emptyVisit(),
    });

    if (props.visitID) {
      // RETRIEVE VISIT UPON LOAD
      state.visit = sampleVisit1;
    } else {
      console.log(props.modelValue);
      state.visit = { ...props.modelValue };
      watch(state.visit, (newVisit) => emit("update:modelValue", newVisit));
    }

    // Popover
    const popoverIsOpen = ref(false);
    const popoverEvent = ref();
    const toggleVisitSettings = (state: boolean, ev?: Event) => {
      popoverEvent.value = ev;
      popoverIsOpen.value = state;
    };

    const updateVisit = (newVisit: Visit) => {
      state.visit = newVisit;
    };

    const deleteVisit = () => {
      // DELETE VISIT FROM DATABASE

      // Return to home
      router.go(-1);
    };

    return {
      sections,
      store,
      state,
      updateVisit,
      toggleVisitSettings,
      deleteVisit,
      calendarOutline,
      calendarNumberOutline,
      ellipsisVertical,
      popoverIsOpen,
      popoverEvent,
      hammerOutline,
      constructOutline,
      imagesOutline,
      close,
    };
  },
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    Sections,
    IonNote,
    IonIcon,
    IonButtons,
    IonPopover,
    IonButton,
    DeletePopover,
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
    IonBackButton,
  },
};
</script>

<style scoped>
ion-title {
  padding-left: 5px;
}
</style>
