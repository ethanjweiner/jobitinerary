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
              ><span class="payment-data">{{ days.length }}</span>
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
          <ion-card style="width: 100%; height: 200px;">
            <ion-card-header>
              <ion-card-title v-if="state.filterUnpaid"
                >Unpaid Days</ion-card-title
              >
              <ion-card-title v-else>Days</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-content>
                <ion-list>
                  <DayItem
                    v-for="(day, index) in days"
                    :key="index"
                    :day="day"
                    :showPaymentToggle="true"
                    @togglePaid="togglePaid(day)"
                  />
                </ion-list>
                <ion-infinite-scroll
                  @ionInfinite="loadDays($event)"
                  threshold="100px"
                  id="infinite-scroll"
                >
                  <ion-infinite-scroll-content
                    loading-spinner="bubbles"
                    loading-text="Loading days..."
                  >
                  </ion-infinite-scroll-content>
                </ion-infinite-scroll>
              </ion-content>
            </ion-card-content>
          </ion-card>
        </ion-row>
        <ion-row>
          <ion-card style="width: 100%; height: 200px;">
            <ion-card-header>
              <ion-card-title v-if="state.filterUnpaid"
                >Unpaid Expenses</ion-card-title
              >
              <ion-card-title v-else>Expenses</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-content>
                <ion-list>
                  <ExpenseItem
                    v-for="expense in expenses"
                    :key="expense.id"
                    :expense="expense"
                  />
                </ion-list>
                <ion-infinite-scroll
                  @ionInfinite="loadExpenses($event)"
                  threshold="100px"
                  id="infinite-scroll"
                >
                  <ion-infinite-scroll-content
                    loading-spinner="bubbles"
                    loading-text="Loading days..."
                  >
                  </ion-infinite-scroll-content>
                </ion-infinite-scroll>
              </ion-content>
            </ion-card-content>
          </ion-card>
        </ion-row>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts">
import { computed, reactive, ref } from "@vue/reactivity";
import store from "@/store";
import CurrencyInput from "./inputs/CurrencyInput.vue";
import { watch } from "@vue/runtime-core";
import { timeOutline } from "ionicons/icons";
import DayItem from "@/components/lists/items/DayItem.vue";

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
  IonList,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonText,
} from "@ionic/vue";
import { sampleDay, sampleExpense, Day, Expense } from "@/types";
import ExpenseItem from "./lists/items/Expense.vue";

export default {
  name: "Payment Info",
  props: {
    employee: Object,
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
    IonList,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    DayItem,
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    ExpenseItem,
    IonText,
  },
  setup(props: any, { emit }: { emit: any }) {
    // Set hourly rate dependent on whether employee is given
    const state = reactive({
      employee: props.employee,
      filterUnpaid: true,
      filterByDate: false,
      startDate: "",
      endDate: "",
    });

    const days = ref<Array<Day>>([]);

    const pushDays = () => {
      const max = days.value.length + 5;
      const min = max - 5;
      for (let i = min; i < max; i++) {
        days.value.push(sampleDay);
      }
    };

    const loadDays = (ev: any) => {
      setTimeout(() => {
        pushDays();
        console.log("Loaded data");
        ev.target.complete();

        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (days.value.length == 1000) {
          ev.target.disabled = true;
        }
      }, 500);
    };

    pushDays();

    const expenses = ref<Array<Expense>>([]);

    const pushExpenses = () => {
      const max = expenses.value.length + 5;
      const min = max - 5;
      for (let i = min; i < max; i++) {
        expenses.value.push(sampleExpense);
      }
    };

    const loadExpenses = (ev: any) => {
      setTimeout(() => {
        pushExpenses();
        console.log("Loaded data");
        ev.target.complete();

        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (days.value.length == 1000) {
          ev.target.disabled = true;
        }
      }, 500);
    };

    pushExpenses();

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
      // Chage the paid
      console.log("Toggling paid for ", day);
    };

    watch(state.employee, (newEmployee) => {
      emit("employeeChanged", newEmployee);
    });

    return {
      store,
      state,
      loadDays,
      loadExpenses,
      days,
      expenses,
      hours,
      hoursAmount,
      expensesAmount,
      totalAmount,
      timeOutline,
      togglePaid,
    };
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
