<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/company/home">
          <ion-icon :icon="triangle" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="customers" href="/company/customers">
          <ion-icon :icon="ellipse" />
          <ion-label>Customers</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="employeees" href="/company/employees">
          <ion-icon :icon="square" />
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
import { ellipse, square, triangle } from "ionicons/icons";

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
      ellipse,
      square,
      triangle,
    };
  },
};
</script>
