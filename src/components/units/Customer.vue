<template>
  <Sections :sections="sections" :wrapCards="true">
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
      <CustomerForm />
    </template>
    <template v-slot:sectionsAsGrid>
      <ion-row>
        <ion-col size="6">
          <ion-card>
            <div class="list">
              <CustomerDays />
            </div>
          </ion-card>
        </ion-col>
        <ion-col size="6">
          <ion-card>
            <div class="list">
              <Jobs :showCustomer="false" />
            </div>
          </ion-card>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col size="12">
          <ion-card class="ion-padding">
            <ion-card-header>
              <ion-card-title>
                Customer Info
              </ion-card-title>
            </ion-card-header>
            <CustomerForm />
          </ion-card>
        </ion-col>
      </ion-row>
    </template>
  </Sections>
</template>

<script lang="ts">
import Jobs from "@/components/lists/Jobs.vue";
import CustomerDays from "@/components/lists/CustomerDays.vue";

import {
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/vue";

import {
  calendarOutline,
  calendarNumberOutline,
  personOutline,
} from "ionicons/icons";

import Sections from "../Sections.vue";
import { ref } from "@vue/reactivity";
import { SectionType } from "@/types";
import CustomerForm from "../forms/CustomerForm.vue";

export default {
  name: "Customer",
  components: {
    Jobs,
    Sections,
    CustomerDays,
    CustomerForm,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
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
      sections,
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
