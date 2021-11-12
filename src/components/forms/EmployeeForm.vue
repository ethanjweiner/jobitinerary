<template>
  <form>
    <ion-grid>
      <ion-row class="ion-justify-content-around">
        <ion-col size="12" size-md="8" size-lg="6">
          <ion-card>
            <ion-card-header>
              <ion-card-title>CONTACT</ion-card-title>
              <ion-card-subtitle>{{
                state.employee.data.name
              }}</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <ion-list>
                <ion-item color="white">
                  <ion-label position="stacked">
                    <ion-icon :icon="icons.mailOutline"></ion-icon>
                    <span style="padding: 5px;">Email</span>
                  </ion-label>
                  <ion-input
                    type="email"
                    disabled
                    placeholder="email"
                    :debounce="config.constants.DEBOUNCE_AMOUNT"
                    @ionInput="$emit('update:modelValue', state.employee)"
                    v-model="state.employee.data.email"
                  ></ion-input>
                </ion-item>
                <ion-item color="white">
                  <ion-label position="stacked">
                    <ion-icon :icon="icons.callOutline"></ion-icon>
                    <span style="padding: 5px;">Phone</span>
                  </ion-label>
                  <ion-input
                    type="tel"
                    inputmode="tel"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    placeholder="123-123-1234"
                    :debounce="config.constants.DEBOUNCE_AMOUNT"
                    @ionInput="$emit('update:modelValue', state.employee)"
                    v-model="state.employee.data.phone"
                  ></ion-input>
                </ion-item>
              </ion-list>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-grid>
  </form>
</template>

<script lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import { callOutline,mailOutline } from "ionicons/icons";

import config from "@/config/config";
import store from "@/store";

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
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
  },
  props: {
    modelValue: Object,
  },
  emits: ["update:modelValue"],
  setup(props: any) {
    const state = reactive({
      employee: props.modelValue,
    });

    return {
      state,
      store,
      icons: {
        mailOutline,
        callOutline,
      },
      config,
    };
  },
};
</script>

<style></style>
