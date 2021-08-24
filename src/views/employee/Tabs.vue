<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="today" href="/employee/today">
          <ion-icon :icon="triangle" />
          <ion-label>Today</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="days" href="/employee/days">
          <ion-icon :icon="ellipse" />
          <ion-label>Days</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="pay" href="/employee/pay">
          <ion-icon :icon="square" />
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
