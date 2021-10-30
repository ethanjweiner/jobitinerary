<template>
  <SearchToolbar :addAction="addVisit" title="Visits" disableSearch />
  <ion-grid>
    <ion-row v-if="state.visits" class="ion-justify-content-around">
      <ion-col size="12" size-lg="8">
        <ion-card>
          <ion-reorder-group
            @ionItemReorder="reorderVisits($event)"
            disabled="false"
          >
            <DayVisitItem
              v-for="(visit, index) in state.visits"
              :key="visit.id"
              v-model="state.visits[index]"
              @deleteVisit="deleteVisit(visit)"
            />

            <ion-item button color="tertiary" @click="addVisit">
              <ion-icon :icon="add"></ion-icon>
              <ion-label>Add Visit</ion-label>
            </ion-item>
          </ion-reorder-group>
        </ion-card>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts">
import {
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonReorderGroup,
  IonIcon,
  IonItem,
  IonLabel,
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import router from "@/router";

import { add } from "ionicons/icons";

import SearchToolbar from "@/components/inputs/SearchToolbar.vue";
import DayVisitItem from "./items/DayVisitItem.vue";
import { Visit } from "@/types/units";
import { createVisit } from "@/db";

export default {
  name: "Day Visits",
  props: {
    modelValue: Array,
    employeeID: String,
    date: String,
  },
  emits: ["addVisit", "update:modelValue"],

  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      // RETRIEVE VISITS USING DBREF
      visits: props.modelValue,
    });

    const deleteVisit = async (visit: Visit) => {
      // DELETE VISIT FROM DATABASE
      await visit.delete();
      state.visits = state.visits.filter(
        (_visit: Visit) => visit.id != _visit.id
      );
      emit("update:modelValue", state.visits);
    };

    const addVisit = async () => {
      // ADD VISIT TO DATABASE
      const visit = await createVisit({
        employeeID: props.employeeID,
        date: props.date,
      });
      state.visits.push(visit);
      // OPEN VISIT WITH CREATED ID
      emit("update:modelValue", state.visits);
    };

    const reorderVisits = (ev: CustomEvent) => {
      ev.detail.complete();
      const temp = state.visits[ev.detail.from];
      state.visits[ev.detail.from] = state.visits[ev.detail.to];
      state.visits[ev.detail.to] = temp;
      emit("update:modelValue", state.visits);
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
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonReorderGroup,
    IonIcon,
    IonItem,
    IonLabel,
    DayVisitItem,
    SearchToolbar,
  },
};
</script>

<style scoped>
ion-grid {
  --ion-grid-padding-xs: 5px;
  --ion-grid-padding-sm: 5px;
  --ion-grid-padding-md: 5px;
  --ion-grid-padding-lg: 8px;
  --ion-grid-padding-xl: 8px;
  --ion-grid-column-padding-xs: 2px;
  --ion-grid-column-padding-sm: 2px;
  --ion-grid-column-padding-md: 4px;
  --ion-grid-column-padding-lg: 6px;
  --ion-grid-column-padding-xl: 6px;
}
</style>
