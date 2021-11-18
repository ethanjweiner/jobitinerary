<template>
  <ion-page :class="route.meta.class">
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar :slot="screenWidth < 768 ? 'bottom' : 'top'" color="primary">
        <ion-title class="main-title"> JobItinerary</ion-title>
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
        <div slot="start">dfdf</div>
      </ion-tab-bar>
    </ion-tabs>
    <CreateButton />
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
} from "@ionic/vue";
import { onMounted, ref } from "@vue/runtime-core";
import { cart, hammer, home, settings } from "ionicons/icons";
import { useRoute } from "vue-router";

import CreateButton from "@/components/buttons/CreateButton.vue";

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
  },
  setup() {
    const screenWidth = ref(0);

    const route = useRoute();

    onMounted(() => {
      screenWidth.value = window.innerWidth;
      window.addEventListener("resize", () => {
        screenWidth.value = window.innerWidth;
      });
    });

    return {
      icons: { home, cart, hammer, settings },
      screenWidth,
      route,
    };
  },
};
</script>

<style scoped>
.main-title {
  color: white;
  font-size: 25px;
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
