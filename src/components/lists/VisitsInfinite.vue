<template>
  <ion-card-header>
    <ion-card-title>
      Visits
      <AddButton @click="newVisit" />
    </ion-card-title>

    <ion-searchbar
      class="ion-text-start"
      v-model="searchText"
      placeholder="Search by customer, employee, date, etc."
    ></ion-searchbar>
  </ion-card-header>
  <ion-card-content>
    <InfiniteList
      :key="searchText"
      :splitters="splitters"
      :pushQuantity="8"
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
  </ion-card-content>
</template>

<script lang="ts">
import {
  IonCardHeader,
  IonSearchbar,
  IonCardTitle,
  IonCardContent,
} from "@ionic/vue";
import { ref } from "vue";
import router from "@/router";

import { VisitInterface } from "@/types/units";
import { Splitter } from "@/types/auxiliary";

import VisitItem from "./items/VisitItem.vue";
import AddButton from "../buttons/AddButton.vue";
import InfiniteList from "./InfiniteList.vue";
import { createVisit } from "@/db";

export default {
  name: "Visits",
  components: {
    VisitItem,
    IonCardHeader,
    IonSearchbar,
    IonCardTitle,
    AddButton,
    InfiniteList,
    IonCardContent,
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

<style scoped>
ion-card {
  height: 100%;
}

ion-card-header {
  border-bottom: 1px solid green;
}

ion-card-content {
  height: 80%;
  padding: 0;
}
.list-header {
  margin: 0;
  display: inline;
}
ion-searchbar {
  padding-left: 0;
  padding-bottom: 0;
}
</style>
