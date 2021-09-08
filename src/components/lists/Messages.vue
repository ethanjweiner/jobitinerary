<template>
  <ion-card>
    <ion-card-header>
      <div class="ion-text-center">
        <h3 class="list-header">
          <ion-text color="dark">
            Messages
          </ion-text>
        </h3>
        <ion-badge color="danger">{{ numUnreadMessages }}</ion-badge>
      </div>
    </ion-card-header>
    <ion-card-content>
      <ion-content>
        <ion-list>
          <MessageItem
            v-for="(message, index) in messages"
            :key="index"
            :message="message"
          />
        </ion-list>

        <ion-infinite-scroll
          @ionInfinite="loadData($event)"
          threshold="100px"
          id="infinite-scroll"
        >
          <ion-infinite-scroll-content
            loading-spinner="bubbles"
            loading-text="Loading messages..."
          >
          </ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ion-content>
    </ion-card-content>
  </ion-card>
</template>

<script lang="ts">
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonContent,
  IonCard,
  IonCardHeader,
  IonBadge,
  IonText,
  IonCardContent,
} from "@ionic/vue";

import MessageItem from "./items/MessageItem.vue";

import { Message, sampleMessage } from "@/types";

import { computed, ref } from "vue";

export default {
  name: "Visits",
  components: {
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonList,
    IonContent,
    MessageItem,
    IonCard,
    IonCardHeader,
    IonBadge,
    IonText,
    IonCardContent,
  },
  setup() {
    const messages = ref<Array<Message>>([]);
    const numUnreadMessages = computed(() => {
      return messages.value.reduce((numUnreadMessagesSoFar, message) => {
        if (!message.readByRecipient) return ++numUnreadMessagesSoFar;
        return numUnreadMessagesSoFar;
      }, 0);
    });

    const pushData = () => {
      const max = messages.value.length + 5;
      const min = max - 5;
      for (let i = min; i < max; i++) {
        messages.value.push(sampleMessage);
      }
    };

    const loadData = (ev: any) => {
      setTimeout(() => {
        pushData();
        console.log("Loaded data");
        ev.target.complete();

        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (messages.value.length == 1000) {
          ev.target.disabled = true;
        }
      }, 500);
    };

    pushData();

    return {
      loadData,
      messages,
      numUnreadMessages,
    };
  },
};
</script>

<style scoped>
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
