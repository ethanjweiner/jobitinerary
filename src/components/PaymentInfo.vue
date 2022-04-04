<template>
  <ion-grid class="ion-justify-content-center">
    <ion-row class="ion-justify-content-center">
      <ion-col size="12" size-lg="8">
        <ion-card>
          <ion-card-content>
            <ion-item color="light">
              <ion-label>Filter by Time?</ion-label>
              <ion-toggle
                v-model="state.filterByDate"
                @ionChange="clearDates"
              ></ion-toggle>
            </ion-item>
            <date-picker
              v-if="state.filterByDate"
              color="light"
              title="Start Date"
              v-model="state.startDate"
            ></date-picker>
            <date-picker
              v-if="state.filterByDate"
              color="light"
              title="End Date"
              v-model="state.endDate"
            ></date-picker>

            <ion-radio-group
              :value="state.filterUnpaid"
              @ionChange="state.filterUnpaid = !state.filterUnpaid"
            >
              <ion-item>
                <ion-label>All Hours/Expenses</ion-label>
                <ion-radio slot="end" :value="false"></ion-radio>
              </ion-item>
              <ion-item>
                <ion-label>
                  <span style="font-weight: bold">Unpaid </span
                  >Hours/Expenses</ion-label
                >
                <ion-radio slot="end" :value="true"></ion-radio>
              </ion-item>
            </ion-radio-group>

            <ion-item>
              <ion-label>
                <ion-icon :icon="timeOutline"></ion-icon>
                Default Rate (/hr)
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
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonRow,
  IonToggle,
} from "@ionic/vue";
import { computed, reactive } from "@vue/reactivity";
import { timeOutline } from "ionicons/icons";

import { nameToID } from "@/helpers";
import { companiesCollection } from "@/main";
import store from "@/store";
import { CollectionRef, Query } from "@/types/auxiliary";
import { Employee } from "@/types/users";

import CurrencyInput from "./inputs/CurrencyInput.vue";
import DatePicker from "./inputs/DatePicker.vue";
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

    IonToggle,
    IonCard,
    IonCardContent,
    PaymentData,
    DatePicker,
  },
};
</script>

<style scoped>
ion-grid {
  --ion-grid-padding-xs: 3px;
  --ion-grid-padding-sm: 3px;
  --ion-grid-padding-md: 4px;
  --ion-grid-padding-lg: 6px;
  --ion-grid-padding-xl: 6px;
  --ion-grid-column-padding-xs: 2px;
  --ion-grid-column-padding-sm: 2px;
  --ion-grid-column-padding-md: 4px;
  --ion-grid-column-padding-lg: 6px;
  --ion-grid-column-padding-xl: 6px;
}
.currency-input {
  width: 70px;
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

ion-row {
  display: flex;
  align-items: center;
  height: 100%;
}
ion-grid {
  height: 100%;
}
</style>
