<template>
  <ion-card>
    <ion-card-header>
      <div class="ion-text-center">
        <h3 class="list-header">
          <ion-text color="dark">
            Scheduled Jobs
          </ion-text>
        </h3>
      </div>

      <ion-searchbar
        v-model="searchText"
        placeholder="Search by job name, customer, start date, description, etc."
      ></ion-searchbar>
    </ion-card-header>
    <ion-card-content>
      <ion-content>
        <ion-list>
          <JobItem
            v-for="job in filteredJobs"
            :key="job.id"
            :job="job"
            :showCustomer="showCustomer"
          />
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
    </ion-card-content>
  </ion-card>
</template>

<script lang="ts">
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonContent,
  IonCard,
  IonCardHeader,
  IonSearchbar,
  IonText,
  IonCardContent,
} from "@ionic/vue";

import { includeItemInSearch } from "@/helpers";

import JobItem from "./items/JobItem.vue";

import { Job, sampleJob } from "@/types";

import { computed, reactive, ref, toRefs } from "vue";

export default {
  name: "Jobs",
  props: ["showCustomer"],
  components: {
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonList,
    IonContent,
    JobItem,
    IonCard,
    IonCardHeader,
    IonSearchbar,
    IonText,
    IonCardContent,
  },
  setup() {
    const state = reactive({
      searchText: "",
    });
    const jobs = ref<Array<Job>>([]);

    const filteredJobs = computed(() => {
      if (state.searchText == "") return jobs.value;
      return jobs.value.filter((job) =>
        includeItemInSearch(job, state.searchText, [
          "name",
          "customerName",
          "startDate",
          "description",
        ])
      );
    });

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
      ...toRefs(state),
      loadData,
      jobs,
      filteredJobs,
    };
  },
};
</script>

<style scoped>
ion-card {
  height: 100%;
}
ion-card-content {
  height: 80%;
  padding: 0;
}
ion-card-header {
  border-bottom: 1px solid green;
}
.list-header {
  margin: 0;
  display: inline;
}
ion-searchbar {
  padding-left: 0;
  padding-bottom: 0;
}
</style>
