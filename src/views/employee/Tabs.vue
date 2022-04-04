<template>
  <ion-page :class="route.meta.class">
    <ion-tabs>
      <ion-router-outlet :key="refresher"></ion-router-outlet>
      <CreateButton />
      <ion-tab-bar :slot="screenWidth < 768 ? 'bottom' : 'top'" color="primary">
        <div style="height: 100%;">
          <ion-title class="main-title" style="height: 90%;">
            JobItinerary</ion-title
          >
        </div>

        <ion-tab-button
          :layout="screenWidth < 768 ? 'icon-top' : 'icon-start'"
          tab="today"
          href="/employee/today"
        >
          <ion-icon :icon="icons.today" />
          <ion-label>Today</ion-label>
        </ion-tab-button>

        <ion-tab-button
          :layout="screenWidth < 768 ? 'icon-top' : 'icon-start'"
          tab="days"
          href="/employee/days"
        >
          <ion-icon :icon="icons.calendar" />
          <ion-label>Days</ion-label>
        </ion-tab-button>

        <ion-tab-button
          :layout="screenWidth < 768 ? 'icon-top' : 'icon-start'"
          tab="pay"
          href="/employee/pay"
        >
          <ion-icon :icon="icons.cash" />
          <ion-label>Pay</ion-label>
        </ion-tab-button>
        <ion-tab-button
          class="settings-tab-button"
          tab="settings"
          href="/employee/settings"
          :layout="screenWidth < 768 ? 'icon-top' : 'icon-start'"
        >
          <ion-icon :icon="icons.settings"></ion-icon>
          <ion-label>Settings</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
      <!-- Global Loading Spinner -->
      <ion-loading
        :is-open="store.loadingCounter.value != 0"
        message="Please wait..."
      >
      </ion-loading>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import {
  IonIcon,
  IonLabel,
  IonLoading,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
} from "@ionic/vue";
import { onMounted, ref, watch } from "@vue/runtime-core";
import { calendar, cash, settings, today } from "ionicons/icons";
import { useRoute } from "vue-router";

import CreateButton from "@/components/buttons/CreateButton.vue";
import store from "@/store";

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
    IonTitle,
    CreateButton,
    IonLoading,
  },
  setup() {
    const screenWidth = ref(0);

    const route = useRoute();

    const refresher = ref(0);

    watch(route, async (_, newRoute) => {
      if (newRoute.meta.refresh) {
        refresher.value += 1;
      }
    });

    onMounted(() => {
      screenWidth.value = window.innerWidth;
      window.addEventListener("resize", () => {
        screenWidth.value = window.innerWidth;
      });
    });

    return {
      icons: { calendar, cash, settings, today },
      screenWidth,
      route,
      store,
      refresher,
    };
  },
};
</script>

<style></style>
