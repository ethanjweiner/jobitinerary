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
        :sampleItem="sampleExpense"
        :searchParams="['name', 'date', 'cost']"
        :searchFilter="searchText"
      >
        <template v-slot:item="itemProps">
          <Expense
            v-model="itemProps.item"
            :showDate="true"
            :hideControls="true"
            @deleteExpense="deleteExpense(itemProps.item.id)"
          />
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

import { sampleExpense } from "@/types/auxiliary";

import InfiniteList from "@/components/lists/InfiniteList.vue";
import Expense from "./items/Expense.vue";

export default {
  name: "Expenses Infinite",
  props: {
    dbRef: Object,
    title: String,
  },
  setup() {
    const searchText = ref<string>("");

    const deleteExpense = (expenseID: string) => {
      // DELETE EXPENSE FROM DATABASE
      console.log("Deleting expense ", expenseID);
      // Rerender the Infinite List component...
      searchText.value = " ";
      searchText.value = "";
    };

    return {
      searchText,
      sampleExpense,
      deleteExpense,
    };
  },
  components: {
    IonCardHeader,
    IonCardTitle,
    IonSearchbar,
    IonCardContent,
    InfiniteList,
    Expense,
  },
};
</script>

<style scoped>
ion-card-content {
  height: 80%;
  padding: 0;
}
</style>
