<template>
  <ion-page v-if="state.day">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title> {{ username }} on {{ date }} </ion-title>
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
        :employeeName="username"
        :currentDate="state.day.data.date"
      />
      <!-- Add Day Popover here -->
    </ion-popover>

    <ion-content :fullscreen="true">
      <form>
        <Sections :sections="sections" wrapCards>
          <template v-slot:main>
            <DayMain v-model="state.day" />
          </template>
          <template v-slot:visits>
            <DayVisits
              :key="state.visits.length"
              v-model="state.visits"
              :employeeName="username"
              :date="date"
            />
          </template>
          <template v-slot:expenses>
            <Expenses
              v-model="state.expenses"
              :employeeName="username"
              :date="date"
            />
          </template>
          <template v-slot:sectionsAsGrid>
            <ion-row>
              <ion-col size="6">
                <ion-row>
                  <ion-card style="width: 100%;">
                    <DayMain v-model="state.day" />
                  </ion-card>
                </ion-row>
                <ion-row>
                  <ion-card style="width: 100%;">
                    <ion-card-header class="ion-text-center">
                      <ion-card-title>
                        <ion-icon :icon="icons.pricetagsOutline"></ion-icon>
                        Expenses
                      </ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                      <Expenses
                        v-model="state.expenses"
                        :employeeName="username"
                        :date="date"
                      />
                    </ion-card-content>
                  </ion-card>
                </ion-row>
              </ion-col>
              <ion-col size="6">
                <ion-card>
                  <ion-card-header class="ion-text-center">
                    <ion-card-title>
                      <ion-icon :icon="icons.homeOutline"></ion-icon>
                      Visits
                    </ion-card-title>
                  </ion-card-header>
                  <ion-card-content>
                    <DayVisits
                      :key="state.visits.length"
                      v-model="state.visits"
                      :employeeName="username"
                      :date="date"
                    />
                  </ion-card-content>
                </ion-card>
              </ion-col>
            </ion-row>
          </template>
        </Sections>
      </form>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonButtons,
  IonPopover,
  IonButton,
  IonCard,
  IonCol,
  IonRow,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBackButton,
} from "@ionic/vue";
import { ref, watch } from "vue";
import { reactive } from "@vue/reactivity";

import store from "@/store";
import router from "@/router";

import { Expense, EmployeeDay, Visit } from "@/types/work_units";
import { SectionsType } from "@/types/auxiliary";

import Sections from "@/components/Sections.vue";
import DayMain from "@/components/forms/DayMain.vue";
import DayVisits from "@/components/lists/DayVisits.vue";
import Expenses from "@/components/lists/Expenses.vue";

import {
  pricetagsOutline,
  documentTextOutline,
  ellipsisVertical,
  homeOutline,
} from "ionicons/icons";
import DayPopover from "@/components/popovers/DayPopover.vue";
import { nameToID, retrieveVisitsOnDay } from "@/helpers";
import { companiesCollection } from "@/main";
import { copyVisit } from "@/db.ts";

interface State {
  day: EmployeeDay | null;
  visits: Array<Visit>;
  expenses: Array<Expense>;
}
export default {
  name: "Employee Day",
  props: {
    username: String,
    date: String,
  },
  setup(props: any) {
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
    const initialize = async () => {
      if (store.state.company) {
        // Initialize Day
        const day = new EmployeeDay(
          props.date,
          store.state.company.id,
          nameToID(props.username)
        );
        await day.init();
        state.day = day;
        // Initialze Visits
        state.visits = await retrieveVisitsOnDay(props.date, {
          employeeName: props.username,
        });
        // Initialize Expenses
        const expenseDocs = (
          await companiesCollection
            .doc(
              `${store.state.company.id}/employees/${nameToID(props.username)}`
            )
            .collection("expenses")
            .where("data.date", "==", props.date)
            .get()
        ).docs;
        for (const doc of expenseDocs) {
          const expense = new Expense(
            doc.id,
            store.state.company.id,
            nameToID(props.username)
          );
          await expense.init(doc.data().data);
          state.expenses.push(expense);
        }
        watch(state.day.data, () => {
          if (state.day) state.day.save();
        });
      }
    };

    initialize();

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
      router.push({ name: "Employee", params: { username: props.username } });
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
          params: { employee: props.username, date },
        });

        router.go(0);
      }
    };

    const copyVisits = async (employeeName: string) => {
      for (const visit of state.visits) {
        await copyVisit(visit, employeeName);
      }
    };

    const copyDay = async (employeeName: string) => {
      if (state.day) {
        const copiedDay = new EmployeeDay(
          state.day.data.date,
          state.day.data.companyID,
          nameToID(employeeName)
        );
        const copiedData = { ...state.day.data };
        copiedData.employeeName = employeeName;
        copiedData.readByCompany = false;
        copiedData.readByEmployee = false;
        copiedData.hourlyRate = null;
        await copiedDay.create(copiedData);
        await copyVisits(employeeName);
        popoverIsOpen.value = false;
      }
    };

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
    };
  },
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    Sections,
    IonIcon,
    IonButtons,
    IonPopover,
    IonButton,
    DayMain,
    DayVisits,
    Expenses,
    IonCard,
    IonCol,
    IonRow,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBackButton,
    DayPopover,
  },
};
</script>

<style>
ion-title {
  padding-left: 10px;
}
</style>
