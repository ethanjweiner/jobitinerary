<template>
  <div id="jobs-modal">
    <ion-header>
      <ion-toolbar>
        <ion-title> Choose a Job</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('close')">
            <ion-icon :icon="icons.close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-searchbar
        v-model="searchText"
        placeholder="Search by job name, customer, start date, description, etc."
      ></ion-searchbar>
    </ion-header>
    <!-- PASS A DATABASE REFERENCE TO ALL JOBS UNDER THE SELECTED CUSTOMER -->
    <InfiniteList
      :key="searchText"
      :splitters="splitters"
      :searchFilter="searchText"
      :dbRef="dbRef"
      :pushQuantity="10"
      orderByParam="startDate"
    >
      <template v-slot:item="itemProps">
        <JobItem
          class="job-item"
          :key="itemProps.item.id"
          :job="itemProps.item"
          :showCustomer="true"
          @click="$emit('jobSelected', itemProps.item)"
        />
      </template>
    </InfiniteList>
  </div>
</template>

<script lang="ts">
import {
  IonSearchbar,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonIcon,
  IonButton,
  IonButtons,
} from "@ionic/vue";
import { defineComponent, ref } from "vue";
import { close } from "ionicons/icons";

import InfiniteList from "../lists/InfiniteList.vue";
import JobItem from "@/components/lists/items/JobItem.vue";
import { Splitter } from "@/types/auxiliary";
import { JobInterface } from "@/types/work_units";

export default defineComponent({
  name: "Jobs",
  components: {
    JobItem,
    IonSearchbar,
    IonToolbar,
    IonTitle,
    IonHeader,
    IonIcon,
    IonButton,
    IonButtons,
    InfiniteList,
  },
  props: {
    dbRef: Object,
  },
  emits: ["close", "jobSelected"],
  setup() {
    const searchText = ref("");

    const splitters = ref<Array<Splitter>>([
      {
        name: "Unscheduled Jobs",
        filter: (item: JobInterface) => !item.startDate,
      },
      {
        name: "Scheduled Jobs",
        filter: (item: JobInterface) => new Date(item.startDate) > new Date(),
      },
      {
        name: "Current Jobs",
        filter: (item: JobInterface) =>
          new Date(item.startDate) <= new Date() &&
          new Date(item.endDate) >= new Date(),
      },
      {
        name: "Past Jobs",
        filter: (item: JobInterface) => new Date(item.endDate) < new Date(),
      },
    ]);

    return {
      searchText,
      splitters,
      icons: { close },
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
