<template>
  <ion-grid>
    <ion-row>
      <ion-col size-xs="12" size-sm="12" size-md="6" size-lg="6" size-xl="6">
        <ion-item>
          <ion-label>Filter Data by Time Period?</ion-label>
          <ion-toggle
            v-model="state.filterByDate"
            @ionChange="clearDates"
          ></ion-toggle>
        </ion-item>
        <ion-grid v-if="state.filterByDate">
          <ion-row>
            <ion-col size="6">
              <ion-item>
                <ion-label>Start Date</ion-label>
                <ion-datetime
                  display-format="MM/DD/YYYY"
                  v-model="state.startDate"
                ></ion-datetime>
              </ion-item>
            </ion-col>
            <ion-col size="6">
              <ion-item>
                <ion-label>End Date</ion-label>
                <ion-datetime
                  display-format="MM/DD/YYYY"
                  v-model="state.endDate"
                ></ion-datetime>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>

        <ion-radio-group
          :value="state.filterUnpaid"
          @ionChange="state.filterUnpaid = !state.filterUnpaid"
        >
          <ion-item>
            <ion-label>Include All Hours and Expenses</ion-label>
            <ion-radio slot="end" :value="false"></ion-radio>
          </ion-item>
          <ion-item>
            <ion-label
              >Only Include <span style="font-weight: bold">Unpaid </span>Hours
              and Expenses</ion-label
            >
            <ion-radio slot="end" :value="true"></ion-radio>
          </ion-item>
        </ion-radio-group>

        <ion-item>
          <ion-label>
            <ion-icon :icon="timeOutline"></ion-icon>
            Default Hourly Rate
          </ion-label>
          <CurrencyInput
            v-model="state.employee.data.defaultHourlyRate"
            @update:modelValue="$emit('update:modelValue', state.employee)"
            :options="{ currency: 'USD' }"
          />
        </ion-item>
        <PaymentData
          :key="daysRef"
          :daysRef="daysRef"
          :expensesRef="expensesRef"
          :filterUnpaid="state.filterUnpaid"
        />
      </ion-col>
      <ion-col size-xs="12" size-sm="12" size-md="6" size-lg="6" size-xl="6">
        <ion-row>
          <ion-card style="width: 100%; height: 300px;">
            <EmployeeDays
              :key="daysRef"
              :dbRef="daysRef"
              :employeeName="state.employee.data.name"
              :hideAdd="true"
              :showPaidToggle="true"
              :title="state.filterUnpaid ? 'Unpaid Dates' : 'All Dates'"
            />
          </ion-card>
        </ion-row>
        <ion-row>
          <ion-card style="width: 100%; height: 250px;">
            <Expenses
              :key="expensesRef"
              :title="state.filterUnpaid ? 'Unpaid Expenses' : 'All Expenses'"
              :dbRef="expensesRef"
            />
          </ion-card>
        </ion-row>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts">
import {
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonRadioGroup,
  IonRadio,
  IonIcon,
  IonDatetime,
  IonToggle,
  IonCard,
} from "@ionic/vue";
import { computed, reactive } from "@vue/reactivity";
import { timeOutline } from "ionicons/icons";

import store from "@/store";

import { Employee } from "@/types/users";

import CurrencyInput from "./inputs/CurrencyInput.vue";
import EmployeeDays from "./lists/EmployeeDays.vue";
import Expenses from "./lists/ExpensesInfinite.vue";
import { companiesCollection } from "@/main";
import { nameToID } from "@/helpers";
import { CollectionRef, Query } from "@/types/auxiliary";
import PaymentData from "./PaymentData.vue";

interface State {
  employee: Employee;
  filterByDate: boolean;
  startDate: string;
  endDate: string;
  filterUnpaid: true;
}

export default {
  name: "Payment Info",
  emits: ["toggleUnpaid", "update:modelValue"],
  props: {
    modelValue: Object,
  },
  setup(props: any) {
    // Set hourly rate dependent on whether employee is given
    const state = reactive<State>({
      employee: props.modelValue,
      filterByDate: false,
      startDate: "",
      endDate: "",
      filterUnpaid: true,
    });

    const daysRef = computed<Query>(() => {
      let ref: CollectionRef | Query = companiesCollection
        .doc(
          `${store.state.companyID}/employees/${nameToID(
            state.employee.data.name
          )}`
        )
        .collection("days");

      // Filter by paid status
      if (state.filterUnpaid) {
        ref = ref.where("data.paid", "==", false);
      }

      // Filter by time
      if (state.startDate && state.endDate) {
        ref = ref
          .where("data.date", ">=", state.startDate)
          .where("data.date", "<=", state.endDate);
      } else if (state.startDate) {
        ref = ref.where("data.date", ">=", state.startDate);
      } else if (state.endDate) {
        ref = ref.where("data.date", "<=", state.endDate);
      }

      return ref;
    });

    const expensesRef = computed<Query>(() => {
      let ref: CollectionRef | Query = companiesCollection
        .doc(
          `${store.state.companyID}/employees/${nameToID(
            state.employee.data.name
          )}`
        )
        .collection("expenses");

      // Filter by paid status
      if (state.filterUnpaid) {
        ref = ref.where("data.paid", "==", false);
      }
      // Filter by time
      if (state.startDate && state.endDate) {
        ref = ref
          .where("data.date", ">=", state.startDate)
          .where("data.date", "<=", state.endDate);
      } else if (state.startDate) {
        ref = ref.where("data.date", ">=", state.startDate);
      } else if (state.endDate) {
        ref = ref.where("data.date", "<=", state.endDate);
      }

      return ref;
    });

    const clearDates = () => {
      state.startDate = "";
      state.endDate = "";
    };

    return {
      store,
      state,
      timeOutline,
      daysRef,
      expensesRef,
      clearDates,
    };
  },
  components: {
    CurrencyInput,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonRadioGroup,
    IonRadio,
    IonIcon,
    IonDatetime,
    IonToggle,
    IonCard,
    EmployeeDays,
    Expenses,
    PaymentData,
  },
};
</script>

<style scoped>
.currency-input {
  width: 120px;
  height: 40px;
  text-align: center;
}
.currency-input:focus {
  border: none;
  shadow: none;
}
ion-chip {
  cursor: default;
}

ion-card-content {
  height: 80%;
  padding: 0;
}
</style>
