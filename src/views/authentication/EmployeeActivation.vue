<template>
  <ion-page>
    <ion-content style="height: 100%;">
      <ion-grid style="width: 100%; height: 100%;">
        <ion-row
          class="ion-justify-content-center ion-align-items-center"
          style="height: 100%;"
        >
          <ion-col
            size-xs="11"
            size-sm="10"
            size-md="6"
            size-lg="5"
            size-xl="4"
          >
            <div class="ion-text-start">
              <h3 class="text-secondary">
                Activate Employee Account for {{ email }}
              </h3>
            </div>
            <EmployeeSignUp :email="email" />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonCol,IonContent, IonGrid, IonPage, IonRow } from "@ionic/vue";
import { defineComponent } from "vue";

import EmployeeSignUp from "@/components/authentication/EmployeeSignUp.vue";

export default defineComponent({
  name: "Authentication",
  components: {
    IonPage,
    IonGrid,
    IonRow,
    IonCol,
    IonContent,
    EmployeeSignUp,
  },
  props: {
    email: String,
  },
});
</script>

<style>
div {
  border: 1px solid white;
}
h3 {
  color: #027e46;
}
</style>
