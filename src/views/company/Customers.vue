<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Customers</ion-title>
        <SettingsButton />
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Customers</ion-title>
          <SettingsButton />
        </ion-toolbar>
      </ion-header>
      <!-- On select, route to the customers page w/ a prop -->
      <ion-toolbar id="select-customer-toolbar">
        <CustomersSelect ref="customerSelect" :customers="customers" />
        <ion-buttons slot="end">
          <ion-button style="margin-left: 10px;">
            <ion-icon :icon="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <div
        id="customer-container"
        class="ion-text-center"
        style="margin: 10px;"
      >
        <CustomerComponent v-if="customerID" />
        <ion-grid v-else>
          <ion-row>
            <ion-col class="ion-align-self-center">
              <div>
                <ion-text color="dark">
                  Please select a customer.
                </ion-text>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonButton,
  IonIcon,
  IonButtons,
} from "@ionic/vue";

import SettingsButton from "@/components/buttons/SettingsButton.vue";
import CustomersSelect from "@/components/modals/CustomersSelect.vue";
import CustomerComponent from "@/components/Customer.vue";
import { Customer, sampleCustomer } from "@/types";
import { ref } from "vue";
import { add } from "ionicons/icons";

// Sort customers alphabetically, with none selected
// Show customer if a customer is selected
export default {
  name: "Customers",
  props: ["customerID"],
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    SettingsButton,
    CustomersSelect,
    CustomerComponent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonButton,
    IonIcon,
    IonButtons,
  },
  setup(props: any) {
    const customers = ref<Array<Customer>>([
      sampleCustomer,
      sampleCustomer,
      sampleCustomer,
    ]);
    return {
      customers,
      add,
    };
  },
};
</script>

<style scoped>
#customer-container {
  margin-top: 20px;
  height: calc(100% - 100px);
  cursor: pointer;
}
ion-grid {
  border: 5px dashed darkgray;
  background-color: rgb(233, 233, 233);
}
ion-grid,
ion-row {
  height: 100%;
}
#select-customer-toolbar {
  max-width: 450px;
}
</style>
