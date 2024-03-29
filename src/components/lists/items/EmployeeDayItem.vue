<template>
  <ion-card
    button
    @click="
      router.push({
        name: `Employee Day / ${store.state.userType}`,
        params: {
          userID: day.employeeID,
          id: day.date,
        },
      })
    "
  >
    <ion-card-header>
      <ion-toolbar>
        <ion-card-title color="dark">{{ day.date.slice(5) }}</ion-card-title>

        <ion-buttons slot="end" v-if="showPaidToggle">
          <ion-note style="margin: auto;" v-if="day.paid"
            ><ion-icon :icon="icons.checkmark"></ion-icon> Paid</ion-note
          >
          <ion-note style="margin: auto;" v-if="!day.paid">Unpaid</ion-note>
          <ion-toggle
            :checked="day.paid"
            value="paid"
            @ionChange="togglePaid"
            @click.stop
            style="margin-left: 5px;"
          ></ion-toggle>
        </ion-buttons>
      </ion-toolbar>
    </ion-card-header>
    <ion-card-content>
      <ion-card-subtitle>
        <ion-icon :icon="icons.hammer"></ion-icon>
        {{ idToName(day.employeeID) }}
      </ion-card-subtitle>

      <ion-card-subtitle v-if="customers.length">
        <ion-icon :icon="icons.cart"></ion-icon>
        Customers:
        <span v-for="(name, index) in customers" :key="name"
          >{{ name }}<span v-if="index != customers.length - 1">, </span>
        </span>
      </ion-card-subtitle>

      <li v-if="day.time.hours">
        <ion-icon :icon="icons.time"></ion-icon>

        {{ day.time.hours }} total hours @ {{ hourlyRate }}/hr
      </li>
    </ion-card-content>
  </ion-card>
</template>

<script lang="ts">
import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonNote,
  IonToggle,
  IonToolbar,
} from "@ionic/vue";
import { computed, reactive } from "@vue/reactivity";
import { cart, checkmark, hammer, time } from "ionicons/icons";

import { idToName, retrieveVisitsOnDate } from "@/helpers";
import { companiesCollection } from "@/main";
import router from "@/router";
import store from "@/store";
import { EmployeeDayInterface, Visit } from "@/types/units";

interface State {
  day: EmployeeDayInterface;
  visits: Array<Visit>;
}

export default {
  name: "Employee Day Item",
  props: {
    day: Object,
    showPaidToggle: Boolean,
  },
  emits: ["togglePaid"],
  setup(props: any) {
    const state = reactive<State>({
      day: props.day,
      visits: [],
    });

    const initialize = async () => {
      state.visits = await retrieveVisitsOnDate(state.day.date, {
        employeeID: state.day.employeeID,
      });
    };

    const customers = computed(() =>
      state.visits.reduce((customers: Array<string>, visit: Visit) => {
        if (visit.data.customerID && !customers.includes(visit.data.customerID))
          customers.push(idToName(visit.data.customerID));
        if (
          visit.data.unregisteredCustomer &&
          !customers.includes(visit.data.unregisteredCustomer)
        )
          customers.push(visit.data.unregisteredCustomer);
        return customers;
      }, [])
    );

    initialize();

    const togglePaid = async () => {
      state.day.paid = !state.day.paid;
      await companiesCollection
        .doc(
          `${state.day.companyID}/employees/${state.day.employeeID}/days/${state.day.date}`
        )
        .update({ "data.paid": state.day.paid });
    };

    const hourlyRate = computed(() => {
      if (state.day.hourlyRate) return state.day.hourlyRate;

      return null;
    });

    return {
      icons: { checkmark, hammer, time, cart },
      idToName,
      state,
      hourlyRate,
      router,
      togglePaid,
      customers,
      store,
    };
  },
  components: {
    IonCard,
    IonCardContent,
    IonCardSubtitle,
    IonIcon,
    IonToolbar,
    IonCardTitle,
    IonNote,
    IonToggle,
    IonButtons,
    IonCardHeader,
  },
};
</script>

<style scoped></style>
