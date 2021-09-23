<template>
  <div id="jobs-modal">
    <ion-header>
      <ion-toolbar>
        <ion-title> Choose a Job</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('close')">
            <ion-icon :icon="icons.close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-searchbar
        v-model="searchText"
        placeholder="Search by job name, customer, start date, description, etc."
      ></ion-searchbar>
    </ion-header>
    <!-- PASS A DATABASE REFERENCE TO ALL JOBS UNDER THE SELECTED CUSTOMER -->
    <InfiniteList
      :key="searchText"
      :searchFilter="searchText"
      :sampleItem="sampleJob"
      :pushQuantity="10"
      :searchParams="['name', 'customer', 'startDate', 'description']"
    >
      <template v-slot:item="itemProps">
        <JobItem
          class="job-item"
          :key="itemProps.item.id"
          :job="itemProps.item"
          :showCustomer="true"
          @click="$emit('selectJob', itemProps.item)"
        />
      </template>
    </InfiniteList>
  </div>
</template>

<script lang="ts">
import {
  IonSearchbar,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonIcon,
  IonButton,
  IonButtons,
} from "@ionic/vue";
import { defineComponent, ref } from "vue";
import { close } from "ionicons/icons";

import { sampleJob } from "@/types";

import InfiniteList from "../lists/InfiniteList.vue";
import JobItem from "@/components/lists/items/JobItem.vue";

export default defineComponent({
  name: "Jobs",
  components: {
    JobItem,
    IonSearchbar,
    IonToolbar,
    IonTitle,
    IonHeader,
    IonIcon,
    IonButton,
    IonButtons,
    InfiniteList,
  },
  props: {
    dbRef: Object,
  },
  emits: ["close", "jobSelected"],
  setup() {
    const searchText = ref("");

    return {
      searchText,
      sampleJob,
      icons: { close },
    };
  },
});
</script>

<style scoped>
ion-searchbar {
  padding-left: 0;
  padding-bottom: 0;
}
.job-item {
  cursor: pointer;
}
ion-searchbar {
  padding: 0;
}
#jobs-modal {
  height: calc(100% - 105px);
}
</style>
