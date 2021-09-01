<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="today" href="/employee/today">
          <ion-icon :icon="today" />
          <ion-label>Today</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="days" href="/employee/days">
          <ion-icon :icon="calendar" />
          <ion-label>Days</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="pay" href="/employee/pay">
          <ion-icon :icon="cash" />
          <ion-label>Pay</ion-label>
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
import { today, calendar, cash } from "ionicons/icons";

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
      today,
      calendar,
      cash,
    };
  },
};
</script>
