<template>
  <ion-grid class="ion-padding">
    <h3 class="ion-text-center" style="margin: 0;">
      <ion-text>{{ title }}</ion-text>
    </h3>
    <ion-row>
      <ion-col size="6">
        <ion-button color="primary" expand="block">
          <ion-icon :icon="playOutline"></ion-icon>
        </ion-button>
      </ion-col>
      <ion-col size="6">
        <ion-button color="danger" expand="block">
          <ion-icon :icon="stopOutline"></ion-icon>
        </ion-button>
      </ion-col>
    </ion-row>
    <ion-row v-if="mismatch">
      <ion-note style="padding-left: 10px; padding-bottom: 3px;">
        <ion-text color="danger">
          Note: The times and hours don't match up.
        </ion-text>
      </ion-note>
    </ion-row>
    <ion-row color="light">
      <ion-col size="6" size-lg="4">
        <ion-item>
          <ion-label position="stacked">Start Time</ion-label>
          <ion-datetime
            @ionChange="
              $emit('timeChange', {
                start: $event.detail.value,
                end: time.end,
                hours: time.hours,
              })
            "
            display-format="h:mm A"
            picker-format="h:mm A"
            :value="time.start"
          ></ion-datetime>
        </ion-item>
      </ion-col>
      <ion-col size="6" size-lg="4">
        <ion-item>
          <ion-label position="stacked">End Time</ion-label>
          <ion-datetime
            @ionChange="
              $emit('timeChange', {
                start: time.start,
                end: $event.detail.value,
                hours: time.hours,
              })
            "
            display-format="h:mm A"
            picker-format="h:mm A"
            :value="time.end"
          ></ion-datetime>
        </ion-item>
      </ion-col>
      <ion-col size="12" size-lg="4">
        <ion-item>
          <ion-label position="stacked">Total Hours</ion-label>
          <ion-input
            @ionInput="
              $emit('timeChange', {
                start: time.start,
                end: time.end,
                hours: parseInt($event.target.value),
              })
            "
            type="number"
            :value="time.hours"
          ></ion-input>
        </ion-item>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script>
import { playOutline, stopOutline } from "ionicons/icons";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonLabel,
  IonInput,
  IonItem,
  IonText,
  IonNote,
  IonDatetime,
} from "@ionic/vue";
import { computed } from "@vue/reactivity";
export default {
  name: "Timelog",
  props: ["time", "title"],
  setup() {
    const mismatch = computed(() => true);
    return {
      playOutline,
      stopOutline,
      mismatch,
    };
  },
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonLabel,
    IonInput,
    IonItem,
    IonText,
    IonNote,
    IonDatetime,
  },
};
</script>

<style scoped>
ion-label {
  margin-left: 0;
}
ion-grid {
  background: rgb(241, 241, 241);
}
ion-item {
  border-radius: 10px;
  height: 100%;
  background: white;
}
input {
  padding: 0 !important;
}
.item-native {
  padding: 0 !important;
}
</style>
