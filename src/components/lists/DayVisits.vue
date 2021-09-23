<template>
  <ion-reorder-group @ionItemReorder="reorderVisits($event)" disabled="false">
    <DayVisitItem
      v-for="(visit, index) in state.visits"
      :key="visit.id"
      v-model="state.visits[index]"
      @deleteVisit="deleteVisit(index)"
      @openVisit="$emit('openVisit', visit.id)"
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
import { emptyVisit, sampleVisit1 } from "@/types";

export default defineComponent({
  name: "Day Visits",
  props: {
    dbRef: Object,
    date: String,
  },
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
      // RETRIEVE VISITS USING DBREF
      visits: [sampleVisit1, sampleVisit1],
    });

    const deleteVisit = (index: number) => {
      // DELETE VISIT FROM DATABASE
      state.visits.splice(index, 1);
    };

    const addVisit = () => {
      const visit = emptyVisit({ date: props.date });
      // ADD VISIT TO DATABASE
      state.visits.push(visit);
      // OPEN VISIT WITH CREATED ID
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
