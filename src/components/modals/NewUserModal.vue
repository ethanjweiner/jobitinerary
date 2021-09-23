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
      <div class="ion-padding">
        <ion-note
          >The {{ type }} will receive an email with instructions to setup their
          account.</ion-note
        >
      </div>

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
  IonNote,
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
    IonNote,
  },
  props: ["type"],
  emits: ["userAdded", "didDismiss"],
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      name: "",
      email: "",
    });

    const addUser = () => {
      if (state.name && state.email) {
        // ADD USER TO DATABASE
        if (props.type == "employee") console.log("adding employee");
        // ADD EMPLOYEE
        else if (props.type == "customer") console.log("adding customer");
        // ADD CUSTOMER
        else throw Error("The specified user type is not valid.");
        emit("userAdded", { name: state.name, email: state.email });
      } else throw Error("You must enter a name and email for the new user.");

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
