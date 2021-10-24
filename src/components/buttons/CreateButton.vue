<template>
  <ion-fab vertical="bottom" horizontal="start" slot="fixed">
    <ion-fab-button>
      <ion-icon :icon="icons.add"></ion-icon>
    </ion-fab-button>
    <ion-fab-list side="end">
      <ion-fab-button
        @click="
          router.push({
            name: 'New Employee Day',
            params: { employeeID: 'new' },
          })
        "
        >Day</ion-fab-button
      >
      <ion-fab-button @click="newVisit">Visit</ion-fab-button>
      <ion-fab-button
        @click="router.push({ name: 'New Job', params: { customerID: 'new' } })"
        >Job</ion-fab-button
      >
    </ion-fab-list>
  </ion-fab>
</template>

<script>
import { IonFab, IonFabButton, IonIcon, IonFabList } from "@ionic/vue";
import { add } from "ionicons/icons";
import router from "@/router";
import { createVisit } from "@/db";

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
      router.push({ name: "Company Visit", params: { visitID: visit.id } });
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
ion-fab-button {
  margin-left: 10px;
  margin-bottom: 10px;
}
</style>
