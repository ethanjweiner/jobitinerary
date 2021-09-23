<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start" v-if="state.username">
          <ion-button @click="toggleUserSettings(true, $event)">
            <ion-icon :icon="icons.ellipsisVertical"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>{{
          state.username ? state.username : capitalize(type) + "s"
        }}</ion-title>

        <SettingsButton />
      </ion-toolbar>
    </ion-header>
    <ion-popover
      :is-open="popoverIsOpen"
      :translucent="true"
      :event="popoverEvent"
      @didDismiss="toggleUserSettings(false)"
    >
      <DeletePopover :unitName="capitalize(type)" @delete="deleteUser" />
    </ion-popover>
    <ion-content :fullscreen="true">
      <!-- On select, route to the users page w/ a prop -->
      <ion-toolbar id="select-user-toolbar" v-if="state.username">
        <UserSelect
          v-if="state.username"
          ref="userSelect"
          :names="state.users.map((user) => user.name)"
          v-model="state.username"
          :type="type"
          :key="state.username"
          @update:modelValue="changeUser"
        />
      </ion-toolbar>

      <ion-grid v-else style="width: 100%; height: 100%;">
        <ion-row
          class="ion-justify-content-center ion-align-items-center"
          style="height: 100%;"
        >
          <ion-col size-xs="11" size-sm="8" size-md="5" size-lg="4" size-xl="3">
            <div class="ion-text-start">
              <h3 class="text-secondary">Select {{ capitalize(type) }}</h3>
            </div>
            <UserSelect
              ref="userSelect"
              :names="state.users.map((user) => user.name)"
              v-model="state.username"
              :type="type"
              :key="state.username"
              @update:modelValue="changeUser"
            />
          </ion-col>
        </ion-row>
      </ion-grid>

      <div id="user-container" class="ion-text-center" v-if="state.username">
        <Customer
          v-if="type == 'customer'"
          :key="state.username"
          :username="state.username"
        />
        <Employee
          v-else-if="type == 'employee'"
          :key="state.username"
          :username="state.username"
        />
        <div v-else>No user type was defined.</div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButtons,
  IonButton,
  IonPopover,
} from "@ionic/vue";

import { reactive, ref } from "@vue/reactivity";
import router from "@/router";

import { ellipsisVertical } from "ionicons/icons";

import { capitalize } from "@/helpers";

import SettingsButton from "@/components/buttons/SettingsButton.vue";
import UserSelect from "@/components/selects/UserSelect.vue";
import store from "@/store";
import DeletePopover from "@/components/popovers/DeletePopover.vue";
import Customer from "@/components/units/Customer.vue";
import Employee from "@/components/units/Employee.vue";
import { Customer as CustomerType, Employee as EmployeeType } from "@/types";

interface State {
  username: string;
  users: Array<CustomerType> | Array<EmployeeType>;
}

export default {
  name: "Users",
  props: {
    username: String,
    type: String,
  },
  setup(props: any) {
    const state = reactive<State>({
      username: props.username,
      users: [],
    });

    if (props.type == "customer")
      state.users = store.state.companyState.customers;
    else if (props.type == "employee")
      state.users = store.state.companyState.employees;

    // Popover
    const popoverIsOpen = ref(false);
    const popoverEvent = ref();
    const toggleUserSettings = (state: boolean, ev?: Event) => {
      popoverEvent.value = ev;
      popoverIsOpen.value = state;
    };

    const changeUser = (name: string) => {
      router.push({
        name: capitalize(props.type),
        params: { username: name, type: props.type },
      });
      state.username = name;
    };

    const deleteUser = async () => {
      if (props.type == "customer") {
        await store.deleteCustomer(state.username);
      } else if (props.type == "employee") {
        await store.deleteEmployee(state.username);
      } else throw Error("No user type was provided");
      state.username = "";
      toggleUserSettings(false);
    };

    return {
      state,
      icons: { ellipsisVertical },
      toggleUserSettings,
      changeUser,
      deleteUser,
      capitalize,
      popoverIsOpen,
      popoverEvent,
    };
  },
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    SettingsButton,
    UserSelect,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonButtons,
    IonButton,
    DeletePopover,
    IonPopover,
    Employee,
    Customer,
  },
};
</script>

<style scoped>
ion-grid,
ion-row {
  height: 100%;
}
#select-user-toolbar {
  max-width: 300px;
  margin-top: 10px;
}
</style>
