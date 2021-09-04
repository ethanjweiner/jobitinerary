<template>
  <ion-page>
    <!-- Note: This setup is the "collapsible large title setup" -->
    <!-- Learn more at https://ionicframework.com/docs/api/title#collapsible-large-titles -->
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
        <SettingsButton />
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Home</ion-title>
          <SettingsButton />
        </ion-toolbar>
      </ion-header>
      <ion-grid>
        <ion-row class="ion-justify-content-around">
          <ion-col size="12" size-sm="6" id="visits-column">
            <ion-card>
              <ion-card-header>
                <h3 class="list-header">
                  <ion-text color="dark">
                    Recent Visits
                  </ion-text>
                </h3>
                <ion-badge color="danger">66</ion-badge>
                <ion-searchbar></ion-searchbar>
              </ion-card-header>
              <ion-card-content>
                <Visits />
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col
            size="12"
            size-sm="6"
            class="ion-hide-sm-down"
            id="jobs-column"
          >
            <ion-card>
              <ion-card-header>
                <h3 class="list-header">
                  <ion-text color="dark">
                    Scheduled Jobs
                  </ion-text>
                </h3>
                <ion-searchbar></ion-searchbar>
              </ion-card-header>
              <ion-card-content>
                <Jobs />
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="12" id="messages-column">
            <ion-card>
              <ion-card-header>
                <h3 class="list-header">
                  <ion-text color="dark">
                    Messages
                  </ion-text>
                </h3>
                <ion-badge color="danger">66</ion-badge>
              </ion-card-header>
              <ion-card-content>
                <Messages />
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
      <CreateButton />
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
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonText,
  IonBadge,
  IonSearchbar,
} from "@ionic/vue";

import SettingsButton from "@/components/buttons/SettingsButton.vue";
import CreateButton from "@/components/buttons/CreateButton.vue";
import Visits from "@/components/lists/Visits.vue";
import Jobs from "@/components/lists/Jobs.vue";
import Messages from "@/components/lists/Messages.vue";

export default {
  name: "Home",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    SettingsButton,
    CreateButton,
    Visits,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonText,
    Jobs,
    Messages,
    IonBadge,
    IonSearchbar,
  },
};
</script>

<style scoped>
ion-grid {
  height: calc(100% - 120px);
}
.ios > ion-grid {
  height: calc(100% - 170px);
}
ion-row {
  height: 100%;
}
ion-col {
  margin-top: 10px;
}
#visits-column,
#jobs-column {
  height: 60%;
}
#messages-column {
  height: 40%;
}
.ios > ion-col {
  margin-top: 0px;
}
ion-card {
  height: 100%;
}
ion-card-content {
  height: 80%;
  padding: 0;
}
ion-card-header {
  border-bottom: 1px solid green;
}
.list-header {
  margin: 0;
  display: inline;
}
ion-searchbar {
  padding-left: 0;
  padding-bottom: 0;
}
</style>
