<template>
  <InfiniteList
    :key="searchText"
    :splitters="splitters"
    :pushQuantity="5"
    :dbRef="dbRef"
    orderByParam="date"
    :searchFilter="searchText"
  >
    <template v-slot:item="itemProps">
      <VisitItem
        :visit="itemProps.item"
        :itemAction="
          () =>
            router.push({
              name: 'Company Visit',
              params: { visitID: itemProps.item.id },
            })
        "
      />
    </template>
  </InfiniteList>
</template>

<script lang="ts">
import { ref } from "vue";
import router from "@/router";

import { VisitInterface } from "@/types/units";
import { Splitter } from "@/types/auxiliary";

import VisitItem from "./items/VisitItem.vue";
import InfiniteList from "./InfiniteList.vue";
import { createVisit } from "@/db";

export default {
  name: "Visits",
  components: {
    VisitItem,
    InfiniteList,
  },
  props: {
    dbRef: Object, // Determine database query in parent component
  },
  setup() {
    // Temporary: Add a visit to the database

    const searchText = ref<string>("");

    const splitters = ref<Array<Splitter>>([
      {
        name: "Scheduled Visits",
        filter: (item: VisitInterface) => new Date(item.date) >= new Date(),
      },
      {
        name: "Past Visits",
        filter: (item: VisitInterface) => new Date(item.date) < new Date(),
      },
    ]);

    const newVisit = async () => {
      const visit = await createVisit();
      router.push({ name: "Company Visit", params: { visitID: visit.id } });
    };

    return {
      router,
      searchText,
      splitters,
      newVisit,
    };
  },
};
</script>

<style scoped></style>
