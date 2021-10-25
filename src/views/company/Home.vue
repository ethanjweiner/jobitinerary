<template>
  <ion-page>
    <ion-split-pane when="sm" content-id="main">
      <ion-content content-id="main">
        <ion-list>
          <ion-item v-for="item in items" :key="item">
            <ion-label>{{ item }}</ion-label>
          </ion-item>
        </ion-list>

        <ion-infinite-scroll
          @ionInfinite="loadData($event)"
          threshold="100px"
          id="infinite-scroll"
          :disabled="isDisabled"
        >
          <ion-infinite-scroll-content
            loading-spinner="bubbles"
            loading-text="Loading more data..."
          >
          </ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ion-content>
      <ion-content id="main">
        <ion-list>
          <ion-item v-for="item in items" :key="item">
            <ion-label>{{ item }}</ion-label>
          </ion-item>
        </ion-list>

        <ion-infinite-scroll
          @ionInfinite="loadData($event)"
          threshold="150px"
          id="infinite-scroll"
          :disabled="isDisabled"
        >
          <ion-infinite-scroll-content
            loading-spinner="bubbles"
            loading-text="Loading more data..."
          >
          </ion-infinite-scroll-content>
        </ion-infinite-scroll>
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
  IonList,
  IonItem,
  IonLabel,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/vue";

import CreateButton from "@/components/buttons/CreateButton.vue";
import store from "@/store";
import { companiesCollection, db } from "@/main";
import { ref } from "@vue/reactivity";

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

    const loadData = (ev: CustomEvent) => {
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
    IonList,
    IonItem,
    IonLabel,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
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
