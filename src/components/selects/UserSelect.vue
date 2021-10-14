<template>
  <ion-toolbar>
    <ion-item>
      <ion-icon v-if="type == 'customer'" :icon="icons.cartOutline"></ion-icon>
      <ion-icon
        v-if="type == 'employee'"
        :icon="icons.hammerOutline"
      ></ion-icon>
      <ion-select
        @ionChange="$emit('update:modelValue', $event.detail.value)"
        :value="modelValue"
        :placeholder="'Select ' + capitalize(type)"
        :key="modelValue"
      >
        <ion-select-option
          v-for="name in state.names"
          :key="name"
          :value="name"
          >{{ name }}</ion-select-option
        >
      </ion-select>
      <ion-buttons slot="end">
        <ion-fab-button size="small" @click="newUserModalIsOpen = true">
          <ion-icon :icon="icons.add"></ion-icon>
        </ion-fab-button>
      </ion-buttons>
    </ion-item>
    <ion-modal
      :is-open="newUserModalIsOpen"
      @didDismiss="newUserModalIsOpen = false"
      css-class="new-user-modal"
    >
      <NewUserModal
        :type="type"
        @userAdded="addUser"
        @didDismiss="newUserModalIsOpen = false"
      />
    </ion-modal>
  </ion-toolbar>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";

import {
  IonToolbar,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonFabButton,
  IonButtons,
  IonModal,
} from "@ionic/vue";

import { cartOutline, hammerOutline, add } from "ionicons/icons";

import NewUserModal from "@/components/modals/NewUserModal.vue";

import { capitalize } from "@/helpers";
import store from "@/store";

interface State {
  names: Array<string>;
}

export default defineComponent({
  name: "User Select",
  props: {
    modelValue: String,
    type: String,
  },
  emits: ["update:modelValue", "userAdded"],
  components: {
    IonToolbar,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonIcon,
    IonFabButton,
    IonButtons,
    IonModal,
    NewUserModal,
  },
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive<State>({
      names: [],
    });

    const newUserModalIsOpen = ref(false);

    const refreshState = () => {
      if (props.type == "customer" && store.state.user) {
        state.names = store.state.user.customers.map(
          (customer) => customer.data.name
        );
      } else if (props.type == "employee" && store.state.user)
        state.names = store.state.user.employees.map(
          (employee) => employee.data.name
        );
      else throw Error("Could not load users.");
    };

    refreshState();

    const addUser = (name: string) => {
      emit("update:modelValue", name);
      refreshState();
    };

    return {
      state,
      icons: {
        add,
        cartOutline,
        hammerOutline,
      },
      addUser,
      capitalize,
      newUserModalIsOpen,
    };
  },
});
</script>

<style scoped>
ion-item {
  padding-bottom: 0;
  margin-bottom: 0;
}
ion-select {
  margin-inline-start: 10px;
}
</style>
