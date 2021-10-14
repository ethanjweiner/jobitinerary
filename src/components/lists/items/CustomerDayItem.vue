<template>
  <ion-item
    @click="
      router.push({
        name: 'Customer Day',
        params: {
          username: state.day.data.customerName,
          date: state.day.data.date,
        },
      })
    "
  >
    <div>
      <ion-label>
        <ion-text>
          {{ state.day.data.date }}
        </ion-text>
      </ion-label>
    </div>
  </ion-item>
</template>

<script lang="ts">
import { IonItem, IonLabel, IonText } from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import router from "@/router";

import { CustomerDay, Visit } from "@/types/work_units";
import { retrieveVisitsOnDay } from "@/helpers";

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
      // Initialze Visits
      state.visits = await retrieveVisitsOnDay(props.date, {
        customerName: props.day.customerName,
      });
    };

    initialize();

    return { router, state };
  },
  components: {
    IonItem,
    IonLabel,
    IonText,
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
