<template>
  <ion-buttons :collapse="true" slot="end">
    <ion-icon
      @click="router.push(routerPath)"
      :icon="icons.settingsOutline"
    ></ion-icon>
  </ion-buttons>
</template>

<script>
import { IonButtons, IonIcon } from "@ionic/vue";
import { computed } from "@vue/reactivity";
import { settingsOutline } from "ionicons/icons";

import router from "@/router";
import store from "@/store";

export default {
  name: "Settings Button",
  components: {
    IonButtons,
    IonIcon,
  },
  setup() {
    const { state } = store;
    const routerPath = computed(() => `/${state.userType}/settings`);
    return {
      icons: { settingsOutline },
      router,
      routerPath,
    };
  },
};
</script>

<style scoped>
ion-icon {
  font-size: 35px;
  color: var(--ion-color-light);
  cursor: pointer;
  margin-right: 8px;
}
ion-icon:hover {
  color: #027e46;
}
</style>
