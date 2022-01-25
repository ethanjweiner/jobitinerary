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
          tab="home"
          href="/company/home"
        >
          <ion-icon :icon="icons.home" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button
          :layout="screenWidth < 768 ? 'icon-top' : 'icon-start'"
          tab="customers"
          href="/company/customers"
        >
          <ion-icon :icon="icons.cart" />
          <ion-label>Customers</ion-label>
        </ion-tab-button>

        <ion-tab-button
          :layout="screenWidth < 768 ? 'icon-top' : 'icon-start'"
          tab="employeees"
          href="/company/employees"
        >
          <ion-icon :icon="icons.hammer" />
          <ion-label>Employees</ion-label>
        </ion-tab-button>
        <ion-tab-button
          class="settings-tab-button"
          tab="settings"
          href="/company/settings"
          :layout="screenWidth < 768 ? 'icon-top' : 'icon-start'"
        >
          <ion-icon :icon="icons.settings"></ion-icon>
          <ion-label>Settings</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
    <!-- Global Alerts -->
    <ion-toast
      :is-open="alertIsOpen"
      :message="store.alert.message"
      :color="store.alert.color"
      :duration="5000"
      @didDismiss="setAlertOpen(false)"
    >
    </ion-toast>
  </ion-page>
</template>

<script lang="ts">
import {
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToast,
} from "@ionic/vue";
import { onMounted, ref, watch } from "@vue/runtime-core";
import { cart, hammer, home, list, settings } from "ionicons/icons";
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
    IonToast,
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

    const alertIsOpen = ref(false);
    const setAlertOpen = (state: boolean) => (alertIsOpen.value = state);

    watch(store.alert, () => {
      if (store.alert.message) setAlertOpen(true);
    });

    onMounted(() => {
      screenWidth.value = window.innerWidth;
      window.addEventListener("resize", () => {
        screenWidth.value = window.innerWidth;
      });
    });

    return {
      icons: { home, cart, hammer, settings, list },
      screenWidth,
      route,
      alertIsOpen,
      store,
      refresher,
      setAlertOpen,
    };
  },
};
</script>

<style scoped>
.main-title {
  font-size: 25px;
  color: var(--ion-color-primary);
  background-color: white;
  border-radius: 0px 0px 40px 40px;
  box-shadow: 0px 0px 10px grey;
}
@media (max-width: 768px) {
  .main-title,
  .settings-tab-button {
    display: none;
  }
}

@media (min-width: 768px) {
  ion-tab-button {
    font-size: 15px;
  }
}
</style>
