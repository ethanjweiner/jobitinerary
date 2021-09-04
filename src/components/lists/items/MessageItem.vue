<template>
  <ion-item :color="message.read ? '' : 'light'">
    <div style="width: 20px;">
      <span class="dot" v-if="!message.readByRecipient"></span>
    </div>
    message
  </ion-item>
</template>

<script lang="ts">
import { IonItem } from "@ionic/vue";

export default {
  name: "Visit Item",
  props: ["message"],
  components: {
    IonItem,
  },
};
</script>

<style scoped></style>
