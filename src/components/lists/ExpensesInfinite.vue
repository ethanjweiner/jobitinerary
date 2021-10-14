<template>
  <div style="height: 100%;">
    <ion-card-header>
      <ion-card-title>
        {{ title }}
      </ion-card-title>
      <ion-searchbar
        class="ion-text-start"
        v-model="searchText"
        placeholder="Search by expense name, date, or cost"
      ></ion-searchbar>
    </ion-card-header>
    <ion-card-content>
      <InfiniteList
        :key="searchText"
        :pushQuantity="6"
        :searchFilter="searchText"
        :dbRef="dbRef"
        orderByParam="date"
      >
        <!-- Task: Supply an expense object (rather than document data) to the Expense component -->
        <template v-slot:item="itemProps">
          <ExpenseItem :expense="itemProps.item" :showDate="true" />
        </template>
      </InfiniteList>
    </ion-card-content>
  </div>
</template>

<script lang="ts">
import {
  IonCardHeader,
  IonCardTitle,
  IonSearchbar,
  IonCardContent,
} from "@ionic/vue";
import { ref } from "@vue/reactivity";

import InfiniteList from "@/components/lists/InfiniteList.vue";
import ExpenseItem from "./items/ExpenseItem.vue";

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
    IonCardHeader,
    IonCardTitle,
    IonSearchbar,
    IonCardContent,
    InfiniteList,
    ExpenseItem,
  },
};
</script>

<style scoped>
ion-card-content {
  height: 80%;
  padding: 0;
}
</style>
