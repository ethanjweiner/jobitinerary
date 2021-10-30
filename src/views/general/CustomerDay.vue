<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary" v-if="state.day">
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title> {{ idToName(userID) }} on {{ date }} </ion-title>
        <ion-buttons :collapse="true" slot="end">
          <ion-button @click="toggleDaySettings(true, $event)">
            <ion-icon :icon="icons.ellipsisVertical"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-popover
      :is-open="popoverIsOpen"
      :translucent="true"
      :event="popoverEvent"
      @didDismiss="toggleDaySettings(false)"
    >
      <DayPopover
        @deleteDay="deleteDay"
        @changeDate="changeDate"
        type="customer"
        :currentDate="state.day.data.date"
      />
      <!-- Add Day Popover here -->
    </ion-popover>

    <Sections :sections="sections" v-if="state.day">
      <template v-slot:main>
        <DayMain v-model="state.day" :visits="state.visits" />
      </template>
      <template v-slot:visits>
        <DayVisits v-model="state.visits" />
      </template>
    </Sections>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonButton,
  IonButtons,
  IonBackButton,
  IonPopover,
} from "@ionic/vue";

import { reactive, ref } from "@vue/reactivity";
import {
  ellipsisVertical,
  trashOutline,
  documentTextOutline,
  homeOutline,
} from "ionicons/icons";

import { CustomerDay, Visit } from "@/types/units";
import { idToName, retrieveVisitsOnDate } from "@/helpers";
import store from "@/store";
import { watch } from "@vue/runtime-core";
import router from "@/router";

import DayMain from "@/components/forms/CustomerDayMain.vue";
import DayVisits from "@/components/lists/CustomerDayVisits.vue";
import DayPopover from "@/components/popovers/DayPopover.vue";
import Sections from "@/components/Sections.vue";
import { SectionsType } from "@/types/auxiliary";

interface State {
  day: CustomerDay | null;
  visits: Array<Visit>;
}

export default {
  name: "Customer Day",
  props: {
    userID: String,
    date: String,
  },
  setup(props: any) {
    const state = reactive<State>({
      day: null,
      visits: [],
    });

    // SETUP
    const sections = ref<SectionsType>([
      {
        name: "Main",
        icon: documentTextOutline,
        id: "main",
      },
      {
        name: "Visits",
        icon: homeOutline,
        id: "visits",
      },
    ]);

    const initialize = async () => {
      // Initialze Visits
      const day = new CustomerDay(
        props.date,
        store.state.companyID,
        props.userID
      );
      await day.init();
      state.day = day;

      state.visits = await retrieveVisitsOnDate(props.date, {
        customerID: props.userID,
      });
      watch(state.day.data, () => {
        if (state.day) state.day.save();
      });
    };

    initialize();

    // POPOVER
    const popoverIsOpen = ref(false);
    const popoverEvent = ref();
    const toggleDaySettings = (state: boolean, ev?: Event) => {
      popoverEvent.value = ev;
      popoverIsOpen.value = state;
    };

    // METHODS
    const deleteDay = async () => {
      if (state.day) {
        await state.day.delete();
        for (const visit of state.visits) {
          await visit.delete();
        }
      }

      router.push({ name: "Customer", params: { userID: props.userID } });
      popoverIsOpen.value = false;
    };

    const changeDate = async (date: string) => {
      if (state.day) {
        state.day = await state.day.changeDate(date);
        for (const visit of state.visits) {
          await visit.changeDate(date);
        }

        await router.push({
          name: "Customer Day",
          params: { employee: props.userID, date },
        });

        router.go(0);
      }
    };

    return {
      state,
      icons: {
        ellipsisVertical,
        trashOutline,
        documentTextOutline,
        homeOutline,
      },
      sections,
      deleteDay,
      changeDate,
      toggleDaySettings,
      popoverIsOpen,
      popoverEvent,
      idToName,
    };
  },
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonPage,
    IonIcon,
    IonButton,
    IonButtons,
    IonBackButton,
    IonPopover,
    DayPopover,
    DayMain,
    Sections,
    DayVisits,
  },
};
</script>

<style scoped>
ion-header {
  display: block;
}
</style>
