<template>
  <ion-reorder-group @ionItemReorder="reorderVisits($event)" disabled="false">
    <DayVisitItem
      v-for="(visit, index) in state.visits"
      :key="visit.id"
      v-model="state.visits[index]"
      @deleteVisit="deleteVisit(visit)"
    />

    <ion-item button color="primary" @click="addVisit">
      <ion-icon :icon="add"></ion-icon>
      <ion-label>Add Visit</ion-label>
    </ion-item>
  </ion-reorder-group>
</template>

<script lang="ts">
import { IonReorderGroup, IonIcon, IonItem, IonLabel } from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import router from "@/router";

import { add } from "ionicons/icons";

import DayVisitItem from "./items/DayVisitItem.vue";
import { Visit } from "@/types/work_units";
import { createVisit } from "@/db";

export default {
  name: "Day Visits",
  props: {
    modelValue: Array,
    employeeName: String,
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
        employeeName: props.employeeName,
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
    IonReorderGroup,
    IonIcon,
    IonItem,
    IonLabel,
    DayVisitItem,
  },
};
</script>

<style></style>
