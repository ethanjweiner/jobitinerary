<template>
  <ion-item>
    <div
      @click="
        router.push({
          name: 'Employee Day',
          params: { username: state.day.employeeName, date: state.day.date },
        })
      "
    >
      <ion-label>
        <ion-text>
          {{ day.date }}
        </ion-text>
      </ion-label>
      <ion-note v-if="state.day.time.hours">
        {{ state.day.time.hours }} hours @ ${{ hourlyRate }}/hr
      </ion-note>
    </div>
    <ion-buttons slot="end" v-if="showPaymentToggle">
      <ion-note style="margin: auto;" v-if="state.day.paid"
        ><ion-icon :icon="checkmark"></ion-icon> Paid</ion-note
      >
      <ion-note style="margin: auto;" v-if="!state.day.paid">Unpaid</ion-note>
      <ion-toggle
        v-model="state.day.paid"
        value="paid"
        @ionChange="$emit('togglePaid')"
      ></ion-toggle>
    </ion-buttons>
  </ion-item>
</template>

<script lang="ts">
import {
  IonItem,
  IonLabel,
  IonText,
  IonNote,
  IonButtons,
  IonIcon,
  IonToggle,
} from "@ionic/vue";
import { checkmark } from "ionicons/icons";
import { computed, reactive } from "@vue/reactivity";
import store from "@/store";
import router from "@/router";

export default {
  name: "Employee Day Item",
  props: {
    day: Object,
    showPaymentToggle: Boolean,
  },
  components: {
    IonItem,
    IonLabel,
    IonText,
    IonNote,
    IonButtons,
    IonIcon,
    IonToggle,
  },
  emits: ["togglePaid"],
  setup(props: any) {
    const state = reactive({
      day: props.day,
    });

    const hourlyRate = computed(() => {
      if (state.day.hourlyRate) return state.day.hourlyRate;
      const employee = store.state.companyState.employees.find(
        (employee) => state.day.employeeName == employee.name
      );
      if (employee) return employee.defaultHourlyRate;
      return null;
    });

    return {
      checkmark,
      state,
      hourlyRate,
      router,
    };
  },
};
</script>

<style scoped>
ion-item {
  cursor: pointer;
}
div {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
