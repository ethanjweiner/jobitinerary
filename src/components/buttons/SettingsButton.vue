<template>
  <ion-buttons :collapse="true" slot="end">
    <!-- Temporarily Log Out -->
    <ion-icon @click="router.push(link)" :icon="settingsOutline"></ion-icon>
  </ion-buttons>
</template>

<script>
import { settingsOutline } from "ionicons/icons";
import { IonButtons, IonIcon } from "@ionic/vue";
import router from "@/router";
import { globalState } from "@/globalState";
import { computed } from "@vue/reactivity";

export default {
  name: "Settings Button",
  components: {
    IonButtons,
    IonIcon,
  },
  setup() {
    const link = computed(() => `/${globalState.user.kind}/settings`);
    return {
      settingsOutline,
      router,
      link,
    };
  },
};
</script>

<style scoped>
ion-icon {
  font-size: 35px;
  color: rgb(78, 78, 78);
  cursor: pointer;
  margin-right: 8px;
}
ion-icon:hover {
  color: #027e46;
}
</style>
