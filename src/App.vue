<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
  <!-- Global Alerts -->
  <ion-toast
    :is-open="alertIsOpen"
    :message="store.alert.message"
    :color="store.alert.color"
    :duration="5000"
    @didDismiss="setAlertOpen(false)"
  >
  </ion-toast>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet, IonToast } from "@ionic/vue";
import { defineComponent, ref, watch } from "vue";

import store from "./store";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    IonToast,
  },
  setup() {
    document.body.classList.remove("dark");

    const alertIsOpen = ref(false);
    const setAlertOpen = (state: boolean) => (alertIsOpen.value = state);

    watch(store.alert, () => {
      if (store.alert.message) setAlertOpen(true);
    });

    return {
      alertIsOpen,
      setAlertOpen,
      store,
    };
  },
});
</script>
