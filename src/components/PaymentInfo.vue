<template>
  <ion-grid>
    <ion-row>
      <ion-col size-xs="12" size-sm="12" size-md="6" size-lg="6" size-xl="6">
        <ion-item>
          <ion-label>Filter Data by Time Period?</ion-label>
          <ion-toggle v-model="state.filterByDate"></ion-toggle>
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

        <ion-radio-group v-model="state.filterUnpaid">
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
            v-model="state.employee.defaultHourlyRate"
            :options="{ currency: 'USD' }"
          />
        </ion-item>

        <div style="width: 100%; margin-top: 10px;">
          <h2>
            <ion-text class="ion-text-center">Payment Data</ion-text>
          </h2>
          <div class="ion-text-left ion-padding">
            <ion-note
              >Note: The data displayed is only as accurated as the hours and
              expenses logged by the company or employee.</ion-note
            >
          </div>
        </div>
        <ion-grid>
          <ion-chip>
            <ion-label
              ><span class="payment-data">{{ unpaidDays }}</span>
              <span v-if="state.filterUnpaid">&nbsp;Unpaid </span>
              Work Days</ion-label
            >
          </ion-chip>
          <ion-chip>
            <ion-label
              ><span class="payment-data">{{ hours }} </span>
              <span v-if="state.filterUnpaid">&nbsp;Unpaid </span>
              Work Hours</ion-label
            >
          </ion-chip>
          <ion-chip>
            <ion-label
              ><span class="payment-data">${{ hoursAmount }} </span>
              <span v-if="state.filterUnpaid">&nbsp;Owed in Work Hours</span>
              <span v-else>&nbsp;Made from Hours Worked</span>
            </ion-label>
          </ion-chip>
          <ion-chip v-if="state.filterUnpaid">
            <ion-label
              ><span class="payment-data">${{ expensesAmount }}</span>
              Owed in Expenses
            </ion-label>
            <!-- Highlight this chip -->
          </ion-chip>
          <ion-chip>
            <ion-label
              ><span class="payment-data">${{ totalAmount }} </span>
              <span v-if="state.filterUnpaid">&nbsp;Owed Total</span>
              <span v-else>&nbsp;Paid Total</span>
            </ion-label>
          </ion-chip>
        </ion-grid>
      </ion-col>
      <ion-col size-xs="12" size-sm="12" size-md="6" size-lg="6" size-xl="6">
        <ion-row>
          <ion-card style="width: 100%; height: 300px;">
            <!-- DB_REF SHOULD BE CONDITIONAL, DEPENDENT ON WHETHER FILTERING UNPAID -->
            <EmployeeDays
              :employeeName="state.employee.name"
              :hideAdd="true"
              :sampleItem="sampleDay"
              :showPaidToggle="true"
              :title="state.filterUnpaid ? 'Unpaid Dates' : 'All Dates'"
            />
          </ion-card>
        </ion-row>
        <ion-row>
          <ion-card style="width: 100%; height: 250px;">
            <Expenses />
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
  IonChip,
  IonLabel,
  IonRadioGroup,
  IonRadio,
  IonIcon,
  IonNote,
  IonDatetime,
  IonToggle,
  IonCard,
  IonText,
} from "@ionic/vue";
import { computed, reactive } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { timeOutline } from "ionicons/icons";

import store from "@/store";

import { sampleDay, Day, Employee } from "@/types";

import CurrencyInput from "./inputs/CurrencyInput.vue";
import EmployeeDays from "./lists/EmployeeDays.vue";
import Expenses from "./lists/ExpensesInfinite.vue";

interface State {
  employee: Employee;
  filterUnpaid: boolean;
  filterByDate: boolean;
  startDate: string;
  endDate: string;
}

export default {
  name: "Payment Info",
  props: {
    modelValue: Object,
  },
  emits: ["update:modelValue"],
  setup(props: any, { emit }: { emit: any }) {
    // Set hourly rate dependent on whether employee is given
    const state = reactive<State>({
      employee: props.modelValue,
      filterUnpaid: true,
      filterByDate: false,
      startDate: "",
      endDate: "",
    });

    watch(state.employee, (newEmployee) => {
      emit("update:modelValue", newEmployee);
    });

    // QUERY ALL UNPAID DAYS, RETRIEVE DATA BASED ON THAT

    const unpaidDays = computed(() => {
      return 0;
    });

    const hours = computed(() => {
      return 0;
    });

    const hoursAmount = computed(() => {
      // Filter through unpaid days
      return 0;
    });

    const expensesAmount = computed(() => {
      // Filter through unpaid expenses
      return 0;
    });

    const totalAmount = computed(
      () => hoursAmount.value + expensesAmount.value
    );

    const togglePaid = (day: Day) => {
      // UPDATE PAID ATTRIBUTE
      console.log("Toggling paid for ", day);
    };

    return {
      store,
      state,
      unpaidDays,
      hours,
      hoursAmount,
      expensesAmount,
      totalAmount,
      timeOutline,
      togglePaid,
      sampleDay,
    };
  },
  components: {
    CurrencyInput,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonChip,
    IonLabel,
    IonRadioGroup,
    IonRadio,
    IonIcon,
    IonNote,
    IonDatetime,
    IonToggle,
    IonCard,
    EmployeeDays,
    Expenses,
    IonText,
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
.payment-data {
  font-weight: bold;
}
ion-card-content {
  height: 80%;
  padding: 0;
}
</style>
