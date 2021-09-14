<template>
  <ion-list>
    <ion-item-group v-if="futureVisits.length">
      <ion-item-divider>
        <ion-label>Future Visits</ion-label>
      </ion-item-divider>
      <JobVisitItem
        v-for="(visit, index) in futureVisits"
        :key="visit.id"
        @deleteVisit="deleteVisit(index)"
        @openVisit="$emit('openVisit', visit.id)"
        :visit="visit"
        @updateVisit="(newVisit) => (state.visits[index] = newVisit)"
      />
    </ion-item-group>

    <ion-item-group v-if="pastVisits.length">
      <ion-item-divider>
        <ion-label>Past Visits</ion-label>
      </ion-item-divider>
      <JobVisitItem
        v-for="(visit, index) in pastVisits"
        :key="visit.id"
        @deleteVisit="deleteVisit(index)"
        @openVisit="$emit('openVisit', visit.id)"
        :visit="visit"
        @updateVisit="(newVisit) => (state.visits[index] = newVisit)"
      />
    </ion-item-group>

    <ion-item button color="primary" @click="addVisit">
      <ion-icon :icon="add"></ion-icon>
      <ion-label>Add Visit</ion-label>
    </ion-item>
  </ion-list>
</template>

<script lang="ts">
import {
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonItemGroup,
  IonItemDivider,
} from "@ionic/vue";
import JobVisitItem from "./items/JobVisitItem.vue";
import { add } from "ionicons/icons";
import { computed, reactive } from "@vue/reactivity";
import { defineComponent } from "@vue/runtime-core";
import router from "@/router";
import { emptyVisit, sampleVisit, Visit } from "@/types";

export default defineComponent({
  name: "Day Visits",
  props: ["visits", "date"],
  emits: ["openVisit", "addVisit"],
  components: {
    IonIcon,
    IonItem,
    IonLabel,
    JobVisitItem,
    IonList,
    IonItemGroup,
    IonItemDivider,
  },
  setup(props: any, { emit }: { emit: any }) {
    // RETRIEVE & UPDATE VISITS LOCALLY ON THIS COMPONENT
    const state = reactive({
      // RETRIEVE VISITS ALREADY EXISTING ON THIS DATE/EMPLOYEE
      visits: [sampleVisit, sampleVisit],
    });

    const futureVisits = computed(() => {
      return state.visits.filter(
        (visit: Visit) => new Date(visit.date) > new Date()
      );
    });

    const pastVisits = computed(() => {
      return state.visits.filter(
        (visit: Visit) => new Date(visit.date) <= new Date()
      );
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
      futureVisits,
      pastVisits,
    };
  },
});
</script>

<style></style>
