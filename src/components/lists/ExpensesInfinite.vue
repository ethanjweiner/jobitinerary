<template>
  <SearchToolbar disableAdd title="Expenses" v-model="searchText" />
  <InfiniteList
    :key="searchText"
    :pushQuantity="6"
    :searchFilter="searchText"
    :dbRef="dbRef"
    orderByParam="date"
    type="list"
  >
    <template v-slot:item="itemProps">
      <ExpenseItem :expense="itemProps.item" :showDate="true" />
    </template>
  </InfiniteList>
</template>

<script lang="ts">
import { ref } from "@vue/reactivity";

import InfiniteList from "@/components/lists/InfiniteList.vue";
import ExpenseItem from "./items/ExpenseItem.vue";
import SearchToolbar from "@/components/inputs/SearchToolbar.vue";

export default {
  name: "Expenses Infinite",
  props: {
    dbRef: Object,
    title: String,
  },
  setup() {
    const searchText = ref<string>("");

    return {
      searchText,
    };
  },
  components: {
    InfiniteList,
    ExpenseItem,
    SearchToolbar,
  },
};
</script>

<style scoped>
ion-card-content {
  height: 80%;
  padding: 0;
}
</style>
