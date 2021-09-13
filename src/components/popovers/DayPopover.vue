<template>
  <ion-list>
    <ion-item button @click="$emit('deleteDay')">
      <ion-text color="danger">
        <ion-icon :icon="trash" color="danger"></ion-icon>
        Delete Day
        <ion-note>Delete the day, and any visits on this date.</ion-note>
      </ion-text>
    </ion-item>
    <ion-item button @click="$emit('changeDate')">
      <ion-text color="secondary">
        <ion-icon :icon="calendarNumberOutline" color="secondary"></ion-icon>
        Change Date
        <ion-note
          >Change the date of this day and all the visits on this
          date.</ion-note
        >
      </ion-text>
    </ion-item>
    <ion-item button @click="$emit('copyDay')">
      <ion-text color="tertiary">
        <ion-icon :icon="copyOutline" color="tertiary"></ion-icon>
        Copy Day
        <ion-note>Copy this day to another employee.</ion-note>
      </ion-text>
    </ion-item>
  </ion-list>
</template>

<script>
import { trash, calendarNumberOutline, copyOutline } from "ionicons/icons";
import { IonList, IonItem, IonText, IonIcon, IonNote } from "@ionic/vue";
export default {
  name: "Visit Popover",
  components: { IonList, IonItem, IonText, IonIcon, IonNote },
  emits: ["deleteDay", "changeDate", "copyDay"],
  setup() {
    return { trash, calendarNumberOutline, copyOutline };
  },
};
</script>

<style>
ion-list {
  padding: 0 !important;
}
</style>
