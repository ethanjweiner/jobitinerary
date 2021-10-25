<template>
  <ion-item
    @click="
      router.push({
        name: 'Customer Day',
        params: {
          userID: state.day.customerID,
          date: state.day.date,
        },
      })
    "
  >
    <div>
      <ion-label>
        <ion-text>
          {{ state.day.date }}
        </ion-text>
      </ion-label>
      <ion-note v-if="propertyHours">
        {{ propertyHours }} total hours on property
      </ion-note>
    </div>
  </ion-item>
</template>

<script lang="ts">
import { IonItem, IonLabel, IonText, IonNote } from "@ionic/vue";
import { computed, reactive } from "@vue/reactivity";
import router from "@/router";

import { CustomerDay, Visit } from "@/types/units";
import { retrieveVisitsOnDate } from "@/helpers";

interface State {
  day: CustomerDay;
  visits: Array<Visit>;
}

export default {
  name: "Customer Day Item",
  props: {
    day: Object,
  },
  setup(props: any) {
    const state = reactive<State>({
      day: props.day,
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

    return { router, state, propertyHours };
  },
  components: {
    IonItem,
    IonLabel,
    IonText,
    IonNote,
  },
};
</script>

<style scoped>
ion-item {
  cursor: pointer;
}
div {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
