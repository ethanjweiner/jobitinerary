<template>
  <SearchToolbar
    :addAction="addVisit"
    title="Visits for the Job"
    disableSearch
  />
  <List :splitters="splitters" :items="state.visits.map((visit) => visit.data)">
    <template v-slot:item="itemProps">
      <VisitItem
        :visit="itemProps.item"
        :itemAction="(state) => (state.modalIsOpen = true)"
        @detachVisit="detachVisit"
        @deleteVisit="deleteVisit"
      />
    </template>
  </List>
</template>

<script lang="ts">
import { add } from "ionicons/icons";
import { reactive, ref } from "@vue/reactivity";
import { defineComponent } from "@vue/runtime-core";
import router from "@/router";
import { Visit, VisitInterface } from "@/types/units";
import { Splitter } from "@/types/auxiliary";

import VisitItem from "./items/VisitItem.vue";
import { createVisit } from "@/db";
import List from "@/components/lists/List.vue";
import SearchToolbar from "@/components/inputs/SearchToolbar.vue";

export default defineComponent({
  name: "Job Visits",
  props: {
    modelValue: Array,
    job: Object,
  },
  components: {
    VisitItem,
    List,
    SearchToolbar,
  },
  emits: ["update:modelValue"],
  setup(props: any, { emit }: { emit: any }) {
    // RETRIEVE & UPDATE VISITS LOCALLY ON THIS COMPONENT
    const state = reactive({
      // RETRIEVE VISITS using the db ref
      visits: props.modelValue,
    });

    // Separate visits with splitters

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

    const addVisit = async () => {
      // CREATE NEW VISIT AND ADD TO DATABASE
      const visit = await createVisit({
        jobID: props.job.id,
        customerID: props.job.data.customerID,
      });

      state.visits.push(visit);
      emit("update:modelValue", state.visits);
      // Open modal associated with visit
    };

    const removeVisit = (visit: Visit) => {
      state.visits = state.visits.filter(
        (_visit: Visit) => visit.id != _visit.id
      );
      emit("update:modelValue", state.visits);
    };

    const detachVisit = async (visitID: string) => {
      // DELETE VISIT FROM DATABASE
      const visit = state.visits.find(
        (visit: Visit) => visit.data.id == visitID
      );
      visit.data.jobID = "";
      await visit.save();
      removeVisit(visit);
    };

    const deleteVisit = async (visitID: string) => {
      const visit = state.visits.find(
        (visit: Visit) => visit.data.id == visitID
      );
      await visit.delete();
      removeVisit(visit);
    };

    return {
      state,
      add,
      router,
      detachVisit,
      deleteVisit,
      addVisit,
      splitters,
    };
  },
});
</script>

<style></style>
