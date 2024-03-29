<template>
  <ion-list>
    <date-picker
      title="Date of Visit"
      v-model="state.visit.data.date"
    ></date-picker>
    <ion-item>
      <ion-label style="font-weight: bold;">
        <ion-icon :icon="icons.timeOutline"></ion-icon>
        {{ state.visit.data.time.hours }} Hours
        <span v-if="state.visit.data.time.start && state.visit.data.time.end">
          ({{ formatTime(state.visit.data.time.start) }}-{{
            formatTime(state.visit.data.time.end)
          }})
        </span>
      </ion-label>
    </ion-item>

    <!-- Limit to employee view -->
    <TimeLogComponent
      title="Visit Time Log"
      v-model="state.visit.data.time"
      @update:modelValue="$emit('update:modelValue', state.visit)"
    />

    <!-- Employee Select -->

    <UserSelect
      v-if="!hideEmployeeSelect && store.state.userType == 'company'"
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

    <!-- Optional customer input -->
    <ion-item v-if="!state.visit.data.job && !hideCustomerSelect">
      <ion-label position="stacked"
        >Unsaved Customer (<i>For infrequent customers</i>)
      </ion-label>
      <ion-input
        v-model="state.visit.data.unregisteredCustomer"
        placeholder="Name"
      ></ion-input>
    </ion-item>
    <time-picker
      title="Planned Start"
      v-model="state.visit.data.plannedStart"
    ></time-picker>
    <time-picker
      title="Planned End"
      v-model="state.visit.data.plannedEnd"
    ></time-picker>
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
          <ion-chip v-else @click="jobsModalIsOpen = true">
            <ion-icon :icon="icons.calendarOutline"></ion-icon>
            <ion-label style="margin-top: 6px;">Attach New</ion-label>
          </ion-chip>
        </ion-buttons>
      </ion-toolbar>
    </ion-item>

    <ion-item>
      <ion-label position="stacked">
        <ion-icon :icon="icons.optionsOutline"></ion-icon>
        Type of Work
      </ion-label>
      <ion-input
        type="text"
        v-model="state.visit.data.workType"
        placeholder="Describe the type of work being done at this visit"
        @ionInput="$emit('update:modelValue', state.visit)"
        :debounce="config.constants.DEBOUNCE_AMOUNT"
      />
    </ion-item>

    <!-- Additional Notes -->

    <ion-item v-if="state.showTextAreas">
      <ion-label position="stacked">
        <ion-icon :icon="icons.documentTextOutline"></ion-icon>
        Visit Notes</ion-label
      >
      <ion-textarea
        auto-grow
        v-model="state.visit.data.notes"
        placeholder="Notes for the visit"
        @ionInput="$emit('update:modelValue', state.visit)"
        :debounce="config.constants.DEBOUNCE_AMOUNT"
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
  IonButtons,
  IonChip,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonNote,
  IonTextarea,
  IonToolbar,
} from "@ionic/vue";
import {
  calendarNumberOutline,
  calendarOutline,
  documentTextOutline,
  optionsOutline,
  timeOutline,
  timerOutline,
  trashOutline,
} from "ionicons/icons";
import { computed, reactive, ref } from "vue";

import JobsModal from "@/components/modals/JobsModal.vue";
import UserSelect from "@/components/selects/UserSelect.vue";
import TimeLogComponent from "@/components/TimeLog.vue";
import config from "@/config/config";
import {
  formatDate,
  formatTime,
  retrieveCustomerAddress,
  showTextAreas,
} from "@/helpers";
import { companiesCollection, db } from "@/main";
import store from "@/store";
import { JobInterface, Visit } from "@/types/units";

import Address from "../Address.vue";
import DatePicker from "../inputs/DatePicker.vue";
import TimePicker from "../inputs/TimePicker.vue";

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
    DatePicker,
    TimePicker,
  },
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive<State>({
      visit: props.modelValue,
      jobData: null,
      showTextAreas: false,
    });

    if (store.state.user) {
      console.log(store.state.user.employees);
    }

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

    showTextAreas(state);

    const changeDate = (ev: CustomEvent) => {
      state.visit.data.date = formatDate(ev.detail.value);
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

      // Try to retrieve the address of the customer
      const customerAddress = await retrieveCustomerAddress(customerID);
      if (customerAddress) state.visit.data.location = customerAddress;
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
        timeOutline,
        timerOutline,
        optionsOutline,
        documentTextOutline,
      },
      changeDate,
      jobsModalIsOpen,
      attachJob,
      formatTime,
      config,
    };
  },
};
</script>

<style></style>
