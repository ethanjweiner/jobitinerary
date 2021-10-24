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
          :visit="visit.data"
          @detachVisit="detachVisit(visit)"
          @deleteVisit="deleteVisit(visit)"
          :itemAction="(state) => (state.modalIsOpen = true)"
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
          :visit="visit.data"
          @detachVisit="detachVisit(visit)"
          @deleteVisit="deleteVisit(visit)"
          :itemAction="(state) => (state.modalIsOpen = true)"
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
import { Visit } from "@/types/units";
import { Splitter } from "@/types/auxiliary";

import VisitItem from "./items/VisitItem.vue";
import { createVisit } from "@/db";

export default defineComponent({
  name: "Job Visits",
  props: {
    modelValue: Array,
    job: Object,
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
  emits: ["update:modelValue"],
  setup(props: any, { emit }: { emit: any }) {
    // RETRIEVE & UPDATE VISITS LOCALLY ON THIS COMPONENT
    const state = reactive({
      // RETRIEVE VISITS using the db ref
      visits: props.modelValue,
    });

    // Separate visits with splitters

    const splitters: Array<Splitter> = [
      {
        name: "Scheduled Visits",
        filter: (item: Visit) => new Date(item.data.date) >= new Date(),
      },
      {
        name: "Past Visits",
        filter: (item: Visit) => new Date(item.data.date) < new Date(),
      },
    ];

    const scheduledVisits = computed(() =>
      state.visits.filter(splitters[0].filter)
    );

    const pastVisits = computed(() => state.visits.filter(splitters[1].filter));

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

    const detachVisit = async (visit: Visit) => {
      // DELETE VISIT FROM DATABASE
      visit.data.jobID = "";
      await visit.save();
      removeVisit(visit);
    };

    const deleteVisit = async (visit: Visit) => {
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
      scheduledVisits,
      pastVisits,
    };
  },
});
</script>

<style></style>
