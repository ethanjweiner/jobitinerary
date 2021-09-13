<template>
  <ion-reorder-group @ionItemReorder="reorderVisits($event)" disabled="false">
    <DayVisitItem
      v-for="(visit, index) in state.visits"
      :key="visit.id"
      @deleteVisit="deleteVisit(index)"
      @openVisit="$emit('openVisit', visit.id)"
      :visit="visit"
      @updateVisit="(newVisit) => (state.visits[index] = newVisit)"
    />
    <ion-item button color="primary" @click="addVisit">
      <ion-icon :icon="add"></ion-icon>
      <ion-label>Add Visit</ion-label>
    </ion-item>
  </ion-reorder-group>
</template>

<script lang="ts">
import { IonReorderGroup, IonIcon, IonItem, IonLabel } from "@ionic/vue";
import DayVisitItem from "./items/DayVisitItem.vue";
import { add } from "ionicons/icons";
import { reactive } from "@vue/reactivity";
import { defineComponent } from "@vue/runtime-core";
import router from "@/router";
import { emptyVisit, sampleVisit } from "@/types";

export default defineComponent({
  name: "Day Visits",
  props: ["visits", "date"],
  emits: ["openVisit", "addVisit"],
  components: {
    IonReorderGroup,
    IonIcon,
    IonItem,
    IonLabel,
    DayVisitItem,
  },
  setup(props: any, { emit }: { emit: any }) {
    // RETRIEVE & UPDATE VISITS LOCALLY ON THIS COMPONENT
    const state = reactive({
      // RETRIEVE VISITS ALREADY EXISTING ON THIS DATE/EMPLOYEE
      visits: [sampleVisit, sampleVisit],
    });

    const deleteVisit = (index: number) => {
      // Delete the visit from the database too...
      state.visits.splice(index, 1);
    };

    const addVisit = () => {
      // Create a new visit & add to database
      state.visits.push(emptyVisit(props.date));
      emit("openVisit", "new_visit_id");
    };

    const reorderVisits = (ev: CustomEvent) => {
      ev.detail.complete();
      const temp = state.visits[ev.detail.from];
      state.visits[ev.detail.from] = state.visits[ev.detail.to];
      state.visits[ev.detail.to] = temp;
    };

    return {
      state,
      add,
      router,
      deleteVisit,
      reorderVisits,
      addVisit,
    };
  },
});
</script>

<style></style>
