<template>
  <div>
    <ion-list :class="displayAsList ? 'ion-hide-md-down' : 'ion-hide'">
      <ion-item
        button
        v-for="id in state.ids"
        :key="id"
        @click="$emit('update:modelValue', id)"
      >
        {{ idToName(id) }}
      </ion-item>
      <ion-button
        fill="outline"
        expand="block"
        color="primary"
        @click="newUserModalIsOpen = true"
      >
        <ion-icon :icon="icons.add"></ion-icon>
        Create {{ capitalize(type) }}
      </ion-button>
    </ion-list>
    <ion-item
      :class="displayAsList ? 'ion-hide-md-up' : ''"
      :color="mode == 'light' ? 'white' : 'primary'"
    >
      <ion-icon v-if="type == 'customer'" :icon="icons.cartOutline"></ion-icon>
      <ion-icon
        v-if="type == 'employee'"
        :icon="icons.hammerOutline"
      ></ion-icon>
      <ion-select
        v-if="state.ids.length"
        :class="header ? 'select-header' : ''"
        @ionChange="$emit('update:modelValue', $event.detail.value)"
        :value="modelValue"
        :placeholder="'Select ' + capitalize(type)"
        :key="modelValue"
        :style="mode == 'light' ? 'color: black !important;' : ''"
      >
        <ion-select-option v-for="id in state.ids" :key="id" :value="id">{{
          idToName(id)
        }}</ion-select-option>
      </ion-select>
      <ion-button
        v-else
        fill="outline"
        size="default"
        style="margin-left: 10px;"
        @click="newUserModalIsOpen = true"
      >
        Create {{ capitalize(type) }}
      </ion-button>
      <ion-buttons slot="end" v-if="state.ids.length">
        <ion-fab-button
          :color="mode == 'light' ? 'dark' : 'light'"
          size="small"
          @click="newUserModalIsOpen = true"
        >
          <ion-icon :icon="icons.add"></ion-icon>
        </ion-fab-button>
      </ion-buttons>
    </ion-item>
    <ion-modal
      :is-open="newUserModalIsOpen ? newUserModalIsOpen : false"
      @didDismiss="newUserModalIsOpen = false"
      class="small-modal"
    >
      <NewUserModal
        :type="type"
        @userAdded="addUser"
        @didDismiss="newUserModalIsOpen = false"
      />
    </ion-modal>
  </div>
</template>

<script lang="ts">
import {
  IonButton,
  IonButtons,
  IonFabButton,
  IonIcon,
  IonItem,
  IonList,
  IonModal,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
import { add, cartOutline, hammerOutline } from "ionicons/icons";
import { defineComponent, reactive, ref } from "vue";

import NewUserModal from "@/components/modals/NewUserModal.vue";
import { capitalize, idToName } from "@/helpers";
import store from "@/store";

interface State {
  ids: Array<string>;
}

export default defineComponent({
  id: "User Select",
  props: {
    modelValue: String,
    type: String,
    mode: String,
    displayAsList: Boolean,
    header: Boolean,
  },
  emits: ["update:modelValue", "userAdded"],
  components: {
    IonItem,
    IonSelect,
    IonSelectOption,
    IonIcon,
    IonFabButton,
    IonButton,
    IonButtons,
    IonModal,
    NewUserModal,
    IonList,
  },
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive<State>({
      ids: [],
    });

    const newUserModalIsOpen = ref(false);

    const refreshState = () => {
      if (props.type == "customer" && store.state.user) {
        state.ids = store.state.user.customers.map(
          (customer) => customer.data.id
        );
      } else if (props.type == "employee" && store.state.user)
        state.ids = store.state.user.employees.map(
          (employee) => employee.data.id
        );
      else throw Error("Could not load users.");
    };

    refreshState();

    const addUser = (id: string) => {
      newUserModalIsOpen.value = false;
      setTimeout(() => {
        emit("update:modelValue", id);
        refreshState();
      });
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
      idToName,
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
.select-header {
  font-size: 25px;
  font-weight: bold;
}
@media (max-width: 768px) {
  ion-select {
    max-width: 180px;
  }
  .select-header {
    font-size: 20px;
  }
}
</style>
