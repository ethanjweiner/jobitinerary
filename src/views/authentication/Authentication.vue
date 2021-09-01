<template>
  <ion-page>
    <ion-content style="height: 100%;">
      <!-- Don't use sections -->
      <!-- Instead, use a very minimalist, centered form -->
      <!-- Use a sgement to toggle between sign in and sign up -->
      <ion-grid style="width: 100%; height: 100%;">
        <ion-row
          class="ion-justify-content-center ion-align-items-center"
          style="height: 100%;"
        >
          <ion-col :size="state.cardSize">
            <div class="ion-text-start">
              <h3 class="text-secondary">{{ state.title }}</h3>
            </div>
            <ion-segment :value="state.authenticationType" color="primary">
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
import { AuthenticationTitleText } from "@/types";
import LogIn from "@/components/authentication/LogIn.vue";
import CompanySignUp from "@/components/authentication/CompanySignUp.vue";

import {
  IonContent,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/vue";

import { defineComponent } from "vue";

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
  },
  data() {
    return {
      state: {
        authenticationType: "login",
        title: "Log in to JobItinerary",
        cardSize: 6,
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
    setCardSize() {
      this.state.cardSize = Math.min(Math.floor(7000 / window.innerWidth), 12);
    },
  },
  created() {
    this.changeForm(this.state.authenticationType);
    window.addEventListener("resize", () => {
      this.setCardSize();
    });
  },
});
</script>

<style>
div {
  border: 1px solid white;
}
h3 {
  color: #027e46;
}
</style>
