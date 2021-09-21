<template>
  <ion-list>
    <ion-item-group v-if="futureVisits.length">
      <ion-item-divider>
        <ion-label>Future Visits</ion-label>
      </ion-item-divider>
      <VisitItem
        v-for="(visit, index) in futureVisits"
        :key="visit.id"
        :visit="visit"
        @deleteVisit="deleteVisit(index)"
        @openVisit="$emit('openVisit', visit)"
        type="job"
      />
    </ion-item-group>

    <ion-item-group v-if="pastVisits.length">
      <ion-item-divider>
        <ion-label>Past Visits</ion-label>
      </ion-item-divider>
      <VisitItem
        v-for="(visit, index) in pastVisits"
        :key="visit.id"
        :visit="visit"
        @deleteVisit="deleteVisit(index)"
        @openVisit="$emit('openVisit', visit)"
        type="job"
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
import { add } from "ionicons/icons";
import { computed, reactive } from "@vue/reactivity";
import { defineComponent, watch } from "@vue/runtime-core";
import router from "@/router";
import { emptyVisit, Visit } from "@/types";
import { dateToString } from "@/helpers";
import VisitItem from "./items/VisitItem.vue";

export default defineComponent({
  name: "Job Visits",
  props: {
    modelValue: Array,
  },
  emits: ["update:modelValue", "openVisit"],
  components: {
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonItemGroup,
    IonItemDivider,
    VisitItem,
  },
  setup(props: any, { emit }: { emit: any }) {
    // RETRIEVE & UPDATE VISITS LOCALLY ON THIS COMPONENT
    const state = reactive({
      // RETRIEVE VISITS ALREADY EXISTING ON THIS DATE/EMPLOYEE
      visits: [...props.modelValue],
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
      // CREATE NEW VISIT AND ADD TO DATABASE
      const newVisit = emptyVisit(dateToString(new Date()));

      state.visits.push(newVisit);
      // PASS THIS VISIT INTO THE EMIT
      emit("openVisit", newVisit);
    };

    watch(state.visits, (newVisits) => {
      emit("update:modelValue", newVisits);
    });

    return {
      state,
      add,
      router,
      deleteVisit,
      addVisit,
      futureVisits,
      pastVisits,
    };
  },
});
</script>

<style></style>
