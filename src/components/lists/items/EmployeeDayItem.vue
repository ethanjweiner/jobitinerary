<template>
  <ion-item>
    <div
      style="width: 100%;"
      @click="
        router.push({
          name: 'Employee Day',
          params: {
            username: state.day.employeeName,
            date: state.day.date,
          },
        })
      "
    >
      <ion-label>
        <ion-text>
          {{ day.date }}
        </ion-text>
      </ion-label>
      <ion-note v-if="state.day.time.hours">
        {{ state.day.time.hours }} total hours @ ${{ hourlyRate }}/hr
      </ion-note>
    </div>
    <ion-buttons slot="end" v-if="showPaidToggle">
      <ion-note style="margin: auto;" v-if="state.day.paid"
        ><ion-icon :icon="checkmark"></ion-icon> Paid</ion-note
      >
      <ion-note style="margin: auto;" v-if="!state.day.paid">Unpaid</ion-note>
      <ion-toggle
        :checked="state.day.paid"
        value="paid"
        @ionChange="togglePaid"
      ></ion-toggle>
    </ion-buttons>
  </ion-item>
</template>

<script lang="ts">
import {
  IonItem,
  IonLabel,
  IonText,
  IonNote,
  IonButtons,
  IonIcon,
  IonToggle,
} from "@ionic/vue";
import { computed, reactive } from "@vue/reactivity";
import store from "@/store";
import router from "@/router";

import { checkmark } from "ionicons/icons";

import { Company, Customer, Employee } from "@/types/users";
import { companiesCollection } from "@/main";
import { EmployeeDayInterface } from "@/types/work_units";
import { nameToID } from "@/helpers";

export default {
  name: "Employee Day Item",
  props: {
    day: Object,
    showPaidToggle: Boolean,
  },
  components: {
    IonItem,
    IonLabel,
    IonText,
    IonNote,
    IonButtons,
    IonIcon,
    IonToggle,
  },
  emits: ["togglePaid"],
  setup(props: any) {
    const state = reactive<{ day: EmployeeDayInterface }>({
      day: props.day,
    });

    const togglePaid = async () => {
      state.day.paid = !state.day.paid;
      await companiesCollection
        .doc(
          `${state.day.companyID}/employees/${nameToID(
            state.day.employeeName
          )}/days/${state.day.date}`
        )
        .update({ "data.paid": state.day.paid });
    };

    const hourlyRate = computed(() => {
      if (state.day.hourlyRate) return state.day.hourlyRate;
      if (store.state.user instanceof Employee)
        return store.state.user.data.defaultHourlyRate;
      else if (store.state.user instanceof Company) {
        const employee = store.state.user.employees.find(
          (employee) => state.day.employeeName == employee.data.name
        );
        if (employee) return employee.data.defaultHourlyRate;
      } else if (store.state.user instanceof Customer) return null;
      return null;
    });

    return {
      checkmark,
      state,
      hourlyRate,
      router,
      togglePaid,
    };
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
