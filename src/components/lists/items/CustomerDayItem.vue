<template>
  <ion-item
    @click="
      router.push({
        name: 'Customer Day',
        params: { username: state.day.customerName, date: state.day.date },
      })
    "
  >
    <div>
      <ion-label>
        <ion-text>
          <!-- Add more information about day here (e.g. total hours worked) -->
          {{ state.day.date }}
        </ion-text>
      </ion-label>
      <ion-note> {{ totalHours }} hours worked total </ion-note>
    </div>
  </ion-item>
</template>

<script lang="ts">
import { IonItem, IonLabel, IonText, IonNote } from "@ionic/vue";
import { computed, reactive } from "@vue/reactivity";
import { CustomerDay, Visit } from "@/types/work_units";
import { retrieveVisitsOnDay } from "@/helpers";
import router from "@/router";

interface State {
  day: CustomerDay;
}

export default {
  name: "Customer Day Item",
  props: {
    day: Object,
  },
  setup(props: any) {
    const state = reactive<State>({
      day: props.day,
    });

    retrieveVisitsOnDay(state.day).then(
      (visits) => (state.day.visits = visits)
    );

    const totalHours = computed(() => {
      if (props.day.visits) {
        return props.day.visits.reduce(
          (hoursAcc: number, visit: Visit) => hoursAcc + visit.time.hours,
          0
        );
      } else return 0;
    });
    return { router, state, totalHours };
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
