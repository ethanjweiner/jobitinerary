<template>
  <ion-list>
    <ion-item>
      <ion-icon :icon="icons.calendarNumberOutline"></ion-icon>
      <ion-label style="margin-left: 7px;">Date of Visit </ion-label>
      <ion-datetime
        display-format="MM/DD/YYYY"
        v-model="state.visit.data.date"
        @ionChange="changeDate($event)"
      ></ion-datetime>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">Planned Start</ion-label>
      <ion-datetime
        v-model="state.visit.data.plannedStart"
        display-format="h:mm A"
        picker-format="h:mm A"
        @ionChange="$emit('update:modelValue', state.visit)"
      ></ion-datetime>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">Planned End</ion-label>
      <ion-datetime
        v-model="state.visit.data.plannedEnd"
        display-format="h:mm A"
        picker-format="h:mm A"
        @ionChange="$emit('update:modelValue', state.visit)"
      ></ion-datetime>
    </ion-item>

    <!-- Employee Select -->

    <UserSelect
      v-if="!hideEmployeeSelect"
      :key="state.visit.data.employeeID"
      v-model="state.visit.data.employeeID"
      type="employee"
      mode="light"
      @update:modelValue="$emit('update:modelValue', state.visit)"
    />
    <!-- Customer Select -->
    <UserSelect
      :key="state.visit.data.customerID"
      v-if="!state.visit.data.job && !hideCustomerSelect"
      v-model="state.visit.data.customerID"
      type="customer"
      @update:modelValue="updateCustomer"
      mode="light"
    />
    <!-- Auto updates on location -->
    <Address v-model="state.visit.data.location" />
    <!-- Job Attacher -->
    <ion-item color="white" v-if="!hideJob">
      <ion-toolbar color="white">
        <ion-note>Attach a Job</ion-note>
        <ion-label color="tertiary" v-if="state.jobData"
          >"{{ state.jobData.name }}"</ion-label
        >
        <ion-buttons slot="end">
          <ion-chip v-if="state.jobData" @click="clearJob">
            <ion-icon :icon="icons.trashOutline"></ion-icon>
            <ion-label>Clear Job</ion-label>
          </ion-chip>
          <ion-chip @click="jobsModalIsOpen = true">
            <ion-icon :icon="icons.calendarOutline"></ion-icon>
            <ion-label style="margin-top: 6px;">Attach New</ion-label>
          </ion-chip>
        </ion-buttons>
      </ion-toolbar>
    </ion-item>

    <ion-item>
      <ion-label position="stacked">Type of Work</ion-label>
      <ion-input
        type="text"
        v-model="state.visit.data.workType"
        placeholder="Describe the type of work being done at this visit"
        @ionInput="$emit('update:modelValue', state.visit)"
        :debounce="store.DEBOUNCE_AMOUNT"
      />
    </ion-item>

    <TimeLogComponent
      v-if="store.state.userType == 'employee'"
      title="Visit Time Log"
      v-model="state.visit.data.time"
      @update:modelValue="$emit('update:modelValue', state.visit)"
    />
    <!-- Additional Notes -->

    <ion-item v-if="state.showTextAreas">
      <ion-label position="stacked">Visit Notes</ion-label>
      <ion-textarea
        auto-grow
        v-model="state.visit.data.notes"
        placeholder="Notes for the visit"
        @ionInput="$emit('update:modelValue', state.visit)"
        :debounce="store.DEBOUNCE_AMOUNT"
      ></ion-textarea>
    </ion-item>

    <ion-modal
      :is-open="jobsModalIsOpen"
      @didDismiss="jobsModalIsOpen = false"
      css-class="medium-modal"
    >
      <JobsModal
        @jobSelected="attachJob"
        @close="jobsModalIsOpen = false"
        :dbRef="jobsRef"
      />
    </ion-modal>
  </ion-list>
</template>

<script lang="ts">
import {
  IonLabel,
  IonDatetime,
  IonItem,
  IonChip,
  IonTextarea,
  IonToolbar,
  IonNote,
  IonIcon,
  IonButtons,
  IonModal,
  IonInput,
  IonList,
} from "@ionic/vue";

import { computed, reactive, ref } from "vue";
import store from "@/store";

import {
  calendarNumberOutline,
  calendarOutline,
  trashOutline,
} from "ionicons/icons";

import { JobInterface, Visit } from "@/types/units";

import JobsModal from "@/components/modals/JobsModal.vue";
import UserSelect from "@/components/selects/UserSelect.vue";
import TimeLogComponent from "@/components/TimeLog.vue";
import { companiesCollection, db } from "@/main";
import Address from "../Address.vue";

interface State {
  visit: Visit;
  jobData: JobInterface | null;
  showTextAreas: boolean;
}

export default {
  name: "Visit Main",
  props: {
    modelValue: Object,
    hideEmployeeSelect: Boolean,
    hideCustomerSelect: Boolean,
    hideJob: Boolean,
  },
  emits: ["update:modelValue"],
  components: {
    IonLabel,
    IonDatetime,
    IonItem,
    IonChip,
    IonTextarea,
    IonToolbar,
    IonNote,
    IonIcon,
    UserSelect,
    TimeLogComponent,
    IonButtons,
    JobsModal,
    IonModal,
    IonInput,
    IonList,
    Address,
  },
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive<State>({
      visit: props.modelValue,
      jobData: null,
      showTextAreas: false,
    });

    const jobsRef = computed(() => {
      if (state.visit.data.customerID) {
        return companiesCollection
          .doc(
            `${store.state.companyID}/customers/${state.visit.data.customerID}`
          )
          .collection("jobs");
      }
      return db
        .collectionGroup("jobs")
        .where("data.companyID", "==", store.state.companyID);
    });

    setTimeout(() => (state.showTextAreas = true), 250);

    const changeDate = (ev: CustomEvent) => {
      state.visit.data.date = ev.detail.value.substring(0, 10);
      emit("update:modelValue", state.visit);
    };

    const jobsModalIsOpen = ref(false);

    const attachJob = (jobData: JobInterface) => {
      jobsModalIsOpen.value = false;
      state.jobData = jobData;
      state.visit.data.jobID = jobData.id;
      state.visit.data.customerID = jobData.customerID;
      emit("update:modelValue", state.visit);
    };

    const clearJob = () => {
      state.visit.data.jobID = "";
      state.jobData = null;
    };

    const updateCustomer = async (customerID: string) => {
      clearJob();
      const customerDocData = (
        await companiesCollection
          .doc(`${state.visit.data.companyID}/customers/${customerID}`)
          .get()
      ).data();
      if (customerDocData)
        state.visit.data.location = customerDocData.data.location;
      emit("update:modelValue", state.visit);
    };

    const initialize = async () => {
      if (state.visit.data.jobID) {
        const docs = (
          await db
            .collectionGroup("jobs")
            .where("data.id", "==", state.visit.data.jobID)
            .get()
        ).docs;
        if (docs) {
          state.jobData = docs[0].data().data as JobInterface;
        }
      }
    };

    initialize();

    return {
      state,
      store,
      jobsRef,
      updateCustomer,
      clearJob,
      icons: {
        calendarNumberOutline,
        calendarOutline,
        trashOutline,
      },
      changeDate,
      jobsModalIsOpen,
      attachJob,
    };
  },
};
</script>

<style></style>
