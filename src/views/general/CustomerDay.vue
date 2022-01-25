<template>
  <ion-page>
    <ion-header collapse="condense">
      <ion-toolbar class="unit-toolbar" color="primary" v-if="state.day">
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>
          <ion-text color="light">
            {{ idToName(userID) }}
          </ion-text>
        </ion-title>
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

    <Sections :title="date" :sections="sections" v-if="state.day">
      <template v-slot:main>
        <DayMain v-model="state.day" :visits="state.visits" />
      </template>
      <template v-slot:visits>
        <DayVisits v-model="state.visits" :userID="userID" :date="date" />
      </template>
    </Sections>
  </ion-page>
</template>

<script lang="ts">
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonPage,
  IonPopover,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { reactive, ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import {
  documentTextOutline,
  ellipsisVertical,
  homeOutline,
  trashOutline,
} from "ionicons/icons";

import DayMain from "@/components/forms/CustomerDayMain.vue";
import DayVisits from "@/components/lists/CustomerDayVisits.vue";
import DayPopover from "@/components/popovers/DayPopover.vue";
import Sections from "@/components/Sections.vue";
import { idToName, retrieveVisitsOnDate } from "@/helpers";
import router from "@/router";
import store from "@/store";
import { SectionsType } from "@/types/auxiliary";
import { CustomerDay, Visit } from "@/types/units";

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
    IonText,
  },
};
</script>

<style scoped>
ion-header {
  display: block;
}
</style>
