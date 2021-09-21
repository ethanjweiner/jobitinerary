<template>
  <div style="height: 100%;">
    <ion-header>
      <ion-toolbar>
        <ion-title> Add {{ capitalize(type) }} </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('didDismiss')">
            <ion-icon :icon="icons.close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-label position="stacked">{{ capitalize(type) }} Name</ion-label>
        <ion-input placeholder="name" type="text" v-model="name"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">{{ capitalize(type) }} Email</ion-label>
        <ion-input
          placeholder="email"
          type="email"
          inputmode="email"
          v-model="email"
        ></ion-input>
      </ion-item>
      <ion-item button @click="addUser">
        <ion-input type="submit" color="primary">
          Create {{ capitalize(type) }}
        </ion-input>
      </ion-item>
    </ion-content>
  </div>
</template>

<script lang="ts">
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
} from "@ionic/vue";

import { close } from "ionicons/icons";

import { capitalize } from "@/helpers";
import { reactive, toRefs } from "@vue/reactivity";

export default {
  name: "New User Modal",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
  },
  props: ["type"],
  emits: ["userAdded", "didDismiss"],
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      name: "",
      email: "",
    });

    const addUser = () => {
      if (state.name && state.email)
        // Emit an event to change user select to the new user
        emit("userAdded", { name: state.name, email: state.email });
      else throw Error("You must enter a name and email for the new user.");

      emit("didDismiss");
    };

    return {
      ...toRefs(state),
      addUser,
      icons: { close },
      capitalize,
    };
  },
};
</script>

<style></style>
