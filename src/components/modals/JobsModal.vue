<template>
  <div id="jobs-modal">
    <SearchToolbar
      :disableAdd="true"
      title="Jobs"
      v-model="searchText"
      :modalClose="true"
      @close="$emit('close')"
    />

    <!-- PASS A DATABASE REFERENCE TO ALL JOBS UNDER THE SELECTED CUSTOMER -->
    <ion-content>
      <InfiniteList
        type="list"
        :key="searchText"
        :splitters="splitters"
        :searchFilter="searchText"
        :dbRef="dbRef"
        :pushQuantity="config.constants.PUSH_QUANTITY"
        orderByParam="startDate"
      >
        <template v-slot:item="itemProps">
          <JobItem
            class="job-item"
            :key="itemProps.item.id"
            :job="itemProps.item"
            :showCustomer="true"
            @click="$emit('jobSelected', itemProps.item)"
          />
        </template>
      </InfiniteList>
    </ion-content>
  </div>
</template>

<script lang="ts">
import { IonContent } from "@ionic/vue";
import { close } from "ionicons/icons";
import { defineComponent, ref } from "vue";

import SearchToolbar from "@/components/inputs/SearchToolbar.vue";
import JobItem from "@/components/lists/items/JobItem.vue";
import config from "@/config/config";
import { Splitter } from "@/types/auxiliary";
import { JobInterface } from "@/types/units";

import InfiniteList from "../lists/InfiniteList.vue";

export default defineComponent({
  name: "Jobs",
  components: {
    JobItem,
    InfiniteList,
    IonContent,
    SearchToolbar,
  },
  props: {
    dbRef: Object,
  },
  emits: ["close", "jobSelected"],
  setup() {
    const searchText = ref("");

    const splitters = ref<Array<Splitter>>([
      {
        name: "Unscheduled Jobs",
        filter: (item: JobInterface) => !item.startDate,
      },
      {
        name: "Scheduled Jobs",
        filter: (item: JobInterface) => new Date(item.startDate) > new Date(),
      },
      {
        name: "Current Jobs",
        filter: (item: JobInterface) =>
          new Date(item.startDate) <= new Date() &&
          new Date(item.endDate) >= new Date(),
      },
      {
        name: "Past Jobs",
        filter: (item: JobInterface) => new Date(item.endDate) < new Date(),
      },
    ]);

    return {
      searchText,
      splitters,
      icons: { close },
      config,
    };
  },
});
</script>

<style scoped>
.job-item {
  cursor: pointer;
}
#jobs-modal {
  height: calc(100% - 80px);
}
</style>
