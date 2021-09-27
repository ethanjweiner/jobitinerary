<template>
  <div style="height: 100%;">
    <ion-card-header>
      <ion-card-title>
        Days
      </ion-card-title>

      <ion-item>
        <ion-input
          type="date"
          v-model="searchDate"
          placeholder="Search by date"
        ></ion-input>
      </ion-item>
    </ion-card-header>
    <ion-card-content>
      <InfiniteList
        :key="searchDate"
        :pushQuantity="6"
        :sampleItem="sampleCustomerDay"
        :searchParams="['date']"
        :searchFilter="searchDate"
      >
        <template v-slot:item="itemProps">
          <CustomerDayItem
            :day="itemProps.item"
            @click="
              router.push({
                name: 'Customer Day',
                params: { username: customerName, date: itemProps.item.date },
              })
            "
          />
        </template>
      </InfiniteList>
    </ion-card-content>
  </div>
</template>

<script lang="ts">
import {
  IonCardHeader,
  IonInput,
  IonCardTitle,
  IonCardContent,
  IonItem,
} from "@ionic/vue";
import { ref } from "vue";
import router from "@/router";

import { sampleCustomerDay } from "@/types/work_units";

import CustomerDayItem from "./items/CustomerDayItem.vue";
import InfiniteList from "./InfiniteList.vue";

export default {
  name: "Customer Days",
  props: {
    customerName: String,
  },
  setup() {
    const searchDate = ref<string>("");

    return {
      searchDate,
      sampleCustomerDay,
      router,
    };
  },
  components: {
    CustomerDayItem,
    IonCardHeader,
    IonInput,
    IonCardTitle,
    IonCardContent,
    InfiniteList,
    IonItem,
  },
};
</script>

<style scoped>
ion-card {
  height: 100%;
}
ion-card-content {
  height: 80%;
  padding: 0;
}
ion-card-header {
  border-bottom: 1px solid green;
}
.list-header {
  margin: 0;
  display: inline;
}
ion-input {
  padding-left: 0;
  padding-bottom: 0;
}
</style>
