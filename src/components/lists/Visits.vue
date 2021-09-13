<template>
  <div style="height: 100%;">
    <ion-card-header>
      <div class="ion-text-center">
        <ion-badge color="danger" style="margin-right: 5px;">{{
          numUnreadVisits
        }}</ion-badge>
        <h3 class="list-header">
          <ion-text color="dark">
            Recent Visits
          </ion-text>
        </h3>
        <ion-chip
          @click="
            router.push({
              name: 'Company Visit',
              params: { visitID: 'new' },
            })
          "
        >
          <ion-icon :icon="add"></ion-icon>
          <ion-label>Add New</ion-label>
        </ion-chip>
      </div>

      <ion-searchbar
        class="ion-text-start"
        v-model="searchText"
        placeholder="Search by customer, employee, date, etc."
      ></ion-searchbar>
    </ion-card-header>
    <ion-card-content>
      <ion-content>
        <ion-list>
          <ion-item-group v-if="futureVisits.length">
            <ion-item-divider>
              <ion-label>Future Visits</ion-label>
            </ion-item-divider>
            <VisitItem
              v-for="visit in futureVisits"
              :key="visit.id"
              :visit="visit"
              @click="
                router.push({
                  name: 'Company Visit',
                  params: { visitID: visit.id },
                })
              "
            />
          </ion-item-group>
          <ion-item-group v-if="pastVisits.length">
            <ion-item-divider>
              <ion-label>Past Visits</ion-label>
            </ion-item-divider>
            <VisitItem
              v-for="visit in pastVisits"
              :key="visit.id"
              :visit="visit"
              @click="
                router.push({
                  name: 'Company Visit',
                  params: { visitID: visit.id },
                })
              "
            />
          </ion-item-group>
        </ion-list>

        <ion-infinite-scroll
          @ionInfinite="loadData($event)"
          threshold="100px"
          id="infinite-scroll"
        >
          <ion-infinite-scroll-content
            loading-spinner="bubbles"
            loading-text="Loading visits..."
          >
          </ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ion-content>
    </ion-card-content>
  </div>
</template>

<script lang="ts">
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonCardHeader,
  IonBadge,
  IonSearchbar,
  IonText,
  IonContent,
  IonCardContent,
  IonChip,
  IonLabel,
  IonIcon,
  IonItemGroup,
  IonItemDivider,
} from "@ionic/vue";

import VisitItem from "./items/VisitItem.vue";

import { Visit, sampleVisit } from "@/types";

import { computed, reactive, ref, toRefs } from "vue";

import { includeItemInSearch } from "@/helpers";

import { add } from "ionicons/icons";

import router from "@/router";

import store from "@/store";

export default {
  name: "Visits",
  components: {
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonList,
    VisitItem,
    IonCardHeader,
    IonBadge,
    IonSearchbar,
    IonText,
    IonContent,
    IonCardContent,
    IonChip,
    IonLabel,
    IonIcon,
    IonItemGroup,
    IonItemDivider,
  },
  setup() {
    const state = reactive({
      searchText: "",
    });
    // Retrieve visits for given employee OR
    // Supply the visits as a prop
    const visits = ref<Array<Visit>>([]);

    const numUnreadVisits = computed(() => {
      return visits.value.reduce((numUnreadVisitsSoFar, visit) => {
        if (!visit.readByCompany) return ++numUnreadVisitsSoFar;
        return numUnreadVisitsSoFar;
      }, 0);
    });

    const filteredVisits = computed(() => {
      if (state.searchText == "") return visits.value;
      return visits.value.filter((visit) =>
        includeItemInSearch(visit, state.searchText, [
          "employeeName",
          "customerName",
          "date",
        ])
      );
    });

    const futureVisits = computed(() => {
      return filteredVisits.value.filter(
        (visit) => new Date(visit.date) > new Date()
      );
    });

    const pastVisits = computed(() => {
      return filteredVisits.value.filter(
        (visit) => new Date(visit.date) <= new Date()
      );
    });

    const pushData = () => {
      const max = visits.value.length + 5;
      const min = max - 5;
      for (let i = min; i < max; i++) {
        visits.value.push(sampleVisit);
      }
    };

    const loadData = (ev: any) => {
      setTimeout(() => {
        pushData();
        console.log("Loaded data");
        ev.target.complete();

        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (visits.value.length == 1000) {
          ev.target.disabled = true;
        }
      }, 500);
    };

    pushData();

    return {
      loadData,
      visits,
      numUnreadVisits,
      futureVisits,
      pastVisits,
      ...toRefs(state),
      add,
      router,
      store,
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
