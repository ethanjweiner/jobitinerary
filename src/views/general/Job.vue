<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ state.job.name ? state.job.name : "New Job" }}</ion-title
        >
        <ion-note style="padding-left: 15px;"
          >for {{ state.job.customerName }}</ion-note
        >
        <ion-buttons :collapse="true" slot="end">
          <ion-button @click="toggleJobSettings(true, $event)">
            <ion-icon :icon="ellipsisVertical"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-popover
      :is-open="popoverIsOpen"
      :translucent="true"
      :event="popoverEvent"
      @didDismiss="toggleJobSettings(false)"
    >
      <JobPopover @deleteJob="deleteJob" />
    </ion-popover>
    <ion-content :fullscreen="true">
      <form>
        <Sections :sections="sections" wrapCards>
          <template v-slot:main>
            <JobMain
              :job="state.job"
              :visits="state.visits"
              @jobChanged="updateJob"
            />
          </template>
          <template v-slot:tasks>
            <Tasks
              :tasks="state.job.tasks"
              @taskChanged="(newTasks) => (state.job.tasks = newTasks)"
            />
          </template>
          <template v-slot:visits>
            <JobVisits :visits="state.visits" @openVisit="openVisitModal" />
          </template>
          <template v-slot:sectionsAsGrid>
            <ion-row>
              <ion-col size="6">
                <ion-row>
                  <ion-card style="width: 100%;">
                    <JobMain
                      :job="state.job"
                      :visits="state.visits"
                      @jobChanged="updateJob"
                    />
                  </ion-card>
                </ion-row>
                <ion-row>
                  <ion-card style="width: 100%;">
                    <ion-card-header class="ion-text-center">
                      <ion-card-title>
                        <ion-icon :icon="constructOutline"></ion-icon>
                        Tasks
                      </ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                      <Tasks
                        :tasks="state.job.tasks"
                        @taskChanged="
                          (newTasks) => (state.job.tasks = newTasks)
                        "
                      />
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
                    <JobVisits
                      :visits="state.visits"
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
  IonPopover,
  IonButton,
  IonBackButton,
  IonModal,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
  IonRow,
  IonCol,
  IonNote,
} from "@ionic/vue";
import { reactive, ref } from "@vue/reactivity";
import { Job, sampleJob, sampleVisit, SectionType } from "@/types";
import Sections from "@/components/Sections.vue";
import JobMain from "@/components/forms/JobMain.vue";
import JobVisits from "@/components/lists/JobVisits.vue";
import Tasks from "@/components/lists/Tasks.vue";
import VisitModal from "@/views/general/Visit.vue";

import {
  documentTextOutline,
  homeOutline,
  constructOutline,
  ellipsisVertical,
} from "ionicons/icons";
import JobPopover from "@/components/popovers/JobPopover.vue";
import router from "@/router";

export default {
  name: "Job",
  props: {
    username: String,
    jobID: String,
  },
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonModal,
    IonIcon,
    IonButtons,
    IonPopover,
    IonButton,
    IonBackButton,
    Tasks,
    JobMain,
    Sections,
    IonCard,
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
    IonRow,
    IonCol,
    JobVisits,
    VisitModal,
    JobPopover,
    IonNote,
  },
  setup() {
    const sections = ref<Array<SectionType>>([
      {
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
        name: "Visits",
        icon: homeOutline,
        id: "visits",
      },
    ]);
    const state = reactive({
      job: sampleJob,
      // Retrieve visits upon load
      visits: [sampleVisit, sampleVisit],
      selectedVisitID: "",
    });
    console.log(sampleVisit);
    const popoverIsOpen = ref(false);
    const popoverEvent = ref();
    const toggleJobSettings = (state: boolean, ev?: Event) => {
      popoverEvent.value = ev;
      popoverIsOpen.value = state;
    };

    const updateJob = (newJob: Job) => {
      console.log(newJob);
      state.job = newJob;
    };

    const deleteJob = () => {
      popoverIsOpen.value = false;
      router.go(-1);
    };

    const visitModalIsOpen = ref(false);

    const openVisitModal = (visitID: string) => {
      console.log("opening visit modal");
      visitModalIsOpen.value = true;
      state.selectedVisitID = visitID;
    };

    return {
      state,
      sections,
      popoverIsOpen,
      popoverEvent,
      toggleJobSettings,
      updateJob,
      ellipsisVertical,
      homeOutline,
      documentTextOutline,
      constructOutline,
      visitModalIsOpen,
      openVisitModal,
      deleteJob,
    };
  },
};
</script>

<style></style>
