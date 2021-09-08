<template>
  <ion-item :color="message.read ? '' : 'light'">
    <div style="width: 20px;">
      <span class="dot" v-if="!message.readByRecipient"></span>
    </div>
    <div>
      <ion-label :class="[{ bold: !message.readByRecipient }]">
        {{ message.from.name ? message.from.name : "Message" }}
      </ion-label>
      <ion-note>
        {{ messagePreview }}
      </ion-note>
    </div>
  </ion-item>
</template>

<script lang="ts">
import { IonItem, IonLabel, IonNote, isPlatform } from "@ionic/vue";
import { computed } from "@vue/reactivity";

export default {
  name: "Visit Item",
  props: ["message"],
  components: {
    IonItem,
    IonLabel,
    IonNote,
  },
  setup(props: any) {
    let maxMessageLength = 120;
    if (isPlatform("iphone") || isPlatform("mobile") || isPlatform("mobileweb"))
      maxMessageLength = 30;
    else maxMessageLength = 120;
    const messagePreview = computed(() => {
      if (props.message.text.length < maxMessageLength)
        return props.message.text;
      return props.message.text.slice(0, maxMessageLength) + "...";
    });
    return {
      messagePreview,
    };
  },
};
</script>

<style scoped>
.bold {
  font-weight: bold;
}
</style>
