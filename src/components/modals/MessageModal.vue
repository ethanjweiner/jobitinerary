<template>
  <div id="message-modal">
    <ion-toolbar>
      <ion-title>Send Message</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="closeModal">
          <ion-icon :icon="close"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
    <ion-content>
      <div style="padding-left: 25px;">
        <ion-note>For visit on {{ visit.date.substring(0, 10) }}</ion-note>
      </div>
      <form @submit.prevent="sendMessage" class="ion-padding">
        <ion-card class="ion-padding">
          <ion-label position="stacked">
            Message
          </ion-label>
          <textarea
            rows="10"
            class="message-textarea"
            placeholder="Send a message to your company..."
          ></textarea>
        </ion-card>
        <ImageWithCaption :image="message.image" />
        <ion-button type="submit" expand="block">
          <ion-icon :icon="sendOutline"></ion-icon>
          <span style="padding-left: 10px;">Send</span></ion-button
        >
      </form>
    </ion-content>
  </div>
</template>

<script lang="ts">
import {
  IonToolbar,
  IonTitle,
  IonNote,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonCard,
  IonLabel,
} from "@ionic/vue";

import { close, sendOutline } from "ionicons/icons";
import { reactive, toRefs } from "@vue/reactivity";
import { sampleMessage } from "@/types";
import ImageWithCaption from "../ImageWithCaption.vue";

export default {
  name: "Message Modal",
  props: ["visit"],
  setup(props: any, { emit }: { emit: any }) {
    sampleMessage.text = "";
    const state = reactive({
      message: sampleMessage,
    });

    const sendMessage = () => {
      // Send Message
      emit("messageSent", state.message);
    };

    const closeModal = () => {
      emit("closeModal");
    };
    return {
      close,
      sendMessage,
      sendOutline,
      closeModal,
      ...toRefs(state),
    };
  },
  components: {
    IonToolbar,
    IonTitle,
    IonNote,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonCard,
    IonLabel,
    ImageWithCaption,
  },
};
</script>

<style scoped>
#message-modal {
  height: calc(100% - 50px);
}
.message-textarea {
  width: 100%;
  margin-top: 10px;
}
form {
  height: fit-content;
}
</style>
