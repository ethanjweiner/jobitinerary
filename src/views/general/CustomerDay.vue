<template>
  <ion-page>
    <ion-header v-if="state.day">
      <ion-toolbar>
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
    <ion-content v-if="state.day" :fullscreen="true">
      <ion-grid class="ion-padding">
        <ion-row>
          <ion-card>
            <ion-card-content>
              <ion-chip>
                <ion-label>
                  <span style="font-weight: bold;">{{ totalHours }}</span> hours
                  worked on this date
                </ion-label>
              </ion-chip>
              <ion-chip v-if="workTypes.length">
                <ion-label>
                  Types of Work:
                  <span
                    v-for="(type, index) in workTypes"
                    :key="index"
                    style="font-weight: bold;"
                  >
                    {{ type
                    }}<span v-if="index != workTypes.length - 1">, </span>
                  </span>
                </ion-label>
              </ion-chip>
              <ion-chip v-if="employees.length">
                <ion-label>
                  Employees Working:
                  <span
                    v-for="(name, index) in employees"
                    :key="index"
                    style="font-weight: bold;"
                  >
                    {{ name
                    }}<span v-if="index != employees.length - 1">, </span>
                  </span>
                </ion-label>
              </ion-chip>
              <ion-item>
                <ion-label position="stacked">Notes</ion-label>
                <ion-textarea
                  placeholder="Notes on this day"
                  v-model="state.day.data.notes"
                >
                </ion-textarea>
              </ion-item>
            </ion-card-content>
          </ion-card>
        </ion-row>

        <hr />
        <ion-row class="ion-justify-content-center ">
          <h3>Visits</h3>
        </ion-row>
        <ion-row class="ion-justify-content-center">
          <AddButton :title="`Add Visit on ${date}`" @click="addVisit" />
        </ion-row>
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
              <ion-card-header>
                <ion-card-title v-if="visit.data.employeeID">
                  Visit by {{ visit.data.employeeID }}
                </ion-card-title>
              </ion-card-header>
              <ion-card-content v-if="state.visits.length">
                <VisitInline
                  v-model="state.visits[index]"
                  :separateByDefault="true"
                  :hideCustomerSelect="true"
                />
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
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
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonLabel,
  IonChip,
  IonButton,
  IonButtons,
  IonBackButton,
  IonTextarea,
  IonItem,
  IonPopover,
} from "@ionic/vue";

import { computed, reactive, ref } from "@vue/reactivity";
import { ellipsisVertical } from "ionicons/icons";

import { CustomerDay, Visit } from "@/types/units";
import VisitInline from "@/components/units/Visit.vue";
import AddButton from "@/components/buttons/AddButton.vue";
import { createVisit } from "@/db";
import { retrieveVisitsOnDay, idToName } from "@/helpers";
import store from "@/store";
import { watch } from "@vue/runtime-core";
import router from "@/router";

import DayPopover from "@/components/popovers/DayPopover.vue";

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

    const initialize = async () => {
      // Initialze Visits
      const day = new CustomerDay(
        props.date,
        store.state.companyID,
        props.userID
      );
      await day.init();
      state.day = day;

      state.visits = await retrieveVisitsOnDay(props.date, {
        customerID: props.userID,
      });
      watch(state.day.data, () => {
        if (state.day) state.day.save();
      });
    };

    initialize();

    const popoverIsOpen = ref(false);
    const popoverEvent = ref();
    const toggleDaySettings = (state: boolean, ev?: Event) => {
      popoverEvent.value = ev;
      popoverIsOpen.value = state;
    };

    const totalHours = computed(() =>
      state.visits.reduce(
        (hoursAcc: number, visit: Visit) => hoursAcc + visit.data.time.hours,
        0
      )
    );

    const workTypes = computed(() => {
      const types: Array<string> = [];
      state.visits.forEach((visit: Visit) => {
        if (visit.data.workType && !types.includes(visit.data.workType))
          types.push(visit.data.workType);
      });
      return types;
    });

    const employees = computed(() => {
      const names: Array<string> = [];
      state.visits.forEach((visit: Visit) => {
        if (visit.data.employeeID && !names.includes(visit.data.employeeID))
          names.push(visit.data.employeeID);
      });
      return names;
    });

    const addVisit = async () => {
      // ADD VISIT TO DATABASE

      const visit = await createVisit({
        customerID: props.userID,
        date: props.date,
      });

      state.visits.unshift(visit);
    };

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
      icons: { ellipsisVertical },
      totalHours,
      workTypes,
      employees,
      addVisit,
      deleteDay,
      changeDate,
      toggleDaySettings,
      popoverIsOpen,
      popoverEvent,
      idToName,
    };
  },
  components: {
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonPage,
    IonGrid,
    IonRow,
    VisitInline,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonLabel,
    IonChip,
    IonButton,
    IonButtons,
    IonBackButton,
    AddButton,
    IonTextarea,
    IonItem,
    IonPopover,
    DayPopover,
  },
};
</script>

<style scoped></style>
