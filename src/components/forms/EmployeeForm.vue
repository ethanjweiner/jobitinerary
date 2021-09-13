<template>
  <form>
    <ion-list>
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
                :value="state.employee.email"
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
                :value="state.employee.phone"
              ></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-list>
  </form>
</template>

<script lang="ts">
import {
  IonList,
  IonInput,
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
} from "@ionic/vue";
import { mailOutline, callOutline } from "ionicons/icons";
import store from "@/store";
import { reactive } from "@vue/reactivity";
export default {
  name: "Employee Form",
  components: {
    IonList,
    IonInput,
    IonItem,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
  },
  props: {
    employee: Object,
  },
  setup(props: any) {
    const state = reactive({
      employee: props.employee,
    });
    return {
      state,
      mailOutline,
      callOutline,
    };
  },
};
</script>

<style></style>
