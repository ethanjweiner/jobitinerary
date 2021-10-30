<template>
  <ion-grid>
    <ion-row>
      <ion-col>
        <ion-card>
          <ion-card-content>
            <ion-item color="light">
              <ion-label>Filter Data by Time Period?</ion-label>
              <ion-toggle
                v-model="state.filterByDate"
                @ionChange="clearDates"
              ></ion-toggle>
            </ion-item>
            <ion-item v-if="state.filterByDate" color="light">
              <ion-label>Start Date</ion-label>
              <ion-datetime
                display-format="MM/DD/YYYY"
                v-model="state.startDate"
              ></ion-datetime>
            </ion-item>
            <ion-item v-if="state.filterByDate" color="light">
              <ion-label>End Date</ion-label>
              <ion-datetime
                display-format="MM/DD/YYYY"
                v-model="state.endDate"
              ></ion-datetime>
            </ion-item>

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
                  >Only Include
                  <span style="font-weight: bold">Unpaid </span>Hours and
                  Expenses</ion-label
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
          </ion-card-content>
        </ion-card>
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
  IonCardContent,
} from "@ionic/vue";
import { computed, reactive } from "@vue/reactivity";
import { timeOutline } from "ionicons/icons";

import store from "@/store";

import { Employee } from "@/types/users";

import CurrencyInput from "./inputs/CurrencyInput.vue";
import { companiesCollection } from "@/main";
import { nameToID } from "@/helpers";
import { CollectionRef, Query } from "@/types/auxiliary";
import PaymentData from "./PaymentData.vue";

interface State {
  employee: Employee;
  filterByDate: boolean;
  startDate: string;
  endDate: string;
  filterUnpaid: boolean;
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
            state.employee.data.id
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
            state.employee.data.id
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
    IonCardContent,
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
</style>
