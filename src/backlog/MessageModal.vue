<template>
  <div id="message-modal">
    <ion-toolbar>
      <ion-title>Message for {{ recipient.name }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="$emit('closeModal')">
          <ion-icon :icon="icons.close"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
    <form @submit.prevent="sendMessage" style="height: 100%;">
      <ion-content class="ion-padding" style="height: 100%;">
        <ion-card>
          <ion-item v-if="state.showTextAreas">
            <ion-textarea
              auto-grow
              placeholder="Send a message ..."
              v-model="state.message.text"
              rows="5"
            ></ion-textarea>
          </ion-item>
        </ion-card>

        <ImageWithCaption :hideClose="true" v-model="state.message.image" />
        <ion-button type="submit" expand="block">
          <ion-icon :icon="icons.sendOutline"></ion-icon>
          <span style="padding-left: 10px;">Send</span></ion-button
        >
      </ion-content>
    </form>
  </div>
</template>

<script lang="ts">
import {
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonTextarea,
  IonItem,
  IonCard,
  IonContent,
} from "@ionic/vue";

import { close, sendOutline } from "ionicons/icons";
import { reactive } from "@vue/reactivity";
import { emptyMessage, Message, Thread } from "@/types/work_units";
import ImageWithCaption from "../components/ImageWithCaption.vue";
import store from "@/store";

export default {
  name: "Message Modal",
  props: {
    recipient: Object,
  },
  emits: ["closeModal"],
  setup(props: any, { emit }: { emit: any }) {
    // Create a new thread...
    const state = reactive<{ message: Message; showTextAreas: boolean }>({
      message: emptyMessage(),
      showTextAreas: false,
    });

    const sendMessage = () => {
      const thread: Thread = {
        id: Date.now(),
        timestamp: Date.now(),
        messages: [state.message],
        sender:
          store.state.userType == "company"
            ? store.state.company
            : store.state.employeeState.employee,
        receiver: props.recipient,
      };
      // ADD THREAD TO DATABASE
      console.log(thread);
      emit("closeModal");
    };

    setTimeout(() => (state.showTextAreas = true), 250);

    return {
      state,
      icons: { close, sendOutline },
      sendMessage,
    };
  },
  components: {
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    ImageWithCaption,
    IonTextarea,
    IonItem,
    IonCard,
    IonContent,
  },
};
</script>

<style scoped>
#message-modal {
  height: calc(100% - 50px);
}

form {
  height: fit-content;
}
</style>
