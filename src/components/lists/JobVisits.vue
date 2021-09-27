<template>
  <div>
    <ion-list>
      <ion-item-group v-if="scheduledVisits.length">
        <ion-item-divider>
          <ion-label>Future Visits</ion-label>
        </ion-item-divider>
        <!-- Add a database reference -->
        <VisitItem
          v-for="visit in scheduledVisits"
          :key="visit.id"
          :visit="visit"
          :itemAction="(state) => (state.modalIsOpen = true)"
          @deleteVisit="deleteVisit(visit.id)"
          type="job"
        />
      </ion-item-group>

      <ion-item-group v-if="pastVisits.length">
        <ion-item-divider>
          <ion-label>Past Visits</ion-label>
        </ion-item-divider>
        <!-- Add a database reference -->
        <VisitItem
          v-for="visit in pastVisits"
          :key="visit.id"
          :visit="visit"
          :itemAction="(state) => (state.modalIsOpen = true)"
          @deleteVisit="deleteVisit(visit.id)"
          type="job"
        />
      </ion-item-group>

      <ion-item button color="primary" @click="addVisit">
        <ion-icon :icon="add"></ion-icon>
        <ion-label>Add Visit</ion-label>
      </ion-item>
    </ion-list>
  </div>
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
import { defineComponent } from "@vue/runtime-core";
import router from "@/router";
import { emptyVisit, sampleVisit1, Visit } from "@/types/work_units";
import { Splitter } from "@/types/auxiliary";
import { dateToString } from "@/helpers";

import VisitItem from "./items/VisitItem.vue";

export default defineComponent({
  name: "Job Visits",
  props: {
    dbRef: String,
  },
  components: {
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonItemGroup,
    IonItemDivider,
    VisitItem,
  },
  setup() {
    // RETRIEVE & UPDATE VISITS LOCALLY ON THIS COMPONENT
    const state = reactive({
      // RETRIEVE VISITS using the db ref
      visits: [sampleVisit1, sampleVisit1],
    });

    // Separate visits with splitters

    const splitters: Array<Splitter> = [
      {
        name: "Scheduled Visits",
        filter: (item: Visit) => new Date(item.date) >= new Date(),
      },
      {
        name: "Past Visits",
        filter: (item: Visit) => new Date(item.date) < new Date(),
      },
    ];

    const scheduledVisits = computed(() =>
      state.visits.filter(splitters[0].filter)
    );
    const pastVisits = computed(() => state.visits.filter(splitters[1].filter));

    const deleteVisit = (id: string) => {
      // DELETE VISIT FROM DATABASE

      // DELETE VISIT LOCALLY
      state.visits = state.visits.filter((visit) => visit.id != id);
    };

    const addVisit = () => {
      // CREATE NEW VISIT AND ADD TO DATABASE
      const newVisit = emptyVisit({ date: dateToString(new Date()) });

      // Refresh the page
      state.visits.push(newVisit);
    };

    return {
      state,
      add,
      router,
      deleteVisit,
      addVisit,
      scheduledVisits,
      pastVisits,
    };
  },
});
</script>

<style></style>
