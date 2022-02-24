<template>
  <ion-item button id="open-date-input">
    <ion-icon :icon="icons.calendar" />
    <ion-text class="ion-padding">{{ date }}</ion-text>
    <!-- <ion-input :value="date" trigger="open-date-input" /> -->
    <!-- <ion-button fill="clear" id="open-date-input" expand="full" size="lg">
      <ion-icon :icon="icons.calendar" />
      {{ date }}
    </ion-button> -->
    <ion-popover trigger="open-date-input" :show-backdrop="true" size="cover">
      <ion-datetime
        :presentation="type"
        v-model="date"
        @ionChange="(ev) => (date = formatDate(ev.detail.value))"
      />
    </ion-popover>
  </ion-item>
</template>

<script lang="ts">
import { IonDatetime, IonIcon, IonItem, IonPopover, IonText } from "@ionic/vue";
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { calendar } from "ionicons/icons";

import { formatDate } from "@/helpers";
export default {
  name: "Date Select",
  components: {
    IonDatetime,
    IonItem,
    IonPopover,
    IonIcon,
    IonText,
  },
  props: {
    modelValue: String,
    type: String,
  },
  emits: ["update:modelValue"],
  setup(props: any, { emit }: { emit: any }) {
    const date = ref(props.modelValue);

    watch(date, (newDate) => {
      console.log(newDate);
      emit("update:modelValue", newDate);
    });

    return {
      date,
      formatDate,
      icons: { calendar },
    };
  },
};
</script>

<style></style>
