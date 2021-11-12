<template>
  <SearchToolbar :addAction="createJob" title="Jobs" v-model="searchText" />

  <InfiniteList
    :key="searchText"
    :splitters="splitters"
    :pushQuantity="10"
    :dbRef="dbRef"
    orderByParam="startDate"
    :searchFilter="searchText"
    :sizes="sizes"
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
import { reactive, ref } from "vue";

import SearchToolbar from "@/components/inputs/SearchToolbar.vue";
import router from "@/router";
import { Splitter } from "@/types/auxiliary";
import { JobInterface } from "@/types/units";

import InfiniteList from "./InfiniteList.vue";
import JobItem from "./items/JobItem.vue";

export default {
  name: "Jobs",
  props: {
    dbRef: Object, // Determine database query in parent component
    customerID: String,
  },
  setup(props: any) {
    const sizes = {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 6,
      xl: 6,
    };
    // TEMPORARY: Add a job
    const searchText = ref<string>("");

    const state = reactive({
      customerID: props.customerID ? props.customerID : "new",
    });

    const splitters = ref<Array<Splitter>>([
      {
        name: "Unscheduled",
        filter: (item: JobInterface) => !item.startDate,
      },
      {
        name: "Scheduled",
        filter: (item: JobInterface) => new Date(item.startDate) > new Date(),
      },
      {
        name: "Current",
        filter: (item: JobInterface) =>
          new Date(item.startDate) <= new Date() &&
          new Date(item.endDate) >= new Date(),
      },
      {
        name: "Past",
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
      sizes,
      splitters,
      createJob,
      searchText,
      router,
    };
  },
  components: {
    JobItem,
    InfiniteList,
    SearchToolbar,
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
