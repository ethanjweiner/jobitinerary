<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title
          >Visit<span v-if="visit.date"> on </span>{{ visit.date }}</ion-title
        >

        <div style="padding-left: 20px;">
          <ion-note v-if="visit.customerName"
            >for {{ visit.customerName }} |
          </ion-note>
          <ion-note v-if="visit.employeeName"
            >by {{ visit.employeeName }}</ion-note
          >
        </div>
        <ion-buttons :collapse="true" slot="end">
          <ion-button @click="toggleVisitSettings(true, $event)">
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
      <VisitPopover @deleteVisit="deleteVisit" />
    </ion-popover>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button></ion-back-button>
          </ion-buttons>
          <ion-title class="ion-text-start" style="padding-left: 15px;"
            >Visit on {{ visit.date }}</ion-title
          >
          <ion-buttons collapse="condense" slot="end">
            <ion-button @click="toggleVisitSettings(true, $event)">
              <ion-icon :icon="ellipsisVertical"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

        <!-- Whenever a change to this form is made (debounced), update in Firestore -->
        <!-- Use IonInput debounce function to trigger less changes -->
      </ion-header>

      <SendMessage @click="messageModalIsOpen = true" />
      <form>
        <Sections :sections="sections" wrapCards>
          <template v-slot:main>
            <VisitMain :visit="visit" @visitChanged="updateVisit" />
          </template>
          <template v-slot:tasks>
            <Tasks
              :tasks="visit.tasks"
              @tasksChanged="(newTasks) => (visit.tasks = newTasks)"
            />
          </template>
          <template v-slot:tools>
            <Tools
              :tools="visit.tools"
              @toolsChanged="(newTools) => (visit.tools = newTools)"
            />
          </template>
          <template v-slot:images>
            <Images
              :images="visit.images"
              @imagesChange="(newImages) => (visit.images = newImages)"
            />
          </template>
          <template v-slot:sectionsAsGrid>
            <ion-row>
              <ion-col size="6">
                <ion-card>
                  <VisitMain :visit="visit" @visitChanged="updateVisit" />
                </ion-card>
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
                    <Tasks
                      :tasks="visit.tasks"
                      @tasksChanged="(newTasks) => (visit.tasks = newTasks)"
                    />
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
                    <Tools
                      :tools="visit.tools"
                      @toolsChanged="(newTools) => (visit.tools = newTools)"
                    />
                  </ion-card-content>
                </ion-card>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="12">
                <ion-card>
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
                    <Images
                      :images="visit.images"
                      @imagesChange="(newImages) => (visit.images = newImages)"
                    />
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
          :visit="visit"
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
  IonNote,
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
  IonCardSubtitle,
  IonBackButton,
} from "@ionic/vue";

import Sections from "@/components/Sections.vue";

import { sampleVisit, SectionType, Message, Visit, emptyVisit } from "@/types";
import { computed, reactive, ref, toRefs } from "@vue/reactivity";
import {
  documentTextOutline,
  constructOutline,
  hammerOutline,
  calendarOutline,
  calendarNumberOutline,
  ellipsisVertical,
  imagesOutline,
} from "ionicons/icons";
import store from "@/store";
import VisitPopover from "@/components/popovers/VisitPopover.vue";
import SendMessage from "@/components/buttons/SendMessage.vue";
import MessageModal from "@/components/modals/MessageModal.vue";
import VisitMain from "@/components/forms/VisitMain.vue";
import Tasks from "@/components/lists/Tasks.vue";
import Tools from "@/components/lists/Tools.vue";
import Images from "@/components/lists/Images.vue";
import router from "@/router";

export default {
  name: "VisitView",
  props: ["visitID"],
  setup(props: any) {
    const sections = ref<Array<SectionType>>([
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

    if (props.visitID == "new") {
      // Clear the form (if has input)
      state.visit = emptyVisit();
    } else {
      // Fetch visit with id
      state.visit = sampleVisit;
    }

    const messageModalIsOpen = ref(false);

    const sendMessage = (message: Message) => {
      console.log(message);
      messageModalIsOpen.value = false;
    };

    const popoverIsOpen = ref(false);
    const popoverEvent = ref();
    const toggleVisitSettings = (state: boolean, ev?: Event) => {
      popoverEvent.value = ev;
      popoverIsOpen.value = state;
    };

    const displayToolsLeft = computed(() => {
      return true;
    });

    const updateVisit = (newVisit: Visit) => {
      state.visit = newVisit;
    };

    const deleteVisit = () => {
      popoverIsOpen.value = false;
      // Delete visit from database
      // Return to home
      router.go(-1);

      // Update the state
    };

    return {
      store,
      ...toRefs(state),
      updateVisit,
      sections,
      calendarOutline,
      calendarNumberOutline,
      ellipsisVertical,
      toggleVisitSettings,
      popoverIsOpen,
      popoverEvent,
      messageModalIsOpen,
      sendMessage,
      displayToolsLeft,
      hammerOutline,
      constructOutline,
      imagesOutline,
      deleteVisit,
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
    IonModal,
    IonPopover,
    IonButton,
    VisitPopover,
    SendMessage,
    MessageModal,
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
