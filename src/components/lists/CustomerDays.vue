<template>
  <SearchToolbar
    :addAction="createDay"
    title="Dates"
    v-model="searchDate"
    useDateInput
  />

  <InfiniteList
    :key="searchDate"
    :splitters="splitters"
    :pushQuantity="config.constants.PUSH_QUANTITY"
    :dbRef="dbRef"
    orderByParam="date"
    :searchFilter="searchDate"
  >
    <template v-slot:item="itemProps">
      <CustomerDayItem :day="itemProps.item" />
    </template>
  </InfiniteList>
</template>

<script lang="ts">
import { ref } from "vue";

import config from "@/config/config";
import router from "@/router";
import { Splitter } from "@/types/auxiliary";
import { CustomerDayInterface } from "@/types/units";

import SearchToolbar from "../inputs/SearchToolbar.vue";
import InfiniteList from "./InfiniteList.vue";
import CustomerDayItem from "./items/CustomerDayItem.vue";

export default {
  name: "Employee Days",
  components: {
    CustomerDayItem,
    InfiniteList,
    SearchToolbar,
  },
  props: {
    dbRef: Object,
    customerID: String,
    hideAdd: Boolean,
    title: String,
  },
  setup(props: any) {
    const searchDate = ref<string>("");

    const splitters = ref<Array<Splitter>>([
      {
        name: "Future Dates",
        filter: (day: CustomerDayInterface) => new Date(day.date) >= new Date(),
      },
      {
        name: "Logged Dates",
        filter: (day: CustomerDayInterface) => new Date(day.date) < new Date(),
      },
    ]);

    const createDay = async () => {
      router.push({
        name: "New Customer Day",
        params: { customerID: props.customerID },
      });
    };

    return {
      router,
      createDay,
      searchDate,
      splitters,
      config,
    };
  },
};
</script>

<style scoped></style>
