<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start" v-if="state.userID">
          <ion-button @click="toggleUserSettings(true, $event)">
            <ion-icon :icon="icons.ellipsisVertical"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>{{
          state.userID ? idToName(state.userID) : capitalize(type) + "s"
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
      <ion-toolbar id="select-user-toolbar" v-if="state.userID">
        <UserSelect
          v-if="state.userID"
          ref="userSelect"
          v-model="state.userID"
          :type="type"
          :key="state.userID"
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
              v-model="state.userID"
              :type="type"
              :key="state.userID"
              @update:modelValue="changeUser"
            />
          </ion-col>
        </ion-row>
      </ion-grid>

      <div id="user-container" class="ion-text-center" v-if="state.userID">
        <Customer
          v-if="type == 'customer'"
          :key="state.userID"
          :userID="state.userID"
        />
        <Employee
          v-else-if="type == 'employee'"
          :key="state.userID"
          :userID="state.userID"
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
import { Company } from "@/types/users";
import { idToName } from "@/helpers";

interface State {
  userID: string;
}

export default {
  name: "Users",
  props: {
    userID: String,
    type: String,
  },
  setup(props: any) {
    const state = reactive<State>({
      userID: props.userID,
    });

    // POPOVER
    const popoverIsOpen = ref(false);
    const popoverEvent = ref();
    const toggleUserSettings = (state: boolean, ev?: Event) => {
      popoverEvent.value = ev;
      popoverIsOpen.value = state;
    };

    const changeUser = (id: string) => {
      router.push({
        name: capitalize(props.type),
        params: { userID: id, type: props.type },
      });
      state.userID = id;
    };

    const deleteUser = async () => {
      if (store.state.user instanceof Company) {
        if (props.type == "customer") {
          await store.state.user.deleteCustomer(state.userID);
        } else if (props.type == "employee") {
          await store.state.user.deleteEmployee(state.userID);
        } else throw Error("No user type was provided");
        state.userID = "";
        toggleUserSettings(false);
      } else {
        throw Error("You must be a company to delete a user.");
      }
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
      idToName,
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
#user-container {
  height: fit-content;
}
#select-user-toolbar {
  max-width: 300px;
  margin-top: 10px;
}
</style>
