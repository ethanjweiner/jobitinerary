<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
        <SettingsButton />
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row class="ion-justify-content-around">
          <ion-col
            size-xs="12"
            size-sm="12"
            size-md="6"
            size-lg="6"
            size-xl="6"
            class="visits-column"
          >
            <ion-card>
              <Visits :dbRef="visitsRef" />
            </ion-card>
          </ion-col>
          <ion-col
            size-xs="12"
            size-sm="12"
            size-md="6"
            size-lg="6"
            size-xl="6"
            class="jobs-column"
          >
            <ion-card>
              <Jobs :dbRef="jobsRef" />
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
      <CreateButton />
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
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
} from "@ionic/vue";

import SettingsButton from "@/components/buttons/SettingsButton.vue";
import CreateButton from "@/components/buttons/CreateButton.vue";
import Visits from "@/components/lists/VisitsInfinite.vue";
import Jobs from "@/components/lists/Jobs.vue";
import store from "@/store";
import { companiesCollection, db } from "@/main";

export default {
  name: "Home",
  setup() {
    let visitsRef, jobsRef;
    if (store.state.company) {
      visitsRef = companiesCollection
        .doc(store.state.company.id)
        .collection("visits");
      jobsRef = db
        .collectionGroup("jobs")
        .where("data.companyID", "==", store.state.company.id);
    } else {
      throw Error("The company does not exist");
    }

    // Force Reload

    // Reload the visits component on any changes

    return {
      visitsRef,
      jobsRef,
    };
  },
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    SettingsButton,
    CreateButton,
    Visits,
    IonGrid,
    IonRow,
    IonCol,
    Jobs,
    IonCard,
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

.ios > ion-col {
  margin-top: 0px;
}
ion-card {
  height: 100%;
}
</style>
