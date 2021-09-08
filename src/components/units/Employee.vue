<template>
  <Sections :sections="sections">
    <template v-slot:messages>
      <div class="list">
        <!-- change to messages -->
        <Messages />
      </div>
    </template>
    <template v-slot:dates>
      <div class="list">
        <!-- change to employee days -->
        <EmployeeDays />
      </div>
    </template>
    <template v-slot:pay>
      <div>
        <PaymentInfo />
      </div>
    </template>
    <template v-slot:employee-info>
      <form class="ion-padding">
        <ion-list>
          <ion-list-header>Contact Info</ion-list-header>
          <ion-grid>
            <ion-row class="ion-justify-content-around">
              <ion-col size="12" size-sm="6">
                <ion-item>
                  <ion-label position="stacked">
                    <ion-icon :icon="mailOutline"></ion-icon>
                    <span style="padding: 5px;">Email</span>
                  </ion-label>
                  <ion-input
                    type="email"
                    placeholder="email"
                    :value="state.companyState.selectedEmployee.email"
                  ></ion-input>
                </ion-item>
              </ion-col>
              <ion-col size="12" size-sm="6">
                <ion-item>
                  <ion-label position="stacked">
                    <ion-icon :icon="callOutline"></ion-icon>
                    <span style="padding: 5px;">Phone</span>
                  </ion-label>
                  <ion-input
                    type="tel"
                    inputmode="tel"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    placeholder="123-123-1234"
                    :value="state.companyState.selectedEmployee.phone"
                  ></ion-input>
                </ion-item>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-list>
      </form>
    </template>
  </Sections>
</template>

<script lang="ts">
import {
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
} from "@ionic/vue";

import Messages from "@/components/lists/Messages.vue";

import EmployeeDays from "@/components/lists/EmployeeDays.vue";
import {
  mailOutline,
  callOutline,
  mailOpenOutline,
  calendarNumberOutline,
  personOutline,
  cashOutline,
} from "ionicons/icons";
import Sections from "../Sections.vue";
import store from "@/store";
import { SectionType } from "@/types";
import { ref } from "@vue/reactivity";
import PaymentInfo from "@/components/PaymentInfo.vue";

export default {
  name: "Employee",
  components: {
    IonList,
    IonListHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    Sections,
    Messages,
    EmployeeDays,
    PaymentInfo,
  },
  setup() {
    const sections = ref<Array<SectionType>>([
      {
        name: "Messages",
        icon: mailOpenOutline,
        id: "messages",
      },
      {
        name: "Dates",
        icon: calendarNumberOutline,
        id: "dates",
      },
      {
        name: "Pay",
        icon: cashOutline,
        id: "pay",
      },
      {
        name: "Employee",
        icon: personOutline,
        id: "employee-info",
      },
    ]);
    return {
      state: store.state,
      sections,
      mailOutline,
      callOutline,
    };
  },
};
</script>

<style scoped></style>
