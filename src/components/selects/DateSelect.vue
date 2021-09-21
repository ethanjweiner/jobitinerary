<template>
  <ion-item>
    <ion-label position="stacked"></ion-label>
    <ion-datetime display-format="MM/DD/YYYY" v-model="date"></ion-datetime>
  </ion-item>
</template>

<script lang="ts">
import { ref } from "@vue/reactivity";
import { IonItem, IonLabel, IonDatetime } from "@ionic/vue";
import { watch } from "@vue/runtime-core";
export default {
  name: "Date Select",
  components: {
    IonItem,
    IonLabel,
    IonDatetime,
  },
  props: {
    modelValue: String,
  },
  emits: ["update:modelValue"],
  setup(props: any, { emit }: { emit: any }) {
    const date = ref(props.modelValue);

    watch(date, (newDate) => {
      emit("update:modelValue", newDate.substring(0, 10));
    });

    return {
      date,
    };
  },
};
</script>

<style></style>
