<template>
  <ion-grid class="ion-justify-content-center">
    <ion-row class="ion-justify-content-center">
      <ion-col size="12" size-sm="12" size-md="11" size-lg="9" size-xl="7">
        <ion-card>
          <ion-card-content class="ion-text-center">
            Nothing to see here.
          </ion-card-content>
        </ion-card>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts">
import { IonGrid, IonRow, IonCol, IonCard, IonCardContent } from "@ionic/vue";

export default {
  name: "List Placeholder",
  components: { IonGrid, IonRow, IonCol, IonCard, IonCardContent },
};
</script>

<style scoped>
ion-card {
  --background: rgb(224, 224, 224);
}

ion-card-content {
  font-size: 25px;
}

ion-grid {
  height: calc(100% - 100px);
}

ion-row {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
