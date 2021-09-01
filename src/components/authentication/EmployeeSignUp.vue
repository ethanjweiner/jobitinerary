<template>
  <ion-card>
    <form @submit.prevent="activate">
      <ion-item>
        <ion-label position="stacked">Enter Your Activation Token</ion-label>
        <ion-input
          v-model="activationToken"
          placeholder="Enter activation token"
          required
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Create a Password</ion-label>
        <ion-input
          v-model="password"
          type="password"
          placeholder="Enter password"
          required
        ></ion-input>
      </ion-item>
      <ion-button expand="block" type="submit">Activate</ion-button>
    </form>
  </ion-card>
</template>

<script lang="ts">
import { IonItem, IonCard, IonInput, IonLabel, IonButton } from "@ionic/vue";
import { ref } from "vue";
import { reactive, toRefs } from "@vue/reactivity";
import { activateEmployee } from "@/store";

export default {
  name: "Employee Sign Up",
  components: {
    IonItem,
    IonInput,
    IonLabel,
    IonButton,
    IonCard,
  },
  props: {
    email: String,
  },
  setup(props: any) {
    const credentials = reactive({
      email: props.email,
      password: null,
    });

    const activationToken = ref("");

    const activate = async () => {
      try {
        await activateEmployee(credentials, activationToken.value);
      } catch (error) {
        console.log(error);
      }
    };

    return { ...toRefs(credentials), activate, activationToken };
  },
};
</script>

<style>
ion-card {
  margin: 0 !important;
  margin-top: 10px !important;
}
</style>
