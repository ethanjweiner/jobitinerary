<template>
  <div style="height: 100%;">
    <ion-card-header>
      <ion-card-title>
        Jobs
        <AddButton @click="createJob" />
      </ion-card-title>

      <ion-searchbar
        class="ion-text-start"
        v-model="searchText"
        placeholder="Search by job name, customer, start date, description, etc."
      ></ion-searchbar>
    </ion-card-header>

    <ion-card-content>
      <InfiniteList
        :key="searchText"
        :splitters="splitters"
        :pushQuantity="8"
        :dbRef="dbRef"
        orderByParam="startDate"
        :searchFilter="searchText"
      >
        <template v-slot:item="itemProps">
          <JobItem
            :job="itemProps.item"
            :showCustomer="customerName ? false : true"
            @click="
              router.push({
                name: 'Job',
                params: {
                  username: itemProps.item.customerName,
                  jobID: itemProps.item.id,
                },
              })
            "
          />
        </template>
      </InfiniteList>
    </ion-card-content>
  </div>
</template>

<script lang="ts">
import {
  IonCardHeader,
  IonSearchbar,
  IonCardTitle,
  IonCardContent,
} from "@ionic/vue";
import { reactive, ref } from "vue";
import router from "@/router";

import { JobInterface } from "@/types/work_units";
import { Splitter } from "@/types/auxiliary";

import JobItem from "./items/JobItem.vue";
import AddButton from "@/components/buttons/AddButton.vue";
import InfiniteList from "./InfiniteList.vue";

export default {
  name: "Jobs",
  props: {
    dbRef: Object, // Determine database query in parent component
    customerName: String,
  },
  setup(props: any) {
    // TEMPORARY: Add a job
    const searchText = ref<string>("");

    const state = reactive({
      customerName: props.customerName ? props.customerName : "new",
    });

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

    const createJob = async () => {
      router.push({
        name: "New Job",
        params: { customerName: state.customerName },
      });
    };

    return {
      state,
      splitters,
      createJob,
      searchText,
      router,
    };
  },
  components: {
    JobItem,
    IonCardHeader,
    IonSearchbar,
    IonCardTitle,
    IonCardContent,
    AddButton,
    InfiniteList,
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
