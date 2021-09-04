<template>
  <ion-content>
    <ion-list>
      <MessageItem
        v-for="message in messages"
        :key="message.id"
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
</template>

<script lang="ts">
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonContent,
} from "@ionic/vue";

import MessageItem from "./items/MessageItem.vue";

import { Message, sampleMessage } from "@/types";

import { ref } from "vue";

export default {
  name: "Visits",
  components: {
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonList,
    IonContent,
    MessageItem,
  },
  setup() {
    const messages = ref<Array<Message>>([]);

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
    };
  },
};
</script>

<style scoped></style>
