<template>
  <ion-page>
    <ion-content style="height: 100%;">
      <ion-grid style="width: 100%; height: 100%;">
        <ion-row
          class="ion-justify-content-center ion-align-items-center"
          style="height: 100%;"
        >
          <ion-col
            size-xs="11"
            size-sm="10"
            size-md="6"
            size-lg="5"
            size-xl="4"
          >
            <ion-text
              :color="
                state.authenticationType == 'login' ? 'primary' : 'secondary'
              "
              class="ion-text-start"
            >
              <h1>{{ state.title }}</h1>
            </ion-text>
            <ion-segment :value="state.authenticationType" color="dark">
              <ion-segment-button value="login" @click="changeForm('login')">
                <ion-label>Login</ion-label>
              </ion-segment-button>
              <ion-segment-button
                value="company-signup"
                @click="changeForm('company-signup')"
              >
                <ion-label>Sign Up</ion-label>
              </ion-segment-button>
            </ion-segment>
            <LogIn v-if="state.authenticationType == 'login'" />
            <CompanySignUp v-else />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from "@ionic/vue";
import { defineComponent } from "vue";

import { AuthenticationTitleText } from "@/types/auxiliary";
import LogIn from "@/components/authentication/LogIn.vue";
import CompanySignUp from "@/components/authentication/CompanySignUp.vue";

export default defineComponent({
  name: "Authentication",
  components: {
    IonPage,
    IonGrid,
    IonRow,
    IonCol,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonContent,
    LogIn,
    CompanySignUp,
    IonText,
  },
  data() {
    return {
      state: {
        authenticationType: "login",
        title: "Log in to JobItinerary",
      },
    };
  },
  methods: {
    changeForm(authenticationType: string) {
      switch (authenticationType) {
        case "company-signup":
          this.state.authenticationType = "company-signup";
          this.state.title = AuthenticationTitleText.CompanySignUp;
          break;
        case "login":
          this.state.authenticationType = "login";
          this.state.title = AuthenticationTitleText.LogIn;
          break;
        default:
          break;
      }
    },
  },
  created() {
    this.changeForm(this.state.authenticationType);
  },
});
</script>

<style scoped>
div {
  border: 1px solid white;
}
</style>
