<template>
  <SearchToolbar :addAction="addVisit" title="Visits" disableSearch />
  <ion-grid>
    <ion-row v-if="state.visits" class="ion-justify-content-around">
      <ion-col
        size-xs="12"
        size-sm="12"
        size-md="12"
        size-lg="6"
        size-xl="6"
        v-for="(visit, index) in state.visits"
        :key="visit.id"
      >
        <ion-card>
          <ion-toolbar color="tertiary">
            <ion-title v-if="visit.data.employeeID">
              Visit by {{ idToName(visit.data.employeeID) }}
            </ion-title>
            <ion-buttons slot="end">
              <ion-button @click="deleteVisit(visit)">
                <ion-icon :icon="icons.trashOutline"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>

          <ion-card-content v-if="state.visits.length">
            <VisitInline
              v-model="state.visits[index]"
              :hideCustomerSelect="true"
              :separateByDefault="true"
            />
          </ion-card-content>
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
  IonCardContent,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import VisitInline from "@/components/units/Visit.vue";
import { reactive } from "@vue/reactivity";
import { Visit } from "@/types/units";
import { createVisit } from "@/db";
import { idToName } from "@/helpers";

import { trashOutline } from "ionicons/icons";
import SearchToolbar from "../inputs/SearchToolbar.vue";

export default {
  name: "Customer Day Visits",
  props: {
    modelValue: Array,
  },
  emits: ["update:modelValue"],
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      visits: props.modelValue,
    });

    const addVisit = async () => {
      const visit = await createVisit({
        customerID: props.userID,
        date: props.date,
      });

      state.visits.unshift(visit);
    };

    const deleteVisit = async (visit: Visit) => {
      // DELETE VISIT FROM DATABASE
      await visit.delete();
      state.visits = state.visits.filter(
        (_visit: Visit) => visit.id != _visit.id
      );
      emit("update:modelValue", state.visits);
    };

    return { state, addVisit, deleteVisit, idToName, icons: { trashOutline } };
  },
  components: {
    VisitInline,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonTitle,
    IonButton,
    IonIcon,
    SearchToolbar,
    IonToolbar,
    IonButtons,
  },
};
</script>

<style scoped>
ion-card-header {
  --background: var(--ion-color-tertiary);
}
ion-card-content {
  padding: 0 !important;
}
</style>
