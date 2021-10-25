<template>
  <div slot="fixed" class="ion-padding list-header">
    <ion-title>
      Jobs
      <AddButton @click="createJob" />
    </ion-title>
    <ion-searchbar class="ion-text-start" v-model="searchText"></ion-searchbar>
  </div>
  <div style="margin-top: 130px;"></div>

  <InfiniteList
    :key="searchText"
    :splitters="splitters"
    :pushQuantity="10"
    :dbRef="dbRef"
    orderByParam="startDate"
    :searchFilter="searchText"
  >
    <template v-slot:item="itemProps">
      <JobItem
        :job="itemProps.item"
        :showCustomer="customerID ? false : true"
        @click="
          router.push({
            name: 'Job',
            params: {
              userID: itemProps.item.customerID,
              jobID: itemProps.item.id,
            },
          })
        "
      />
    </template>
  </InfiniteList>
</template>

<script lang="ts">
import { IonSearchbar, IonTitle } from "@ionic/vue";
import { reactive, ref } from "vue";
import router from "@/router";

import { JobInterface } from "@/types/units";
import { Splitter } from "@/types/auxiliary";

import JobItem from "./items/JobItem.vue";
import AddButton from "@/components/buttons/AddButton.vue";
import InfiniteList from "./InfiniteList.vue";

export default {
  name: "Jobs",
  props: {
    dbRef: Object, // Determine database query in parent component
    customerID: String,
  },
  setup(props: any) {
    // TEMPORARY: Add a job
    const searchText = ref<string>("");

    const state = reactive({
      customerID: props.customerID ? props.customerID : "new",
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
        params: { customerID: state.customerID },
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
    IonSearchbar,
    IonTitle,
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
</style>
