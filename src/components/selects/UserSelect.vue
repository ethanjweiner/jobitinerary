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
        <ion-select-option v-for="name in names" :key="name" :value="name">{{
          name
        }}</ion-select-option>
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
import { defineComponent, ref } from "vue";

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

import store from "@/store";

import NewUserModal from "@/components/modals/NewUserModal.vue";

import { capitalize } from "@/helpers";

export default defineComponent({
  name: "User Select",
  props: {
    modelValue: String,
    names: Array,
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
    const newUserModalIsOpen = ref(false);

    const addUser = async (dets: { name: string; email: string }) => {
      const { name, email } = dets;
      if (props.type == "customer") await store.addCustomer(name, email);
      else if (props.type == "employee") await store.addEmployee(name, email);
      else throw Error("No user type was provided");

      emit("update:modelValue", name);
    };

    return {
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
