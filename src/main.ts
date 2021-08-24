import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Individual firebase imports
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";

import { IonicVue } from "@ionic/vue";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Theme variables */
import "./theme/variables.css";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYETh9rM2cUM5k3xNM92QmMpjQlsGWlgc",
  authDomain: "job-itinerary-v3.firebaseapp.com",
  projectId: "job-itinerary-v3",
  storageBucket: "job-itinerary-v3.appspot.com",
  messagingSenderId: "86873034738",
  appId: "1:86873034738:web:1c52f2e398112db4bda56b",
  measurementId: "G-J0RWW0KTZ4",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth();
export const db = firebase.firestore();

const app = createApp(App)
  .use(IonicVue)
  .use(router);

router.isReady().then(() => {
  app.mount("#app");
});
