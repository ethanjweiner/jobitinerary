<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary" v-if="state.userID">
        <UserSelect
          :header="true"
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
    <ion-content v-if="!state.userID" style="height: 100%;">
      <ion-grid>
        <ion-row class="ion-justify-content-center ion-align-items-center">
          <ion-card class="select-user-card">
            <ion-card-header>
              <ion-card-title> Select {{ capitalize(type) }} </ion-card-title>
            </ion-card-header>
            <ion-card-content style="padding: 5px;">
              <UserSelect
                ref="userSelect"
                v-model="state.userID"
                :type="type"
                :key="state.userID"
                @update:modelValue="changeUser"
                mode="light"
                :displayAsList="true"
              />
            </ion-card-content>
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
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonPopover,
  IonRow,
  IonToolbar,
} from "@ionic/vue";
import { reactive, ref } from "@vue/reactivity";
import { ellipsisVertical } from "ionicons/icons";
import { useRoute } from "vue-router";

import DeletePopover from "@/components/popovers/DeletePopover.vue";
import UserSelect from "@/components/selects/UserSelect.vue";
import Customer from "@/components/units/Customer.vue";
import Employee from "@/components/units/Employee.vue";
import { capitalize } from "@/helpers";
import { idToName } from "@/helpers";
import router from "@/router";
import store from "@/store";
import { Company } from "@/types/users";

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
    IonCardContent,
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

@media (min-width: 768px) {
  .select-user-card {
    width: 500px;
  }
}
</style>
