<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
        <SettingsButton />
      </ion-toolbar>
    </ion-header>
    <ion-split-pane when="xs" content-id="main">
      <ion-content class="ion-padding">
        <Visits :dbRef="visitsRef" />
      </ion-content>
      <ion-content class="ion-padding" id="main">
        <Jobs :dbRef="jobsRef" />
      </ion-content>
    </ion-split-pane>
    <CreateButton />
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonSplitPane,
  IonContent,
  IonToolbar,
  IonTitle,
  IonHeader,
} from "@ionic/vue";

import CreateButton from "@/components/buttons/CreateButton.vue";
import SettingsButton from "@/components/buttons/SettingsButton.vue";
import store from "@/store";
import { companiesCollection, db } from "@/main";
import { ref } from "@vue/reactivity";
import Visits from "@/components/lists/VisitsInfinite.vue";
import Jobs from "@/components/lists/Jobs.vue";

export default {
  name: "Home",
  setup() {
    const visitsRef = companiesCollection
      .doc(store.state.companyID)
      .collection("visits");
    const jobsRef = db
      .collectionGroup("jobs")
      .where("data.companyID", "==", store.state.companyID);

    const isDisabled = ref(false);
    const toggleInfiniteScroll = () => {
      isDisabled.value = !isDisabled.value;
    };
    const items = ref([]);
    const pushData = () => {
      const max = items.value.length + 20;
      const min = max - 20;
      for (let i = min; i < max; i++) {
        items.value.push(i);
      }
    };

    const loadData = (ev: any) => {
      setTimeout(() => {
        pushData();
        console.log("Loaded data");
        ev.target.complete();

        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (items.value.length == 1000) {
          ev.target.disabled = true;
        }
      }, 500);
    };

    pushData();

    return {
      visitsRef,
      jobsRef,
      isDisabled,
      toggleInfiniteScroll,
      loadData,
      items,
    };
  },
  components: {
    IonPage,
    CreateButton,
    IonSplitPane,
    IonContent,
    IonToolbar,
    IonTitle,
    SettingsButton,
    IonHeader,
    Visits,
    Jobs,
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
</style>
