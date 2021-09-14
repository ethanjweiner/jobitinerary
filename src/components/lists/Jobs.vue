<template>
  <ion-card-header>
    <div class="ion-text-center">
      <h3 class="list-header">
        <ion-text color="dark">
          Jobs
        </ion-text>
      </h3>
      <ion-chip
        @click="
          router.push({ name: 'New Job', params: { customerName: 'new' } })
        "
      >
        <ion-icon :icon="add"></ion-icon>
        <ion-label>Add New</ion-label>
      </ion-chip>
    </div>

    <ion-searchbar
      v-model="searchText"
      placeholder="Search by job name, customer, start date, description, etc."
    ></ion-searchbar>
  </ion-card-header>
  <ion-card-content>
    <ion-content>
      <ion-list>
        <ion-item-group v-if="presentJobs.length">
          <ion-item-divider>
            <ion-label>Present Jobs</ion-label>
          </ion-item-divider>
          <JobItem
            v-for="job in presentJobs"
            :key="job.id"
            :job="job"
            :showCustomer="showCustomer"
            @click="
              router.push({
                name: 'Job',
                params: { username: job.customerName, jobID: job.id },
              })
            "
          />
        </ion-item-group>
        <ion-item-group v-if="futureJobs.length">
          <ion-item-divider>
            <ion-label>Future Jobs</ion-label>
          </ion-item-divider>
          <JobItem
            v-for="job in futureJobs"
            :key="job.id"
            :job="job"
            :showCustomer="showCustomer"
          />
        </ion-item-group>
        <ion-item-group v-if="pastJobs.length">
          <ion-item-divider>
            <ion-label>Past Jobs</ion-label>
          </ion-item-divider>
          <JobItem
            v-for="job in pastJobs"
            :key="job.id"
            :job="job"
            :showCustomer="showCustomer"
          />
        </ion-item-group>
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
</template>

<script lang="ts">
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonContent,
  IonCardHeader,
  IonSearchbar,
  IonText,
  IonCardContent,
  IonChip,
  IonLabel,
  IonIcon,
  IonItemGroup,
  IonItemDivider,
} from "@ionic/vue";

import { includeItemInSearch } from "@/helpers";

import JobItem from "./items/JobItem.vue";

import { Job, sampleJob } from "@/types";

import { computed, reactive, ref, toRefs } from "vue";

import { add } from "ionicons/icons";

import router from "@/router";

export default {
  name: "Jobs",
  props: ["showCustomer"],
  components: {
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonList,
    IonContent,
    JobItem,
    IonCardHeader,
    IonSearchbar,
    IonText,
    IonCardContent,
    IonChip,
    IonLabel,
    IonIcon,
    IonItemGroup,
    IonItemDivider,
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

    const pastJobs = computed(() => {
      return filteredJobs.value.filter(
        (job) => new Date(job.endDate) < new Date()
      );
    });

    const presentJobs = computed(() => {
      return filteredJobs.value.filter(
        (job) =>
          new Date(job.startDate) <= new Date() &&
          new Date(job.endDate) >= new Date()
      );
    });

    const futureJobs = computed(() => {
      return filteredJobs.value.filter(
        (job) => new Date(job.startDate) > new Date()
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
      futureJobs,
      pastJobs,
      presentJobs,
      add,
      router,
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
ion-searchbar {
  padding-left: 0;
  padding-bottom: 0;
}
</style>
