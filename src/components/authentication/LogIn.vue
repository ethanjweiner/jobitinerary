<template>
  <ion-card>
    <form @submit.prevent="logIn">
      <ion-item>
        <ion-label position="stacked">Employee or Company Email</ion-label>
        <ion-input
          v-model="email"
          type="email"
          placeholder="Enter email"
          @keyup.enter="logIn"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Password</ion-label>
        <ion-input
          v-model="password"
          type="password"
          placeholder="Enter password"
          @keyup.enter="logIn"
        ></ion-input>
      </ion-item>
      <ButtonWithSpinner
        :loading="loading"
        title="Login"
        color="primary"
        type="submit"
        expand="block"
      >
      </ButtonWithSpinner>
    </form>
  </ion-card>
</template>

<script>
import { IonCard, IonInput, IonItem, IonLabel } from "@ionic/vue";
import { reactive, ref, toRefs } from "@vue/reactivity";

import { signIn } from "@/authentication";

import ButtonWithSpinner from "../buttons/ButtonWithSpinner.vue";

export default {
  name: "Log In",
  components: {
    IonItem,
    IonInput,
    IonLabel,
    IonCard,
    ButtonWithSpinner,
  },
  setup() {
    const credentials = reactive({
      email: null,
      password: null,
    });

    const resetCredentials = () => {
      credentials.email = null;
      credentials.password = null;
    };

    const loading = ref(false);

    const logIn = async () => {
      loading.value = true;
      try {
        await signIn(credentials.email, credentials.password);
        resetCredentials();
      } finally {
        loading.value = false;
      }
    };
    return { ...toRefs(credentials), logIn, loading };
  },
};
</script>

<style>
ion-card {
  margin: 0 !important;
  margin-top: 10px !important;
}
</style>
