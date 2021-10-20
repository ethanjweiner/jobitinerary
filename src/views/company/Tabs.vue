<template>
  <ion-page>
    <ion-tabs>
      <!-- Reload each route upon load -->
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/company/home">
          <ion-icon :icon="icons.home" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="customers" href="/company/customers">
          <ion-icon :icon="icons.cart" />
          <ion-label>Customers</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="employeees" href="/company/employees">
          <ion-icon :icon="icons.hammer" />
          <ion-label>Employees</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from "@ionic/vue";
import { home, cart, hammer } from "ionicons/icons";

export default {
  name: "Tabs",
  components: {
    IonLabel,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonPage,
    IonRouterOutlet,
  },
  setup() {
    return {
      icons: { home, cart, hammer },
    };
  },
};
</script>
