<template>
  <div style="height: 100%;">
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title> Add {{ capitalize(type) }} </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('didDismiss')">
            <ion-icon :icon="icons.close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item lines="none">
        <ion-text color="tertiary" style="font-size: 13px;"
          >The {{ type }} will receive an email with instructions to setup their
          account.</ion-text
        >
      </ion-item>

      <ion-item>
        <ion-label position="stacked">{{ capitalize(type) }} Name</ion-label>
        <ion-input
          placeholder="name"
          type="text"
          v-model="name"
          @keyup.enter="addUser"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">{{ capitalize(type) }} Email</ion-label>
        <ion-input
          placeholder="email"
          type="email"
          inputmode="email"
          v-model="email"
          @keyup.enter="addUser"
        ></ion-input>
      </ion-item>
      <ion-item button @click="addUser">
        <ion-input type="submit" color="dark">
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
  IonText,
} from "@ionic/vue";

import { close } from "ionicons/icons";

import { capitalize, nameToID } from "@/helpers";
import { reactive, toRefs } from "@vue/reactivity";
import store from "@/store";
import { Company } from "@/types/users";

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
    IonText,
  },
  props: ["type"],
  emits: ["userAdded", "didDismiss"],
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      name: "",
      email: "",
    });

    const addUser = async () => {
      if (state.name && state.email && store.state.user instanceof Company) {
        // ADD USER TO DATABASE
        if (props.type == "employee") {
          // Add employee to database
          await store.state.user.addEmployee(state.name, state.email);
        } else if (props.type == "customer") {
          // Add customer to database
          await store.state.user.addCustomer(state.name, state.email);
        } else {
          throw Error("The specified user type is not valid.");
        }
        emit("userAdded", nameToID(state.name));
        // Add the user locally
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

<style scoped>
ion-header {
  display: block;
}
</style>
