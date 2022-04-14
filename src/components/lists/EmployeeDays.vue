<template>
  <SearchToolbar
    :addAction="createDay"
    title="Dates"
    v-model="searchDate"
    useDateInput
  >
    <template v-slot:filter>
      <ion-radio-group
        :value="state.filterUnpaid"
        @ionChange="state.filterUnpaid = !state.filterUnpaid"
      >
        <ion-grid>
          <ion-row>
            <ion-col size="12" size-sm="6" size-md="5" size-lg="4">
              <ion-item color="primary" class="toggle-item">
                <ion-radio
                  color="light"
                  slot="start"
                  :value="false"
                ></ion-radio>
                <ion-label>All Days</ion-label>
              </ion-item>
            </ion-col>
            <ion-col size="12" size-sm="6" size-md="5" size-lg="4">
              <ion-item color="primary" class="toggle-item">
                <ion-radio color="light" slot="start" :value="true"></ion-radio>
                <ion-label>Unpaid Days</ion-label>
              </ion-item>
            </ion-col>
            <ion-col class="ion-hide-md-down" size-md="2" size-lg="4">
              <ion-item color="primary"></ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-radio-group>
    </template>
  </SearchToolbar>

  <InfiniteList
    :key="key"
    :splitters="splitters"
    :dbRef="daysRef"
    orderByParam="date"
    :searchFilter="searchDate"
    :sizes="sizes"
  >
    <template v-slot:item="itemProps">
      <EmployeeDayItem :day="itemProps.item" :showPaidToggle="showPaidToggle" />
    </template>
  </InfiniteList>
</template>

<script lang="ts">
import {
  IonCol,
  IonGrid,
  IonItem,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonRow,
} from "@ionic/vue";
import { computed, reactive, ref, watch } from "vue";

import config from "@/config/config";
import router from "@/router";
import { CollectionRef, Query, Splitter } from "@/types/auxiliary";
import { EmployeeDayInterface } from "@/types/units";

import SearchToolbar from "../inputs/SearchToolbar.vue";
import InfiniteList from "./InfiniteList.vue";
import EmployeeDayItem from "./items/EmployeeDayItem.vue";

export default {
  name: "Employee Days",
  components: {
    EmployeeDayItem,
    InfiniteList,
    SearchToolbar,
    IonRadioGroup,
    IonRadio,
    IonItem,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
  },
  props: {
    dbRef: Object,
    employeeID: String,
    hideAdd: Boolean,
    title: String,
    showPaidToggle: Boolean,
  },
  setup(props: any) {
    const state = reactive({
      filterUnpaid: false,
    });

    const daysRef = computed<Query>(() => {
      let ref: CollectionRef | Query = props.dbRef;
      if (state.filterUnpaid) {
        ref = ref.where("data.paid", "==", false);
      }
      return ref;
    });

    const key = ref(0);
    const searchDate = ref<string>("");

    watch(searchDate, () => (key.value += 1));
    watch(daysRef, () => (key.value += 1));

    const splitters = ref<Array<Splitter>>([
      {
        name: "Future Dates",
        filter: (day: EmployeeDayInterface) => new Date(day.date) >= new Date(),
      },
      {
        name: "Logged Dates",
        filter: (day: EmployeeDayInterface) => new Date(day.date) < new Date(),
      },
    ]);

    const sizes = {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 6,
      xl: 4,
    };

    const createDay = async () => {
      router.push({
        name: "New Employee Day",
        params: { employeeID: props.employeeID },
      });
    };

    return {
      key,
      state,
      router,
      createDay,
      searchDate,
      splitters,
      sizes,
      daysRef,
      config,
    };
  },
};
</script>

<style scoped>
ion-grid {
  --ion-grid-padding-xs: 0;
  --ion-grid-padding-sm: 0;
  --ion-grid-padding-md: 0;
  --ion-grid-padding-lg: 0;
  --ion-grid-padding-xl: 0;
  --ion-grid-column-padding-xs: 0;
  --ion-grid-column-padding-sm: 0;
  --ion-grid-column-padding-md: 0;
  --ion-grid-column-padding-lg: 0;
  --ion-grid-column-padding-xl: 0;
}
</style>
