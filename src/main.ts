import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
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

// Custom progressive-web-app elements (e.g. camera in web app)
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import { IonicVue } from "@ionic/vue";
// Individual firebase imports
import firebase from "firebase/app";
import { App as AppType, createApp } from "vue";

import App from "./App.vue";
import { signOut } from "./authentication";
import { loadUser } from "./authentication";
import router from "./router";
import store from "./store";

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
export const storage = firebase.storage();

// Set up emulators in localhost environments
if (location.hostname === "localhost") {
  db.useEmulator("localhost", 8088);
  auth.useEmulator("http://localhost:9099");
  storage.useEmulator("localhost", 9199);
}

export const companiesCollection = db.collection("companies");
export const employeesCollection = db.collectionGroup("employees");

// SET UP THE USER UPON ANY AUTH CHANGES
let app: null | AppType = null;

// Set up global error handler

window.onerror = (message) => {
  store.setAlert({ message: message as string, color: "danger" });
  setTimeout(() => store.resetAlert(), 0);
};

auth.onAuthStateChanged(async (user) => {
  //
  if (!app) {
    // Create app and update user

    app = createApp(App)
      .use(IonicVue)
      .use(router);

    defineCustomElements(window);
    await router.isReady();

    app.config.errorHandler = (err) => {
      const error = err as Error;
      store.setAlert({ message: error.message, color: "danger" });
      setTimeout(() => store.resetAlert(), 0);
    };

    if (user) {
      await loadUser(user);
    } else {
      await signOut();
    }
    app.mount("#app");
  }

  if (user) {
    await loadUser(user);
  } else {
    await signOut();
  }
});

// Global route guards
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !auth.currentUser) {
    router.push("/");
  }
});
