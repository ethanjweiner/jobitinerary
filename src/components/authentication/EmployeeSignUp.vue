<template>
  <ion-card>
    <form @submit.prevent="activate">
      <ion-item>
        <ion-label position="stacked">Enter Your Activation Token</ion-label>
        <ion-input
          type="text"
          v-model="activationToken"
          placeholder="Enter activation token"
          required
          @keyup.enter="activate"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Create a Password</ion-label>
        <ion-input
          v-model="password"
          type="password"
          placeholder="Enter password"
          required
          @keyup.enter="activate"
        ></ion-input>
      </ion-item>
      <ion-button expand="block" type="submit">Activate</ion-button>
    </form>
  </ion-card>
</template>

<script>
import { IonButton, IonCard, IonInput, IonItem, IonLabel } from "@ionic/vue";
import { reactive, toRefs } from "@vue/reactivity";
import { ref } from "vue";

import { verifyEmployee } from "@/authentication";
import { Employee } from "@/types/users";

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
  setup(props) {
    const credentials = reactive({
      email: props.email,
      password: "",
    });

    const activationToken = ref("");

    const activate = async () => {
      const employeeDoc = await verifyEmployee(activationToken.value);
      const company = (await employeeDoc.get()).data().parentCompany;

      if (employeeDoc) {
        const employee = new Employee(employeeDoc, company);
        if (await employee.init()) employee.signUp(credentials.password);
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
