<template>
  <div style="height: 100%;">
    <ion-card-header>
      <ion-card-title>
        Visits
        <AddButton @click="createVisit" />
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
        :pushQuantity="10"
        :sampleItem="sampleVisit1"
        :searchParams="['customer', 'employee', 'date']"
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
  </div>
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

import { sampleVisit1, Visit } from "@/types/work_units";
import { Splitter } from "@/types/auxiliary";

import VisitItem from "./items/VisitItem.vue";
import AddButton from "../buttons/AddButton.vue";
import InfiniteList from "./InfiniteList.vue";

export default {
  name: "Visits",
  components: {
    VisitItem,
    IonCardHeader,
    IonSearchbar,
    IonCardTitle,
    IonCardContent,
    AddButton,
    InfiniteList,
  },
  props: {
    dbRef: Object, // Determine database query in parent component
  },
  setup() {
    const searchText = ref<string>("");

    const splitters = ref<Array<Splitter>>([
      {
        name: "Scheduled Visits",
        filter: (item: Visit) => new Date(item.date) >= new Date(),
      },
      {
        name: "Past Visits",
        filter: (item: Visit) => new Date(item.date) < new Date(),
      },
    ]);

    const createVisit = async () => {
      // CREATE VISIT
      // Route to the newly created visit
      router.push({
        name: "Company Visit",
        params: { visitID: "new" },
      });
    };

    return {
      router,
      searchText,
      splitters,
      sampleVisit1,
      createVisit,
    };
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
.list-header {
  margin: 0;
  display: inline;
}
ion-searchbar {
  padding-left: 0;
  padding-bottom: 0;
}
</style>
