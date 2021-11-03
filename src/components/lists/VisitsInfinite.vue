<template>
  <SearchToolbar :addAction="newVisit" title="Visits" v-model="searchText" />
  <InfiniteList
    :key="searchText"
    :splitters="splitters"
    :pushQuantity="10"
    :dbRef="dbRef"
    orderByParam="date"
    :searchFilter="searchText"
    :sizes="sizes"
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
import SearchToolbar from "../inputs/SearchToolbar.vue";

export default {
  name: "Visits",
  components: {
    VisitItem,
    InfiniteList,
    SearchToolbar,
  },
  props: {
    dbRef: Object, // Determine database query in parent component
  },
  setup() {
    // Temporary: Add a visit to the database

    const searchText = ref<string>("");

    const splitters = ref<Array<Splitter>>([
      {
        name: "Scheduled",
        filter: (item: VisitInterface) => new Date(item.date) >= new Date(),
      },
      {
        name: "Past",
        filter: (item: VisitInterface) => new Date(item.date) < new Date(),
      },
    ]);

    const sizes = {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 6,
      xl: 6,
    };

    const newVisit = async () => {
      const visit = await createVisit();
      router.push({ name: "Company Visit", params: { visitID: visit.id } });
    };

    return {
      router,
      searchText,
      splitters,
      newVisit,
      sizes,
    };
  },
};
</script>

<style scoped></style>
