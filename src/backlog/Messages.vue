<template>
  <ion-card-header>
    <div class="ion-text-center">
      <ion-badge color="danger" style="margin-right: 5px;">{{
        numUnreadThreads
      }}</ion-badge>
      <h3 class="list-header">
        <ion-text color="dark">
          Messages
        </ion-text>
      </h3>
    </div>
  </ion-card-header>
  <ion-card-content>
    <ion-content>
      <ion-list>
        <MessageItem
          v-for="message in recentMessages"
          :key="message.timestamp"
          :message="message"
        />
      </ion-list>

      <ion-infinite-scroll
        @ionInfinite="$emit('maxReached', $event)"
        threshold="100px"
        id="infinite-scroll"
      >
        <ion-infinite-scroll-content
          loading-spinner="bubbles"
          loading-text="Loading threads..."
        >
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-card-content>
</template>

<script lang="ts">
import {
  IonBadge,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonText,
} from "@ionic/vue";
import { computed } from "vue";

import { auth } from "@/main";
import { Message,Thread } from "@/types/units";

import MessageItem from "./MessageItem.vue";

export default {
  name: "Messages",
  props: {
    threads: Array,
  },
  emits: ["maxReached"],
  setup(props: any) {
    // mostRecentMessage: Retrieves the most recent message in a given thread directed to the current user
    const mostRecentMessageToUser = (thread: Thread): Message => {
      const user = auth.currentUser;
      if (user) {
        const mostRecentMessage = thread.messages.find((message) => {
          if (message.to) return message.to.email == user.email;
          return false;
        });
        if (mostRecentMessage) return mostRecentMessage;
      }
      // If none could be found, just return the first message in the thread
      return thread.messages[0];
    };

    const recentMessages = computed(() =>
      props.threads
        .map(mostRecentMessageToUser)
        .sort(
          (message1: Message, message2: Message) =>
            message1.timestamp > message2.timestamp
        )
    );

    const numUnreadThreads = computed(() =>
      props.threads.reduce((numUnreadThreadsSoFar: number, thread: Thread) => {
        if (!mostRecentMessageToUser(thread).readByRecipient)
          return ++numUnreadThreadsSoFar;
        return numUnreadThreadsSoFar;
      }, 0)
    );

    return {
      numUnreadThreads,
      recentMessages,
    };
  },
  components: {
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonList,
    IonContent,
    MessageItem,
    IonCardHeader,
    IonBadge,
    IonText,
    IonCardContent,
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
