<template>
  <ion-fab
    class="ion-padding"
    vertical="bottom"
    horizontal="end"
    slot="fixed"
    color="primary"
  >
    <ion-fab-button>
      <ion-icon :icon="chatbubbleOutline"></ion-icon>
    </ion-fab-button>
  </ion-fab>
</template>

<script>
import { IonFab, IonFabButton, IonIcon } from "@ionic/vue";
import { chatbubbleOutline } from "ionicons/icons";

export default {
  name: "Send Message",
  components: {
    IonFab,
    IonFabButton,
    IonIcon,
  },
  setup() {
    return {
      chatbubbleOutline,
    };
  },
};
</script>

<style scoped>
ion-fab-button {
  transform: scale(1.2);
}
</style>
