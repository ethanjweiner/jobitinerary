<template>
  <ion-content>
    <ion-list>
      <VisitItem v-for="visit in visits" :key="visit.id" :visit="visit" />
    </ion-list>

    <ion-infinite-scroll
      @ionInfinite="loadData($event)"
      threshold="100px"
      id="infinite-scroll"
    >
      <ion-infinite-scroll-content
        loading-spinner="bubbles"
        loading-text="Loading visits..."
      >
      </ion-infinite-scroll-content>
    </ion-infinite-scroll>
  </ion-content>
</template>

<script lang="ts">
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonContent,
} from "@ionic/vue";

import VisitItem from "./items/VisitItem.vue";

import { Visit, sampleVisit } from "@/types";

import { ref } from "vue";

export default {
  name: "Visits",
  components: {
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonList,
    IonContent,
    VisitItem,
  },
  setup() {
    const visits = ref<Array<Visit>>([]);

    const pushData = () => {
      const max = visits.value.length + 5;
      const min = max - 5;
      for (let i = min; i < max; i++) {
        visits.value.push(sampleVisit);
      }
    };

    const loadData = (ev: any) => {
      setTimeout(() => {
        pushData();
        console.log("Loaded data");
        ev.target.complete();

        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (visits.value.length == 1000) {
          ev.target.disabled = true;
        }
      }, 500);
    };

    pushData();

    return {
      loadData,
      visits,
    };
  },
};
</script>

<style scoped></style>
