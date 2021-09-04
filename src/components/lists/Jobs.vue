<template>
  <ion-content>
    <ion-list>
      <JobItem v-for="job in jobs" :key="job.id" :job="job" />
    </ion-list>

    <ion-infinite-scroll
      @ionInfinite="loadData($event)"
      threshold="100px"
      id="infinite-scroll"
    >
      <ion-infinite-scroll-content
        loading-spinner="bubbles"
        loading-text="Loading jobs..."
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

import JobItem from "./items/JobItem.vue";

import { Job, sampleJob } from "@/types";

import { ref } from "vue";

export default {
  name: "Jobs",
  components: {
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonList,
    IonContent,
    JobItem,
  },
  setup() {
    const jobs = ref<Array<Job>>([]);

    const pushData = () => {
      const max = jobs.value.length + 5;
      const min = max - 5;
      for (let i = min; i < max; i++) {
        jobs.value.push(sampleJob);
      }
    };

    const loadData = (ev: any) => {
      setTimeout(() => {
        pushData();
        console.log("Loaded data");
        ev.target.complete();

        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (jobs.value.length == 1000) {
          ev.target.disabled = true;
        }
      }, 500);
    };

    pushData();

    return {
      loadData,
      jobs,
    };
  },
};
</script>

<style scoped></style>
