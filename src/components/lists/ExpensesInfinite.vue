<template>
  <SearchToolbar disableAdd title="Expenses" v-model="searchText">
    <template v-slot:filter>
      <ion-radio-group
        :value="state.filterUnpaid"
        @ionChange="state.filterUnpaid = !state.filterUnpaid"
      >
        <ion-grid style="border-top: 1px solid white;">
          <ion-row>
            <ion-col size="12" size-md="6">
              <ion-item color="primary" style="border-right: 1px solid white;">
                <ion-radio
                  color="light"
                  slot="start"
                  :value="false"
                ></ion-radio>
                <ion-label>All Expenses</ion-label>
              </ion-item>
            </ion-col>
            <ion-col size="12" size-md="6">
              <ion-item color="primary">
                <ion-radio color="light" slot="start" :value="true"></ion-radio>
                <ion-label>Unpaid Expenses</ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-radio-group>
    </template>
  </SearchToolbar>
  <InfiniteList
    :key="key"
    :pushQuantity="config.constants.PUSH_QUANTITY"
    :searchFilter="searchText"
    :dbRef="expensesRef"
    orderByParam="date"
    type="list"
  >
    <template v-slot:item="itemProps">
      <ExpenseItemInfinite
        :key="itemProps.item.id"
        :expense="itemProps.item"
        :showDate="true"
      />
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
import { computed, reactive, ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

import SearchToolbar from "@/components/inputs/SearchToolbar.vue";
import InfiniteList from "@/components/lists/InfiniteList.vue";
import config from "@/config/config";
import { CollectionRef, Query } from "@/types/auxiliary";

import ExpenseItemInfinite from "./items/ExpenseItemInfinite.vue";

export default {
  name: "Expenses Infinite",
  props: {
    dbRef: Object,
    title: String,
  },
  setup(props: any) {
    const searchText = ref<string>("");

    const state = reactive({
      filterUnpaid: false,
    });

    const expensesRef = computed<Query>(() => {
      let ref: CollectionRef | Query = props.dbRef;
      if (state.filterUnpaid) {
        ref = ref.where("data.paid", "==", false);
      }
      return ref;
    });

    const key = ref(0);

    watch(searchText, () => (key.value += 1));
    watch(expensesRef, () => (key.value += 1));

    return {
      searchText,
      key,
      state,
      expensesRef,
      config,
    };
  },
  components: {
    InfiniteList,
    SearchToolbar,
    IonRadioGroup,
    IonRadio,
    IonItem,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    ExpenseItemInfinite,
  },
};
</script>

<style scoped>
ion-card-content {
  height: 80%;
  padding: 0;
}
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
