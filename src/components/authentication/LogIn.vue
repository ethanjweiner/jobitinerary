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
      <ion-button type="submit" expand="block">Login</ion-button>
    </form>
  </ion-card>
</template>

<script>
import { IonItem, IonInput, IonLabel, IonButton, IonCard } from "@ionic/vue";
import { reactive, toRefs } from "@vue/reactivity";
import { signIn } from "@/helpers";

export default {
  name: "Log In",
  components: {
    IonItem,
    IonInput,
    IonLabel,
    IonButton,
    IonCard,
  },
  setup() {
    const credentials = reactive({
      email: null,
      password: null,
    });
    const logIn = async () => {
      try {
        await signIn(credentials.email, credentials.password);
      } catch (error) {
        console.log(error);
      } finally {
        credentials.email = null;
        credentials.password = null;
      }
    };
    return { ...toRefs(credentials), logIn };
  },
};
</script>

<style>
ion-card {
  margin: 0 !important;
  margin-top: 10px !important;
}
</style>
