<template>
  <ion-header>
    <ion-toolbar color="dark">
      <ion-title>
        <ion-text color="light"> Add {{ capitalize(type) }} </ion-text>
      </ion-title>
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
    <ion-button
      color="dark"
      expand="block"
      fill="outline"
      button
      @click="addUser"
      class="ion-text-center"
    >
      <ion-input type="submit"> Create {{ capitalize(type) }} </ion-input>
    </ion-button>
  </ion-content>
</template>

<script lang="ts">
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { reactive, toRefs } from '@vue/reactivity';
import { close } from 'ionicons/icons';

import { capitalize, nameToID } from '@/helpers';
import store from '@/store';

export default {
  name: 'New User Modal',
  components: {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonText,
    IonTitle,
    IonToolbar,
  },
  props: ['type'],
  emits: ['userAdded', 'didDismiss'],
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      name: '',
      email: '',
    });

    const addUser = async () => {
      if (state.name) {
        if (props.type == 'employee') {
          await store.state.user.addEmployee(state.name, state.email);
        } else if (props.type == 'customer') {
          await store.state.user.addCustomer(state.name, state.email);
        } else {
          throw Error('The specified user type is not valid.');
        }
        emit('userAdded', nameToID(state.name));
      } else throw Error('You must enter a name for the new user.');
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
