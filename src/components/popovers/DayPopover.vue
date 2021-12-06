<template>
  <ion-list>
    <ion-item button @click="$emit('deleteDay')">
      <ion-text color="danger">
        <ion-icon :icon="icons.trash" color="danger"></ion-icon>
        Delete
        <ion-note>Delete the day, and any visits on this date.</ion-note>
      </ion-text>
    </ion-item>
    <ion-item>
      <ion-label color="secondary">
        <ion-icon
          :icon="icons.calendarNumberOutline"
          color="secondary"
        ></ion-icon>
        Change Date
      </ion-label>
      <ion-datetime
        v-model="date"
        @ionChange="$emit('changeDate', $event.detail.value.substring(0, 10))"
        display-format="YYYY-MM-DD"
      ></ion-datetime>
    </ion-item>

    <ion-item
      v-if="type == 'employee' && store.state.user.employees.length > 1"
    >
      <ion-label color="tertiary">
        <ion-icon :icon="icons.copyOutline" color="tertiary"></ion-icon>
        Copy to Employee
      </ion-label>
      <ion-select @ionChange="$emit('copyDay', $event.detail.value)">
        <ion-select-option
          v-for="name in state.names"
          :key="name"
          :value="name"
          >{{ name }}</ion-select-option
        >
      </ion-select>
    </ion-item>

    <ion-item
      v-if="type == 'employee' && store.state.user.employees.length > 1"
    >
      <ion-text>
        <ion-note>Note: Copying does not copy expenses.</ion-note>
      </ion-text>
    </ion-item>
  </ion-list>
</template>

<script lang="ts">
import {
  IonDatetime,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonText,
} from "@ionic/vue";
import { reactive, ref } from "@vue/reactivity";
import { calendarNumberOutline, copyOutline, trash } from "ionicons/icons";

import store from "@/store";
import { Employee } from "@/types/users";
export default {
  name: "Visit Popover",
  props: {
    type: String,
    currentDate: String,
    employeeID: String,
  },
  components: {
    IonList,
    IonItem,
    IonText,
    IonIcon,
    IonNote,
    IonDatetime,
    IonLabel,
    IonSelect,
    IonSelectOption,
  },
  emits: ["deleteDay", "changeDate", "copyDay"],
  setup(props: any) {
    const state = reactive<{ names: Array<string> }>({
      names: [],
    });

    if (store.state.user)
      if (props.type == "employee")
        state.names = store.state.user.employees
          .filter((employee: Employee) => employee.data.id != props.employeeID)
          .map((employee) => employee.data.name);

    const date = ref(props.currentDate);
    return {
      store,
      state,
      icons: { trash, calendarNumberOutline, copyOutline },
      date,
    };
  },
};
</script>

<style>
ion-list {
  padding: 0 !important;
}
</style>
