<template>
  <EmployeeDayComponent :preventChange="true" :id="today" v-if="state.day" />
  <ion-page v-else>
    <ion-content class="ion-padding ion-text-center">
      <ion-button
        class="ion-padding add-day"
        color="primary"
        @click="addToday"
        size="large"
      >
        <ion-icon :icon="icons.add"></ion-icon>
        Start Your Day! ({{ today }})
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonButton, IonContent, IonIcon, IonPage } from "@ionic/vue";
import { reactive, ref } from "@vue/reactivity";
import { add } from "ionicons/icons";

import { createEmployeeDay } from "@/db";
import { dateToString } from "@/helpers";
import store from "@/store";
import { EmployeeDay } from "@/types/units";

import EmployeeDayComponent from "../general/EmployeeDay.vue";

export default {
  name: "Today",
  components: {
    IonContent,
    IonPage,
    EmployeeDayComponent,
    IonIcon,
    IonButton,
  },
  setup() {
    const today = ref(dateToString(new Date()));

    const state = reactive({
      day: null,
    });

    const initialize = () => {
      const day = new EmployeeDay(
        today.value,
        store.state.companyID,
        store.state.user.data.id
      );
      day
        .init()
        .then((day) => {
          state.day = day;
        })
        .catch(() => {
          state.day = null;
        });
    };

    initialize();

    const addToday = async () => {
      if (store.state.user) {
        state.day = await createEmployeeDay(
          today.value,
          store.state.user.data.id
        );
      }
    };

    return { state, today, icons: { add }, addToday };
  },
};
</script>

<style scoped>
ion-button.add-day {
  margin-top: 30vh;
  font-size: 1.5em;
}
</style>
