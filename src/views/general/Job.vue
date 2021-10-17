<template>
  <ion-page v-if="state.job">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ state.job.data.name ? state.job.data.name : "New Job" }}</ion-title
        >
        <ion-note style="padding-left: 15px;"
          >for {{ state.job.data.customerName }}</ion-note
        >
        <ion-buttons :collapse="true" slot="end">
          <ion-button @click="toggleJobSettings(true, $event)">
            <ion-icon :icon="icons.ellipsisVertical"></ion-icon>
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
      <DeletePopover unitName="Job" @delete="deleteJob" />
    </ion-popover>
    <ion-content :fullscreen="true">
      <form>
        <Sections :sections="sections" wrapCards>
          <template v-slot:main>
            <JobMain v-model="state.job" :visits="state.visits" />
          </template>
          <template v-slot:tasks>
            <Tasks v-model="state.job.data.tasks" />
          </template>
          <template v-slot:visits>
            <JobVisits v-model="state.visits" :job="state.job" />
          </template>
          <template v-slot:sectionsAsGrid>
            <ion-row>
              <ion-col size="6">
                <ion-row>
                  <ion-card style="width: 100%;">
                    <JobMain v-model="state.job" :visits="state.visits" />
                  </ion-card>
                </ion-row>
                <ion-row>
                  <ion-card style="width: 100%;">
                    <ion-card-header class="ion-text-center">
                      <ion-card-title>
                        <ion-icon :icon="icons.constructOutline"></ion-icon>
                        Tasks
                      </ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                      <Tasks v-model="state.job.data.tasks" />
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
                    <JobVisits v-model="state.visits" :job="state.job" />
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
  IonIcon,
  IonButtons,
  IonPopover,
  IonButton,
  IonBackButton,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
  IonRow,
  IonCol,
  IonNote,
} from "@ionic/vue";
import { reactive, ref } from "@vue/reactivity";
import router from "@/router";

import {
  documentTextOutline,
  homeOutline,
  constructOutline,
  ellipsisVertical,
} from "ionicons/icons";

import { Job, Visit } from "@/types/work_units";
import { SectionsType } from "@/types/auxiliary";

import Sections from "@/components/Sections.vue";
import JobMain from "@/components/forms/JobMain.vue";
import JobVisits from "@/components/lists/JobVisits.vue";
import Tasks from "@/components/lists/Tasks.vue";
import DeletePopover from "@/components/popovers/DeletePopover.vue";
import store from "@/store";
import { nameToID } from "@/helpers";
import { watch } from "@vue/runtime-core";
import { companiesCollection } from "@/main";

interface State {
  job: Job | null;
  visits: Array<Visit>;
}

export default {
  name: "Job",
  props: {
    username: String,
    jobID: String,
  },
  setup(props: any) {
    // Sections
    const sections = ref<SectionsType>([
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

    const state = reactive<State>({
      // RETRIEVE JOB WITH CUSTOMER USERNAME AND JOB ID
      job: null,
      // RETRIEVE VISITS UPON LOAD
      visits: [],
    });

    // Initialize job
    const initialize = async () => {
      if (store.state.company) {
        const job = new Job(
          props.jobID,
          store.state.company.id,
          nameToID(props.username)
        );
        await job.init();
        state.job = job;
        const visitDocs = (
          await companiesCollection
            .doc(store.state.company.id)
            .collection("visits")
            .where("data.jobID", "==", job.id)
            .get()
        ).docs;
        for (const doc of visitDocs) {
          const visit = new Visit(doc.id, store.state.company.id);
          await visit.init(doc.data().data);
          state.visits.push(visit);
        }
        watch(state.job.data, () => {
          if (state.job) state.job.save();
        });
      }
    };

    initialize();

    // Popover
    const popoverIsOpen = ref(false);
    const popoverEvent = ref();
    const toggleJobSettings = (state: boolean, ev?: Event) => {
      popoverEvent.value = ev;
      popoverIsOpen.value = state;
    };

    const deleteJob = async () => {
      // DELETE JOB FROM DATABASE, THEN ROUTE
      if (state.job) await state.job.delete();

      // Return to home
      router.go(-1);
    };

    return {
      state,
      sections,
      popoverIsOpen,
      popoverEvent,
      toggleJobSettings,
      deleteJob,
      icons: {
        ellipsisVertical,
        homeOutline,
        documentTextOutline,
        constructOutline,
      },
    };
  },
  components: {
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
    DeletePopover,
    IonNote,
  },
};
</script>

<style></style>
