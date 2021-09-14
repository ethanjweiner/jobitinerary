<template>
  <ion-item>
    <ion-label position="stacked"></ion-label>
    <ion-datetime display-format="MM/DD/YYYY" v-model="date"></ion-datetime>
  </ion-item>
</template>

<script lang="ts">
import { ref } from "@vue/reactivity";
import { IonItem, IonLabel, IonDatetime } from "@ionic/vue";
import { dateToString } from "@/helpers";
import { watch } from "@vue/runtime-core";
export default {
  name: "Date Select",
  components: {
    IonItem,
    IonLabel,
    IonDatetime,
  },
  emits: ["dateChange"],
  setup(props: any, { emit }: { emit: any }) {
    const date = ref(dateToString(new Date()));

    watch(date, (newDate) => {
      console.log(newDate);
      emit("dateChange", newDate);
    });

    return {
      date,
    };
  },
};
</script>

<style></style>
