<template>
  <div id="jobs-modal">
    <ion-header>
      <ion-toolbar>
        <ion-title> Choose a Job</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">
            <ion-icon :icon="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-searchbar
        v-model="searchText"
        placeholder="Search by job name, customer, start date, description, etc."
      ></ion-searchbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <JobItem
          class="job-item"
          v-for="job in filteredJobs"
          :key="job.id"
          :job="job"
          :showCustomer="true"
          @click="selectJob(job)"
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
  </div>
</template>

<script lang="ts">
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonContent,
  IonSearchbar,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonIcon,
  IonButton,
  IonButtons,
} from "@ionic/vue";

import { includeItemInSearch } from "@/helpers";

import JobItem from "@/components/lists/items/JobItem.vue";

import { Job, sampleJob } from "@/types";

import { computed, defineComponent, reactive, ref, toRefs } from "vue";

import { close } from "ionicons/icons";

export default defineComponent({
  name: "Jobs",
  components: {
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonList,
    IonContent,
    JobItem,
    IonSearchbar,
    IonToolbar,
    IonTitle,
    IonHeader,
    IonIcon,
    IonButton,
    IonButtons,
  },
  setup(props: any, { emit }) {
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
      const max = jobs.value.length + 10;
      const min = max - 10;
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

    const selectJob = (job: Job) => {
      emit("jobSelected", job);
    };

    const closeModal = () => {
      emit("closeModal");
    };

    pushData();

    return {
      ...toRefs(state),
      loadData,
      jobs,
      filteredJobs,
      close,
      selectJob,
      closeModal,
    };
  },
});
</script>

<style scoped>
ion-searchbar {
  padding-left: 0;
  padding-bottom: 0;
}
.job-item {
  cursor: pointer;
}
ion-searchbar {
  padding: 0;
}
#jobs-modal {
  height: calc(100% - 105px);
}
</style>
