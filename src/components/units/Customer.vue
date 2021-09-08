<template>
  <Sections :sections="sections">
    <template v-slot:dates>
      <div class="list">
        <CustomerDays />
      </div>
    </template>
    <template v-slot:jobs>
      <div class="list">
        <Jobs :showCustomer="false" />
      </div>
    </template>
    <template v-slot:customer-info>
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
                    :value="state.companyState.selectedCustomer.email"
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
                    :value="state.companyState.selectedCustomer.phone"
                  ></ion-input>
                </ion-item>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-list>
        <Address :value="state.companyState.selectedCustomer.location" />
        <ion-list>
          <ion-list-header>Notes</ion-list-header>
          <ion-grid>
            <ion-row class="ion-justify-content-around">
              <ion-col size="12" size-md="6">
                <ion-item>
                  <ion-label position="stacked">Customer Notes</ion-label>
                  <ion-textarea
                    auto-grow
                    placeholder="Notes on customer"
                    :value="state.companyState.selectedCustomer.customerNotes"
                  ></ion-textarea>
                </ion-item>
              </ion-col>
              <ion-col size="12" size-md="6">
                <ion-item>
                  <ion-label position="stacked">Property Notes</ion-label>
                  <ion-textarea
                    auto-grow
                    placeholder="Notes on property"
                    :value="state.companyState.selectedCustomer.propertyNotes"
                  ></ion-textarea>
                </ion-item>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-list>
        <ion-list>
          <ion-list-header>
            Property Images
          </ion-list-header>
          <ion-grid>
            <ion-row class="ion-justify-content-left">
              <ion-col
                v-for="image in state.companyState.selectedCustomer
                  .propertyImages"
                :key="image.ref"
                size-xs="12"
                size-sm="6"
                size-md="4"
                size-lg="3"
                size-xl="3"
              >
                <ImageWithCaption :imageRef="image" />
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
  IonTextarea,
  IonIcon,
} from "@ionic/vue";

import Jobs from "@/components/lists/Jobs.vue";
import CustomerDays from "@/components/lists/CustomerDays.vue";

import {
  mailOutline,
  callOutline,
  calendarOutline,
  calendarNumberOutline,
  personOutline,
} from "ionicons/icons";

import ImageWithCaption from "../ImageWithCaption.vue";
import Address from "../Address.vue";
import Sections from "../Sections.vue";
import { ref } from "@vue/reactivity";
import { SectionType } from "@/types";
import store from "@/store";

export default {
  name: "Customer",
  components: {
    IonList,
    IonListHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonTextarea,
    ImageWithCaption,
    Address,
    IonIcon,
    Jobs,
    Sections,
    CustomerDays,
  },
  setup() {
    const sections = ref<Array<SectionType>>([
      {
        name: "Dates",
        icon: calendarNumberOutline,
        id: "dates",
      },
      {
        name: "Jobs",
        icon: calendarOutline,
        id: "jobs",
      },
      {
        name: "Customer",
        icon: personOutline,
        id: "customer-info",
      },
    ]);
    return {
      mailOutline,
      callOutline,
      sections,
      state: store.state,
    };
  },
};
</script>

<style scoped>
.address-input-item {
  max-width: 600px;
}
#suggestions-card {
  width: calc(100% - 120px);
  margin-top: 0;
}
</style>
