<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          <ion-text color="light">
            JobItinerary
          </ion-text>
        </ion-title>
        <SettingsButton />
      </ion-toolbar>
    </ion-header>
    <ion-split-pane when="sm" content-id="main">
      <ion-content>
        <div style="margin-top: 68px;"></div>

        <Jobs :dbRef="jobsRef" />
      </ion-content>
      <ion-content id="main">
        <div style="margin-top: 68px;"></div>

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
  IonText,
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
    IonText,
  },
};
</script>

<style scoped>
ion-split-pane {
  --side-width: 50%;
  --side-min-width: 50%;
  --side-max-width: 50%;
  --border: 3px solid var(--ion-color-primary);
}

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

  ion-split-pane {
    margin-top: 56px;
  }
}
.ios ion-split-pane {
  margin-top: 44px !important;
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
