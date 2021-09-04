<template>
  <ion-item>
    <ion-icon id="customer-select" :icon="personOutline"></ion-icon>
    <ion-label style="margin-left: 10px;">Select Customer</ion-label>
    <ion-select
      style="border: none !important;"
      @ionChange="selectCustomer($event)"
    >
      <ion-select-option
        v-for="customer in customers"
        :key="customer.id"
        :value="customer.id"
        >{{ customer.name }}</ion-select-option
      >
    </ion-select>
  </ion-item>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "@/router";

import {
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonIcon,
} from "@ionic/vue";

import { personOutline } from "ionicons/icons";

export default defineComponent({
  name: "Customers Select",
  props: {
    customers: Array,
  },
  components: {
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonIcon,
  },
  setup() {
    const selectCustomer = (e: CustomEvent) => {
      router.push({
        name: "Customer",
        params: { customerID: e.detail.value },
      });
    };
    return {
      personOutline,
      selectCustomer,
    };
  },
});
</script>

<style scoped>
ion-card {
  max-width: 500px;
}
</style>
