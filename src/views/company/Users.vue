<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{
          username ? username : capitalize(type) + "s"
        }}</ion-title>
        <SettingsButton />
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{
            username ? username : capitalize(type) + "s"
          }}</ion-title>
          <SettingsButton />
        </ion-toolbar>
      </ion-header>
      <!-- On select, route to the users page w/ a prop -->
      <ion-toolbar id="select-user-toolbar">
        <UserSelect
          ref="userSelect"
          :users="users"
          :selectedUser="username"
          :type="type"
          @userChange="changeUser"
        />
        <ion-buttons slot="end">
          <ion-button style="margin-left: 10px;">
            <ion-icon :icon="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <div id="user-container" class="ion-text-center">
        <slot v-if="username"></slot>
        <ion-grid v-else>
          <ion-row>
            <ion-col class="ion-align-self-center">
              <div>
                <ion-text color="dark"> Please select {{ type }}. </ion-text>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonButton,
  IonIcon,
  IonButtons,
} from "@ionic/vue";

import { capitalize } from "@/helpers";

import SettingsButton from "@/components/buttons/SettingsButton.vue";
import UserSelect from "@/components/UserSelect.vue";
import { add } from "ionicons/icons";
import router from "@/router";

// Sort users alphabetically, with none selected
// Show user if a user is selected
export default {
  name: "Users",
  props: ["users", "username", "type"],
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    SettingsButton,
    UserSelect,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonButton,
    IonIcon,
    IonButtons,
  },
  setup(props: any) {
    const changeUser = ({ name }: { name: string }) => {
      router.push({
        name: capitalize(props.type),
        params: { username: name },
      });
    };
    return {
      add,
      changeUser,
      capitalize,
    };
  },
};
</script>

<style scoped>
ion-grid {
  border: 5px dashed darkgray;
  background-color: rgb(233, 233, 233);
  cursor: pointer;
}
ion-grid,
ion-row {
  height: 100%;
}
#select-user-toolbar {
  max-width: 500px;
  margin-top: 10px;
}
</style>
