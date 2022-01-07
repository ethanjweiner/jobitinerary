<template>
  <ion-fab vertical="bottom" horizontal="end" slot="fixed">
    <ion-fab-button>
      <ion-icon :icon="icons.add"></ion-icon>
    </ion-fab-button>
    <ion-fab-list side="top">
      <ion-fab-button
        color="primary"
        @click="
          router.push({
            name: 'New Employee Day',
            params: { employeeID: 'new' },
          })
        "
        >Day</ion-fab-button
      >
      <ion-fab-button color="primary" @click="newVisit">Visit</ion-fab-button>
      <ion-fab-button
        color="primary"
        @click="router.push({ name: 'New Job', params: { customerID: 'new' } })"
        >Job</ion-fab-button
      >
    </ion-fab-list>
  </ion-fab>
</template>

<script>
import { IonFab, IonFabButton, IonFabList, IonIcon } from "@ionic/vue";
import { add } from "ionicons/icons";

import { createVisit } from "@/db";
import router from "@/router";

export default {
  name: "Create Button",
  components: {
    IonFab,
    IonFabButton,
    IonFabList,
    IonIcon,
  },
  setup() {
    const newVisit = async () => {
      const visit = await createVisit();
      router.push({ name: "Company Visit", params: { id: visit.id } });
    };
    return {
      newVisit,
      icons: { add },
      router,
    };
  },
};
</script>

<style scoped>
ion-fab {
  transform: scale(1.3);
}
ion-fab {
  margin-right: 10px;
  margin-bottom: 10px;
}
@media (max-width: 768px) {
  ion-fab {
    margin-bottom: 55px;
  }
}
</style>
