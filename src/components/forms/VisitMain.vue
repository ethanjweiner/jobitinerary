<template>
  <div>
    <ion-item>
      <ion-icon :icon="icons.calendarNumberOutline"></ion-icon>
      <ion-label style="margin-left: 7px;">Date of Visit </ion-label>
      <ion-datetime
        display-format="MM/DD/YYYY"
        v-model="state.visit.date"
        @ionChange="changeDate($event)"
      ></ion-datetime>
    </ion-item>
    <ion-grid>
      <ion-row>
        <ion-col size="6">
          <ion-item>
            <ion-label position="stacked">Planned Start</ion-label>
            <ion-datetime
              v-model="state.visit.plannedStart"
              display-format="h:mm A"
              picker-format="h:mm A"
            ></ion-datetime>
          </ion-item>
        </ion-col>
        <ion-col size="6">
          <ion-item>
            <ion-label position="stacked">Planned End</ion-label>
            <ion-datetime
              v-model="state.visit.plannedEnd"
              display-format="h:mm A"
              picker-format="h:mm A"
            ></ion-datetime>
          </ion-item>
        </ion-col>
      </ion-row>
    </ion-grid>

    <!-- Employee Select -->

    <UserSelect
      v-if="!hideEmployeeSelect"
      :names="
        store.state.companyState.employees.map((employee) => employee.name)
      "
      v-model="state.visit.employeeName"
      type="employee"
    />
    <!-- Customer Select -->
    <UserSelect
      v-if="!state.visit.job && !hideCustomerSelect"
      :names="
        store.state.companyState.customers.map((customer) => customer.name)
      "
      v-model="state.visit.customerName"
      type="customer"
    />
    <!-- Job Attacher -->
    <ion-item v-if="!hideJob">
      <ion-toolbar>
        <ion-note>Attach a Job</ion-note>
        <ion-label v-if="state.visit.job"
          >"{{ state.visit.job.name }}"</ion-label
        >
        <ion-buttons slot="end">
          <ion-chip v-if="state.visit.job" @click="state.visit.job = null">
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
        v-model="state.visit.workType"
        placeholder="Describe the type of work being done at this visit"
      />
    </ion-item>

    <TimeLogComponent
      v-if="store.state.userType == 'employee'"
      :time="state.visit.time"
      :title="'Visit Time Log'"
      @timeChange="(time) => (state.visit.time = time)"
    />
    <!-- Additional Notes -->
    <h3 class="ion-text-center">
      <ion-text>Visit Notes</ion-text>
    </h3>
    <ion-item v-if="state.showTextAreas">
      <ion-textarea
        auto-grow
        v-model="state.visit.notes"
        placeholder="Notes for the visit"
      ></ion-textarea>
    </ion-item>

    <ion-modal :is-open="jobsModalIsOpen" @didDismiss="jobsModalIsOpen = false">
      <JobsModal @jobSelected="attachJob" @close="jobsModalIsOpen = false" />
    </ion-modal>
  </div>
</template>

<script lang="ts">
import {
  IonLabel,
  IonDatetime,
  IonItem,
  IonChip,
  IonTextarea,
  IonText,
  IonToolbar,
  IonNote,
  IonIcon,
  IonButtons,
  IonModal,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/vue";

import JobsModal from "@/components/modals/JobsModal.vue";
import UserSelect from "@/components/selects/UserSelect.vue";
import TimeLogComponent from "@/components/TimeLog.vue";
import {
  calendarNumberOutline,
  calendarOutline,
  trashOutline,
} from "ionicons/icons";
import store from "@/store";
import { Job } from "@/types";
import { reactive, ref, watch } from "vue";

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
    IonText,
    IonToolbar,
    IonNote,
    IonIcon,
    UserSelect,
    TimeLogComponent,
    IonButtons,
    JobsModal,
    IonModal,
    IonInput,
    IonGrid,
    IonRow,
    IonCol,
  },
  setup(props: any, { emit }: { emit: any }) {
    const state = reactive({
      visit: props.modelValue,
      showTextAreas: false,
    });

    setTimeout(() => (state.showTextAreas = true), 250);

    const changeDate = (ev: CustomEvent) => {
      state.visit.date = ev.detail.value.substring(0, 10);
    };

    const jobsModalIsOpen = ref(false);

    const attachJob = (job: Job) => {
      jobsModalIsOpen.value = false;
      state.visit.job = { id: job.id, name: job.name };
      state.visit.customerName = job.customerName;
    };

    watch(state.visit, (newVisit) => {
      emit("update:modelValue", newVisit);
    });

    return {
      state,
      store,
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
