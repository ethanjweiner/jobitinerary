<template>
  <ion-card>
    <form @submit.prevent="signUp">
      <ion-item>
        <ion-label position="stacked">Company Name</ion-label>
        <ion-input
          @keyup.enter="signUp"
          v-model="name"
          placeholder="Company"
          required
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Company Email</ion-label>
        <ion-input
          v-model="email"
          type="email"
          placeholder="Enter email"
          required
          @keyup.enter="signUp"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Company Phone Number</ion-label>
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
        <ion-label position="stacked">Password</ion-label>
        <ion-input
          v-model="password"
          type="password"
          placeholder="Enter password"
          required
          @keyup.enter="signUp"
        ></ion-input>
      </ion-item>
      <p class="ion-padding" style="margin-top: 0; margin-bottom: 0;">
        Looking to sign up as an employee? Ask your company to add you to their
        system and send you an activation email.
      </p>
      <ion-button expand="block" type="submit">Sign Up</ion-button>
    </form>
  </ion-card>
</template>

<script lang="ts">
import { IonItem, IonCard, IonInput, IonLabel, IonButton } from "@ionic/vue";
import { reactive, toRefs } from "@vue/reactivity";
import { signUpCompany } from "@/authentication";

export default {
  name: "Company Sign Up",
  components: {
    IonItem,
    IonInput,
    IonLabel,
    IonButton,
    IonCard,
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

    const signUp = async () => {
      if (credentials.name && credentials.email && credentials.password) {
        try {
          await signUpCompany(credentials);
        } catch (error) {
          console.log(error);
        } finally {
          resetCredentials();
        }
      }
    };

    return { ...toRefs(credentials), signUp };
  },
};
</script>

<style></style>
