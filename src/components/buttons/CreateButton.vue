<template>
  <ion-fab vertical="bottom" horizontal="start" slot="fixed">
    <ion-fab-button>
      <ion-icon :icon="add"></ion-icon>
    </ion-fab-button>
    <ion-fab-list side="end">
      <ion-fab-button>Day</ion-fab-button>
      <ion-fab-button>Visit</ion-fab-button>
      <ion-fab-button>Job</ion-fab-button>
    </ion-fab-list>
  </ion-fab>
</template>

<script>
import { IonFab, IonFabButton, IonIcon, IonFabList } from "@ionic/vue";
import { add } from "ionicons/icons";
export default {
  name: "Create Button",
  components: {
    IonFab,
    IonFabButton,
    IonFabList,
    IonIcon,
  },
  setup() {
    return {
      add,
    };
  },
};
</script>

<style scoped>
ion-fab-button {
  transform: scale(1.2);
  margin-left: 10px;
  margin-bottom: 10px;
}
</style>
