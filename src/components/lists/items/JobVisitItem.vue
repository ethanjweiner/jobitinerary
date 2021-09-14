<template>
  <div>
    <ion-item>
      <div @click="$emit('openVisit')" style="width: 100%;">
        <ion-label style="margin: 0 !important;">{{
          state.visit.date
        }}</ion-label>
        <ion-note v-if="state.visit.employeeName"
          >by {{ state.visit.employeeName }}</ion-note
        >
      </div>

      <ion-note slot="end"> {{ state.visit.time.hours }} Hours </ion-note>
      <ion-buttons slot="end">
        <ion-button @click="$emit('deleteVisit')">
          <ion-icon :icon="trashOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-item>
  </div>
</template>

<script lang="ts">
import router from "@/router";
import { trashOutline } from "ionicons/icons";
import {
  IonItem,
  IonButtons,
  IonLabel,
  IonButton,
  IonIcon,
  IonNote,
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

export default {
  components: {
    IonItem,
    IonButtons,
    IonLabel,
    IonButton,
    IonIcon,
    IonNote,
  },
  name: "Visit",
  emits: ["deleteVisit", "updateVisit", "openVisit"],
  props: {
    visit: Object,
  },
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      visit: props.visit,
    });

    watch(state.visit, (newVisit) => {
      emit("updateVisit", newVisit);
    });
    return {
      state,
      router,
      trashOutline,
    };
  },
};
</script>

<style scoped>
ion-item {
  cursor: pointer;
}
ion-buttons {
  margin: 8px;
}
</style>
