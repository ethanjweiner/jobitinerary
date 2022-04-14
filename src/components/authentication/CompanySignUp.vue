<template>
  <ion-card>
    <form @submit.prevent="signUp">
      <ion-item>
        <ion-label color="secondary" position="stacked">Company Name</ion-label>
        <ion-input
          @keyup.enter="signUp"
          v-model="name"
          placeholder="Company"
          required
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-label color="secondary" position="stacked"
          >Company Email</ion-label
        >
        <ion-input
          v-model="email"
          type="email"
          placeholder="Enter email"
          required
          @keyup.enter="signUp"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-label color="secondary" position="stacked"
          >Company Phone Number</ion-label
        >
        <ion-input
          v-model="phone"
          type="tel"
          inputmode="tel"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          placeholder="123-123-1234"
          required
          @keyup.enter="signUp"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-label color="secondary" position="stacked">Password</ion-label>
        <ion-input
          v-model="password"
          type="password"
          placeholder="Enter password"
          required
          @keyup.enter="signUp"
        ></ion-input>
      </ion-item>
      <p class="ion-margin">
        Looking to sign up as an employee? Ask your company to add you to their
        system and send you an activation email.
      </p>
      <button-with-spinner
        :loading="loading"
        title="Sign Up"
        color="secondary"
        type="submit"
        expand="block"
      >
      </button-with-spinner>
    </form>
  </ion-card>
</template>

<script lang="ts">
import { IonCard, IonInput, IonItem, IonLabel } from "@ionic/vue";
import { reactive, ref, toRefs } from "@vue/reactivity";

import { signUpCompany } from "@/authentication";

import ButtonWithSpinner from "../buttons/ButtonWithSpinner.vue";

export default {
  name: "Company Sign Up",
  components: {
    IonItem,
    IonInput,
    IonLabel,
    IonCard,
    ButtonWithSpinner,
  },
  setup() {
    const credentials = reactive({
      name: "",
      email: "",
      phone: "",
      password: "",
    });

    const resetCredentials = () => {
      credentials.name = "";
      credentials.email = "";
      credentials.phone = "";
      credentials.password = "";
    };

    const loading = ref(false);

    const signUp = async () => {
      loading.value = true;
      if (credentials.name && credentials.email && credentials.password) {
        try {
          await signUpCompany(credentials);
          resetCredentials();
        } finally {
          loading.value = false;
        }
      }
    };

    return { ...toRefs(credentials), signUp, loading };
  },
};
</script>

<style></style>
