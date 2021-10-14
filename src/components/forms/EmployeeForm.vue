<template>
  <form>
    <ion-list>
      <ion-grid>
        <ion-row class="ion-justify-content-around">
          <ion-col size="12" size-sm="6">
            <ion-item>
              <ion-label position="stacked">
                <ion-icon :icon="icons.mailOutline"></ion-icon>
                <span style="padding: 5px;">Email</span>
              </ion-label>
              <ion-input
                type="email"
                disabled
                placeholder="email"
                :debounce="store.DEBOUNCE_AMOUNT"
                @ionInput="$emit('update:modelValue', state.employee)"
                v-model="state.employee.data.email"
              ></ion-input>
            </ion-item>
          </ion-col>
          <ion-col size="12" size-sm="6">
            <ion-item>
              <ion-label position="stacked">
                <ion-icon :icon="icons.callOutline"></ion-icon>
                <span style="padding: 5px;">Phone</span>
              </ion-label>
              <ion-input
                type="tel"
                inputmode="tel"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                placeholder="123-123-1234"
                :debounce="store.DEBOUNCE_AMOUNT"
                @ionInput="$emit('update:modelValue', state.employee)"
                v-model="state.employee.data.phone"
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
import { reactive } from "@vue/reactivity";
import store from "@/store";

import { mailOutline, callOutline } from "ionicons/icons";

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
    };
  },
};
</script>

<style></style>
