<template>
  <div>
    <ion-grid>
      <ion-row>
        <ion-col class="list">
          <Visits />
        </ion-col>
      </ion-row>
    </ion-grid>
    <form class="ion-padding">
      <ion-list>
        <ion-list-header>Contact Info</ion-list-header>
        <ion-grid>
          <ion-row class="ion-justify-content-around">
            <ion-col size="12" size-sm="6">
              <ion-item>
                <ion-label position="stacked">
                  <ion-icon :icon="mailOutline"></ion-icon>
                  <span style="padding: 5px;">Email</span>
                </ion-label>
                <ion-input
                  type="email"
                  placeholder="email"
                  :value="employee.email"
                ></ion-input>
              </ion-item>
            </ion-col>
            <ion-col size="12" size-sm="6">
              <ion-item>
                <ion-label position="stacked">
                  <ion-icon :icon="callOutline"></ion-icon>
                  <span style="padding: 5px;">Phone</span>
                </ion-label>
                <ion-input
                  type="tel"
                  inputmode="tel"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  placeholder="123-123-1234"
                  :value="employee.phone"
                ></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-list>
    </form>
  </div>
</template>

<script lang="ts">
import {
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
} from "@ionic/vue";

import Visits from "@/components/lists/Visits.vue";
import { mailOutline, callOutline } from "ionicons/icons";

export default {
  name: "Employee",
  props: ["employee"],
  components: {
    IonList,
    IonListHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    Visits,
  },
  setup() {
    return {
      mailOutline,
      callOutline,
    };
  },
};
</script>

<style scoped></style>
