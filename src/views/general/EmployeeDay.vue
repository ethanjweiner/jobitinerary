<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title> {{ username }} on {{ date }} </ion-title>
        <ion-buttons :collapse="true" slot="end">
          <ion-button @click="toggleDaySettings(true, $event)">
            <ion-icon :icon="icons.ellipsisVertical"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-popover
      :is-open="popoverIsOpen"
      :translucent="true"
      :event="popoverEvent"
      @didDismiss="toggleDaySettings(false)"
    >
      <DayPopover
        @deleteDay="deleteDay"
        @changeDate="changeDate"
        @copyDay="copyDay"
      />
      <!-- Add Day Popover here -->
    </ion-popover>

    <ion-content :fullscreen="true">
      <form>
        <Sections :sections="sections" wrapCards>
          <template v-slot:main>
            <DayMain v-model="state.day" />
          </template>
          <template v-slot:visits>
            <DayVisits :date="state.day.date" @openVisit="openVisitModal" />
          </template>
          <template v-slot:expenses>
            <Expenses />
          </template>
          <template v-slot:sectionsAsGrid>
            <ion-row>
              <ion-col size="6">
                <ion-row>
                  <ion-card style="width: 100%;">
                    <DayMain v-model="state.day" />
                  </ion-card>
                </ion-row>
                <ion-row>
                  <ion-card style="width: 100%;">
                    <ion-card-header class="ion-text-center">
                      <ion-card-title>
                        <ion-icon :icon="icons.pricetagsOutline"></ion-icon>
                        Expenses
                      </ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                      <Expenses />
                    </ion-card-content>
                  </ion-card>
                </ion-row>
              </ion-col>
              <ion-col size="6">
                <ion-card>
                  <ion-card-header class="ion-text-center">
                    <ion-card-title>
                      <ion-icon :icon="icons.homeOutline"></ion-icon>
                      Visits
                    </ion-card-title>
                  </ion-card-header>
                  <ion-card-content>
                    <DayVisits
                      :date="state.day.date"
                      @openVisit="openVisitModal"
                    />
                  </ion-card-content>
                </ion-card>
              </ion-col>
            </ion-row>
          </template>
        </Sections>
      </form>

      <ion-modal
        v-if="visitModalIsOpen"
        :is-open="visitModalIsOpen"
        @didDismiss="visitModalIsOpen = false"
      >
        <VisitModal
          :visitID="state.selectedVisitID"
          :isModal="true"
          @close="visitModalIsOpen = false"
        />
      </ion-modal>
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
  IonIcon,
  IonButtons,
  IonModal,
  IonPopover,
  IonButton,
  IonCard,
  IonCol,
  IonRow,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBackButton,
} from "@ionic/vue";
import { ref } from "vue";
import { reactive } from "@vue/reactivity";

import store from "@/store";
import router from "@/router";

import { Day, sampleDay } from "@/types/work_units";
import { SectionsType } from "@/types/auxiliary";

import Sections from "@/components/Sections.vue";
import DayMain from "@/components/forms/DayMain.vue";
import DayVisits from "@/components/lists/DayVisits.vue";
import Expenses from "@/components/lists/Expenses.vue";
import VisitModal from "@/components/modals/VisitModal.vue";

import {
  pricetagsOutline,
  documentTextOutline,
  ellipsisVertical,
  homeOutline,
} from "ionicons/icons";
import DayPopover from "@/components/popovers/DayPopover.vue";

interface State {
  day: Day;
  selectedVisitID: string;
}
export default {
  name: "Employee Day",
  props: {
    username: String,
    date: String,
  },
  setup() {
    const sections = ref<SectionsType>([
      {
        name: "Main",
        icon: documentTextOutline,
        id: "main",
      },
      {
        name: "Visits",
        icon: homeOutline,
        id: "visits",
      },
      {
        name: "Expenses",
        icon: pricetagsOutline,
        id: "expenses",
      },
    ]);

    const state = reactive<State>({
      day: sampleDay, // Use the default hourly rate
      selectedVisitID: "",
    });

    const popoverIsOpen = ref(false);
    const popoverEvent = ref();
    const toggleDaySettings = (state: boolean, ev?: Event) => {
      popoverEvent.value = ev;
      popoverIsOpen.value = state;
    };

    const updateDay = (newDay: Day) => {
      console.log(newDay);
      state.day = newDay;
    };

    const deleteDay = () => {
      popoverIsOpen.value = false;
      // Delete visit from database
      // Return to home
      router.go(-1);

      // Update the state
    };

    const changeDate = () => {
      console.log("Changing date");
    };

    const copyDay = () => {
      console.log("Copying day");
    };

    const visitModalIsOpen = ref(false);

    const openVisitModal = (visitID: string) => {
      console.log("opening visit modal");
      visitModalIsOpen.value = true;
      state.selectedVisitID = visitID;
    };

    return {
      store,
      state,
      sections,
      router,
      icons: {
        documentTextOutline,
        homeOutline,
        pricetagsOutline,
        ellipsisVertical,
      },
      updateDay,
      toggleDaySettings,
      popoverIsOpen,
      popoverEvent,
      deleteDay,
      openVisitModal,
      visitModalIsOpen,
      changeDate,
      copyDay,
    };
  },
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    Sections,
    IonIcon,
    IonButtons,
    IonModal,
    IonPopover,
    IonButton,
    DayMain,
    DayVisits,
    Expenses,
    IonCard,
    IonCol,
    IonRow,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBackButton,
    VisitModal,
    DayPopover,
  },
};
</script>

<style>
ion-title {
  padding-left: 10px;
}
</style>
