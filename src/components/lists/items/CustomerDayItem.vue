<template>
  <ion-card
    button
    @click="
      router.push({
        name: 'Customer Day',
        params: {
          userID: day.customerID,
          date: day.date,
        },
      })
    "
  >
    <ion-card-header>
      <ion-card-title>{{ day.date }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-card-subtitle>
        <ion-icon :icon="icons.cart"></ion-icon>
        {{ idToName(day.customerID) }}
      </ion-card-subtitle>
      <li v-if="propertyHours">
        <ion-icon :icon="icons.time"></ion-icon>

        {{ propertyHours }} total hours on property
      </li>
      <li v-if="employees.length">
        <ion-icon :icon="icons.hammer"></ion-icon>
        Employees Worked:
        <span v-for="id in employees" :key="id">
          {{ idToName(id) }}
        </span>
      </li>
    </ion-card-content>
  </ion-card>
</template>

<script lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonIcon,
} from "@ionic/vue";
import { computed, reactive } from "@vue/reactivity";
import router from "@/router";

import { Visit } from "@/types/units";
import { retrieveVisitsOnDate, idToName } from "@/helpers";

import { hammer, cart, time } from "ionicons/icons";

interface State {
  visits: Array<Visit>;
}

export default {
  name: "Customer Day Item",
  props: {
    day: Object,
  },
  setup(props: any) {
    const state = reactive<State>({
      visits: [],
    });

    const initialize = async () => {
      // Initialze Visits (for purposes of hour computing)
      state.visits = await retrieveVisitsOnDate(props.day.date, {
        customerID: props.day.customerID,
      });
    };

    initialize();

    const propertyHours = computed(() =>
      state.visits.reduce((hours, visit) => hours + visit.data.time.hours, 0)
    );

    const employees = computed(() => {
      const ids: Array<string> = [];
      state.visits.forEach((visit: Visit) => {
        if (visit.data.employeeID && !ids.includes(visit.data.employeeID))
          ids.push(visit.data.employeeID);
      });
      return ids;
    });

    return {
      icons: { hammer, cart, time },
      idToName,
      router,
      state,
      propertyHours,
      employees,
    };
  },
  components: {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonIcon,
  },
};
</script>

<style scoped></style>
