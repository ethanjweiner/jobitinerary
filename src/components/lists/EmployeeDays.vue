<template>
  <ion-card-header>
    <div class="ion-text-center">
      <h3 class="list-header">
        <ion-text color="dark">
          Dates
        </ion-text>
      </h3>
      <ion-chip
        @click="router.push({ name: 'New Day', params: { employeeName } })"
      >
        <ion-icon :icon="add"></ion-icon>
        <ion-label>Add New</ion-label>
      </ion-chip>
    </div>
    <ion-note style="margin-top: 5px;">Dates worked & dates scheduled</ion-note>
    <ion-item>
      <ion-input
        type="date"
        v-model="searchDate"
        placeholder="Search by date"
      ></ion-input>
    </ion-item>
  </ion-card-header>
  <ion-card-content>
    <ion-content>
      <ion-list>
        <DayItem
          v-for="(day, index) in filteredDays"
          :key="index"
          :day="day"
          @click="
            router.push({
              name: 'Employee Day',
              params: { username: day.employeeName, date: day.date },
            })
          "
        />
      </ion-list>

      <ion-infinite-scroll
        @ionInfinite="loadData($event)"
        threshold="100px"
        id="infinite-scroll"
      >
        <ion-infinite-scroll-content
          loading-spinner="bubbles"
          loading-text="Loading days..."
        >
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-card-content>
</template>

<script lang="ts">
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonCardHeader,
  IonInput,
  IonText,
  IonContent,
  IonCardContent,
  IonItem,
  IonChip,
  IonLabel,
  IonIcon,
  IonNote,
} from "@ionic/vue";

import DayItem from "./items/DayItem.vue";

import { computed, ref } from "vue";

import date from "date-and-time";

import { add } from "ionicons/icons";
import router from "@/router";
import { Day, sampleDay } from "@/types";

export default {
  name: "Employee Days",
  components: {
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonList,
    DayItem,
    IonCardHeader,
    IonInput,
    IonText,
    IonContent,
    IonCardContent,
    IonItem,
    IonChip,
    IonLabel,
    IonIcon,
    IonNote,
  },
  props: {
    employeeName: String,
  },
  setup() {
    const searchDate = ref<string>("");
    // Retrieve dates in which the given employee worked
    const days = ref<Array<Day>>([]);

    const filteredDays = computed(() => {
      if (searchDate.value)
        return days.value.filter(
          (day) =>
            date.format(new Date(day.date), "YYYY-MM-DD") == searchDate.value
        );
      return days.value;
    });

    const pushData = () => {
      const max = days.value.length + 5;
      const min = max - 5;
      for (let i = min; i < max; i++) {
        days.value.push(sampleDay);
      }
    };

    const loadData = (ev: any) => {
      setTimeout(() => {
        pushData();
        console.log("Loaded data");
        ev.target.complete();

        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (days.value.length == 1000) {
          ev.target.disabled = true;
        }
      }, 500);
    };

    pushData();

    return {
      loadData,
      days,
      filteredDays,
      searchDate,
      add,
      router,
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
ion-input {
  padding-left: 0;
  padding-bottom: 0;
}
</style>
