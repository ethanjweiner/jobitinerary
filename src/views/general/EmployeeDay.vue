<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="unit-toolbar" color="primary" v-if="state.day">
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>
          <ion-text color="light"> {{ idToName(userID) }} on {{ id }}</ion-text>
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
        @copyDay="copyDay"
        type="employee"
        :employeeID="userID"
        :key="state.day.data.date"
        :currentDate="state.day.data.date"
      />
      <!-- Add Day Popover here -->
    </ion-popover>

    <Sections :sections="sections" v-if="state.day">
      <template v-slot:main>
        <DayMain :key="state.day" v-model="state.day" />
      </template>
      <template v-slot:visits>
        <DayVisits
          :key="state.visits.length || state.day"
          v-model="state.visits"
          :employeeID="userID"
          :date="id"
        />
      </template>
      <template v-slot:expenses>
        <Expenses
          :key="state.day"
          v-model="state.expenses"
          :employeeID="userID"
          :date="id"
        />
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
import { reactive } from "@vue/reactivity";
import {
  documentTextOutline,
  ellipsisVertical,
  homeOutline,
  pricetagsOutline,
} from "ionicons/icons";
import { ref, watch } from "vue";

import DayMain from "@/components/forms/DayMain.vue";
import DayVisits from "@/components/lists/EmployeeDayVisits.vue";
import Expenses from "@/components/lists/Expenses.vue";
import DayPopover from "@/components/popovers/DayPopover.vue";
import Sections from "@/components/Sections.vue";
import { copyVisit } from "@/db";
import { idToName, nameToID, retrieveVisitsOnDate } from "@/helpers";
import { companiesCollection } from "@/main";
import { refreshOnRouteChange } from "@/mixins";
import router from "@/router";
import store from "@/store";
import { SectionsType } from "@/types/auxiliary";
import { EmployeeDay, Expense, Visit } from "@/types/units";

interface State {
  day: EmployeeDay | null;
  visits: Array<Visit>;
  expenses: Array<Expense>;
}
export default {
  name: "Employee Day",
  props: {
    userID: String,
    id: String,
  },
  setup(props: any) {
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
      {
        name: "Expenses",
        icon: pricetagsOutline,
        id: "expenses",
      },
    ]);

    const state = reactive<State>({
      day: null, // Use the default hourly rate
      visits: [],
      expenses: [],
    });

    // Retrieve the day
    const initialize = async (id: string, userID: string) => {
      // Initialize Day
      const day = new EmployeeDay(id, store.state.companyID, props.userID);
      await day.init();
      state.day = day;
      // Initialze Visits
      state.visits = await retrieveVisitsOnDate(id, {
        employeeID: userID,
      });
      // Initialize Expenses
      const expenseDocs = (
        await companiesCollection
          .doc(`${store.state.companyID}/employees/${userID}`)
          .collection("expenses")
          .where("data.date", "==", id)
          .orderBy("data.name")
          .get()
      ).docs;
      for (const doc of expenseDocs) {
        const expense = new Expense(doc.id, store.state.companyID, userID);
        await expense.init(doc.data().data);
        state.expenses.push(expense);
      }
      watch(state.day.data, () => {
        if (state.day) state.day.save();
      });
    };

    initialize(props.id, props.userID);

    const popoverIsOpen = ref(false);
    const popoverEvent = ref();
    const toggleDaySettings = (state: boolean, ev?: Event) => {
      popoverEvent.value = ev;
      popoverIsOpen.value = state;
    };

    const deleteDay = async () => {
      if (state.day) {
        await state.day.delete();

        for (const visit of state.visits) {
          await visit.delete();
        }
      }
      router.push({ name: "Employee", params: { userID: props.userID } });
      popoverIsOpen.value = false;

      store.setAlert({
        message: `The day was successfully deleted.`,
        color: "success",
      });
    };

    const changeDate = async (date: string) => {
      if (state.day) {
        state.day = await state.day.changeDate(date);
        for (const visit of state.visits) {
          await visit.changeDate(date);
        }
        for (const expense of state.expenses) {
          await expense.changeDate(date);
        }

        await router.push({
          name: "Employee Day",
          params: { employee: props.userID, date },
        });

        router.go(0);
      }

      store.setAlert({
        message: `Date changed to ${date}.`,
        color: "success",
      });
    };

    const copyVisits = async (employeeID: string) => {
      for (const visit of state.visits) {
        await copyVisit(visit, employeeID);
      }
    };

    const copyDay = async (employeeName: string) => {
      const employeeID = nameToID(employeeName);

      if (state.day) {
        const copiedDay = new EmployeeDay(
          state.day.data.date,
          state.day.data.companyID,
          employeeID
        );
        const copiedData = { ...state.day.data };
        copiedData.employeeID = employeeID;
        copiedData.readByCompany = false;
        copiedData.readByEmployee = false;
        copiedData.hourlyRate = null;
        await copiedDay.create(copiedData);
        await copyVisits(employeeID);
        popoverIsOpen.value = false;
        store.setAlert({
          message: `Your day was copied to ${employeeName}.`,
          color: "success",
        });
      }
    };

    // refreshOnRouteChange(initialize);

    return {
      store,
      state,
      sections,
      router,
      icons: {
        documentTextOutline,
        homeOutline,
        pricetagsOutline,
        ellipsisVertical,
      },
      toggleDaySettings,
      popoverIsOpen,
      popoverEvent,
      deleteDay,
      changeDate,
      copyDay,
      idToName,
    };
  },
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonPage,
    Sections,
    IonIcon,
    IonButtons,
    IonPopover,
    IonButton,
    DayMain,
    DayVisits,
    Expenses,
    IonBackButton,
    DayPopover,
    IonText,
  },
};
</script>

<style scoped>
ion-header {
  display: block;
}
</style>
