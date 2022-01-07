<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="unit-toolbar" color="primary" v-if="state.job">
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>
          <ion-text color="light">
            {{ state.job.data.name ? state.job.data.name : "New Job" }}
          </ion-text>
        </ion-title>
        <ion-note
          style="padding-left: 20px;"
          color="light"
          class="ion-hide-md-down"
          >for {{ idToName(state.job.data.customerID) }}</ion-note
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
    <div v-if="state.job">
      <Sections :sections="sections">
        <template v-slot:main>
          <JobMain
            :key="state.job"
            v-model="state.job"
            :visits="state.visits"
          />
        </template>
        <template v-slot:visits>
          <JobVisits :key="state.job" v-model="state.visits" :job="state.job" />
        </template>
      </Sections>
    </div>
  </ion-page>
</template>

<script lang="ts">
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonNote,
  IonPage,
  IonPopover,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { reactive, ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import {
  constructOutline,
  documentTextOutline,
  ellipsisVertical,
  homeOutline,
} from "ionicons/icons";

import JobMain from "@/components/forms/JobMain.vue";
import JobVisits from "@/components/lists/JobVisits.vue";
import DeletePopover from "@/components/popovers/DeletePopover.vue";
import Sections from "@/components/Sections.vue";
import { idToName } from "@/helpers";
import { companiesCollection } from "@/main";
import { refreshOnRouteChange } from "@/mixins";
import router from "@/router";
import store from "@/store";
import { SectionsType } from "@/types/auxiliary";
import { Job, Visit } from "@/types/units";

interface State {
  job: Job | null;
  visits: Array<Visit>;
}

export default {
  name: "Job",
  props: {
    userID: String,
    id: String,
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
        name: "Visits",
        icon: homeOutline,
        id: "visits",
      },
    ]);

    const state = reactive<State>({
      job: null,
      visits: [],
    });

    // Initialize job
    const initialize = async (id) => {
      const job = new Job(id, store.state.companyID, props.userID);
      await job.init();
      state.job = job;
      const visitDocs = (
        await companiesCollection
          .doc(store.state.companyID)
          .collection("visits")
          .where("data.id", "==", job.id)
          .get()
      ).docs;
      for (const doc of visitDocs) {
        const visit = new Visit(doc.id, store.state.companyID);
        await visit.init(doc.data().data);
        state.visits.push(visit);
      }
      watch(state.job.data, () => {
        if (state.job) state.job.save();
      });
    };

    initialize(props.id);

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
      await router.push({ name: "Home" });
      router.go(0);
      popoverIsOpen.value = false;
    };

    refreshOnRouteChange(initialize);

    return {
      state,
      sections,
      popoverIsOpen,
      popoverEvent,
      toggleJobSettings,
      deleteJob,
      idToName,
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
    IonIcon,
    IonButtons,
    IonPopover,
    IonButton,
    IonBackButton,
    JobMain,
    Sections,
    JobVisits,
    DeletePopover,
    IonNote,
    IonText,
  },
};
</script>

<style scoped>
ion-header {
  display: block;
}
</style>
