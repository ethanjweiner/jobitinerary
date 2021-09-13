<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-start">
          <span v-if="day && day.employeeName">
            {{ day.employeeName }} on
          </span>
          {{ day.date ? day.date : "New Day" }}
        </ion-title>
        <ion-buttons :collapse="true" slot="end">
          <ion-button @click="toggleDaySettings(true, $event)">
            <ion-icon :icon="ellipsisVertical"></ion-icon>
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
      <!-- Add Day Popover here -->
    </ion-popover>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button></ion-back-button>
          </ion-buttons>
          <ion-title class="ion-text-start" style="padding-left: 15px;">{{
            day.date
          }}</ion-title>
          <ion-buttons collapse="condense" slot="end">
            <ion-button @click="toggleDaySettings(true, $event)">
              <ion-icon :icon="ellipsisVertical"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <SendMessage @click="messageModalIsOpen = true" />
      <form>
        <Sections :sections="sections" wrapCards>
          <template v-slot:main>
            <DayMain :day="day" @dayChanged="updateDay" />
          </template>
          <template v-slot:visits>
            <DayVisits :date="day.date" @openVisit="openVisitModal" />
          </template>
          <template v-slot:expenses>
            <Expenses :date="day.date" />
          </template>
          <template v-slot:sectionsAsGrid>
            <ion-row>
              <ion-col size="6">
                <ion-row>
                  <ion-card style="width: 100%;">
                    <DayMain :day="day" @dayChanged="updateDay" />
                  </ion-card>
                </ion-row>
                <ion-row>
                  <ion-card style="width: 100%;">
                    <ion-card-header class="ion-text-center">
                      <ion-card-title>
                        <ion-icon :icon="pricetagsOutline"></ion-icon>
                        Expenses
                      </ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                      <Expenses :date="day.date" />
                    </ion-card-content>
                  </ion-card>
                </ion-row>
              </ion-col>
              <ion-col size="6">
                <ion-card>
                  <ion-card-header class="ion-text-center">
                    <ion-card-title>
                      <ion-icon :icon="homeOutline"></ion-icon>
                      Visits
                    </ion-card-title>
                  </ion-card-header>
                  <ion-card-content>
                    <DayVisits :date="day.date" @openVisit="openVisitModal" />
                  </ion-card-content>
                </ion-card>
              </ion-col>
            </ion-row>
          </template>
        </Sections>
      </form>
      <ion-modal
        :is-open="messageModalIsOpen"
        @didDismiss="messageModalIsOpen = false"
      >
        <MessageModal
          @messageSent="sendMessage"
          @closeModal="messageModalIsOpen = false"
        />
      </ion-modal>
      <ion-modal
        v-if="visitModalIsOpen"
        :is-open="visitModalIsOpen"
        @didDismiss="visitModalIsOpen = false"
      >
        <VisitModal
          :visitID="selectedVisitID"
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

import { Day, emptyDay, Message, SectionType } from "@/types";
import { reactive, toRefs } from "@vue/reactivity";

import Sections from "@/components/Sections.vue";
import SendMessage from "@/components/buttons/SendMessage.vue";
import MessageModal from "@/components/modals/MessageModal.vue";
import DayMain from "@/components/forms/DayMain.vue";
import DayVisits from "@/components/lists/DayVisits.vue";
import Expenses from "@/components/lists/Expenses.vue";

import store from "@/store";
import router from "@/router";
import { useRoute } from "vue-router";
import VisitModal from "@/views/general/Visit.vue";

import {
  pricetagsOutline,
  documentTextOutline,
  ellipsisVertical,
  homeOutline,
} from "ionicons/icons";

interface State {
  day: Day;
  selectedVisitID: string;
}
export default {
  name: "Employee Day",
  props: ["date"],
  setup(props: any) {
    const route = useRoute();
    const sections = ref<Array<SectionType>>([
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
      day: emptyDay(""), // Use the default hourly rate
      selectedVisitID: "",
    });

    if (route.name == "New Day") {
      if (props.date != "new") {
        // Input the default hourly rate for the given employee
        state.day = emptyDay(props.date);
      }
    }

    const messageModalIsOpen = ref(false);

    const sendMessage = (message: Message) => {
      console.log(message);
      messageModalIsOpen.value = false;
    };

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

    const visitModalIsOpen = ref(false);

    const openVisitModal = (visitID: string) => {
      console.log("opening visit modal");
      visitModalIsOpen.value = true;
      state.selectedVisitID = visitID;
    };

    return {
      store,
      ...toRefs(state),
      updateDay,
      sections,
      documentTextOutline,
      homeOutline,
      pricetagsOutline,
      ellipsisVertical,
      toggleDaySettings,
      popoverIsOpen,
      popoverEvent,
      messageModalIsOpen,
      sendMessage,
      deleteDay,
      router,
      openVisitModal,
      visitModalIsOpen,
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
    SendMessage,
    MessageModal,
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
  },
};
</script>

<style>
ion-title {
  padding-left: 10px;
}
</style>
