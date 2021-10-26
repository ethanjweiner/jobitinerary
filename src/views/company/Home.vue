<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>JobItinerary</ion-title>
        <SettingsButton />
      </ion-toolbar>
    </ion-header>
    <ion-split-pane when="sm" content-id="main">
      <ion-content>
        <Jobs :dbRef="jobsRef" />
      </ion-content>
      <ion-content id="main">
        <Visits :dbRef="visitsRef" />
      </ion-content>
    </ion-split-pane>
    <CreateButton />
  </ion-page>
</template>

<script lang="ts">
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSplitPane,
  IonContent,
  IonPage,
} from "@ionic/vue";

import CreateButton from "@/components/buttons/CreateButton.vue";
import store from "@/store";
import { companiesCollection, db } from "@/main";
import Visits from "@/components/lists/VisitsInfinite.vue";
import Jobs from "@/components/lists/Jobs.vue";
import SettingsButton from "@/components/buttons/SettingsButton.vue";

export default {
  name: "Home",
  setup() {
    const visitsRef = companiesCollection
      .doc(store.state.companyID)
      .collection("visits");
    const jobsRef = db
      .collectionGroup("jobs")
      .where("data.companyID", "==", store.state.companyID);

    return {
      visitsRef,
      jobsRef,
    };
  },
  components: {
    CreateButton,
    IonSplitPane,
    IonContent,
    Visits,
    Jobs,
    IonHeader,
    IonToolbar,
    IonTitle,
    SettingsButton,
    IonPage,
  },
};
</script>

<style scoped>
ion-grid {
  height: calc(100% - 120px);
}

ion-row {
  height: 100%;
}
ion-col {
  margin-top: 10px;
}
.visits-column,
.jobs-column {
  height: 100%;
}

@media (max-width: 768px) {
  .visits-column,
  .jobs-column {
    height: 50%;
  }
}

ion-col {
  margin-top: 0px;
}
ion-card {
  height: 100%;
}

ion-header {
  --background: var(--ion-color-primary);
}
</style>
