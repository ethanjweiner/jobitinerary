<template>
  <ion-buttons :collapse="true" slot="end">
    <!-- Temporarily Log Out -->
    <ion-icon @click="auth.signOut()" :icon="settings"></ion-icon>
  </ion-buttons>
</template>

<script>
import { auth } from "@/main";
import { settings } from "ionicons/icons";
import { IonButtons, IonIcon } from "@ionic/vue";

export default {
  name: "Settings Button",
  components: {
    IonButtons,
    IonIcon,
  },
  setup() {
    return {
      settings,
      auth,
    };
  },
};
</script>

<style scoped>
ion-icon {
  font-size: 35px;
  color: grey;
  cursor: pointer;
}
</style>
