<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary" v-if="state.userID">
        <UserSelect
          slot="start"
          ref="userSelect"
          v-model="state.userID"
          :type="type"
          :key="state.userID"
          @update:modelValue="changeUser"
        />
        <ion-buttons slot="end">
          <ion-button @click="toggleUserSettings(true, $event)">
            <ion-icon :icon="icons.ellipsisVertical"></ion-icon>
          </ion-button>
        </ion-buttons>
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
    <ion-content :fullscreen="true" v-if="!state.userID" style="height: 100%;">
      <ion-grid>
        <ion-row class="ion-justify-content-center ion-align-items-center">
          <ion-card>
            <ion-card-header>
              <ion-card-title> Select {{ capitalize(type) }} </ion-card-title>
            </ion-card-header>

            <UserSelect
              ref="userSelect"
              v-model="state.userID"
              :type="type"
              :key="state.userID"
              @update:modelValue="changeUser"
              mode="light"
            />
          </ion-card>
        </ion-row>
      </ion-grid>
    </ion-content>

    <div v-else>
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
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonGrid,
  IonRow,
  IonIcon,
  IonButtons,
  IonButton,
  IonPopover,
  IonCard,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/vue";

import { reactive, ref } from "@vue/reactivity";
import router from "@/router";

import { ellipsisVertical } from "ionicons/icons";

import { capitalize } from "@/helpers";

import UserSelect from "@/components/selects/UserSelect.vue";
import store from "@/store";
import DeletePopover from "@/components/popovers/DeletePopover.vue";
import Customer from "@/components/units/Customer.vue";
import Employee from "@/components/units/Employee.vue";
import { Company } from "@/types/users";
import { idToName } from "@/helpers";
import { useRoute } from "vue-router";

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

    const route = useRoute();

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
      route,
    };
  },
  components: {
    IonHeader,
    IonToolbar,
    IonContent,
    IonPage,
    UserSelect,
    IonGrid,
    IonRow,
    IonCard,
    IonCardHeader,
    IonCardTitle,
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

ion-header {
  display: block;
}

#select-user-toolbar {
  max-width: 300px;
  margin-top: 10px;
}
</style>
