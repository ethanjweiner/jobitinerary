<template>
  <div>
    <ion-item>
      <ion-icon :icon="calendarNumberOutline"></ion-icon>
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
      v-if="showEmployeeSelect"
      :names="
        store.state.companyState.employees.map((employee) => employee.name)
      "
      :selectedName="state.visit.employeeName"
      @userChange="(name) => (state.visit.employeeName = name)"
      type="employee"
    />
    <!-- Customer Select -->
    <UserSelect
      v-if="!state.visit.job.id"
      :names="
        store.state.companyState.customers.map((customer) => customer.name)
      "
      :selectedName="state.visit.customerName"
      @userChange="(name) => (state.visit.customerName = name)"
      type="customer"
    />
    <!-- Job Attacher -->
    <ion-item>
      <ion-toolbar>
        <ion-note>Attach a Job</ion-note>
        <ion-label v-if="state.visit.job.id"
          >"{{ state.visit.job.name }}"</ion-label
        >
        <ion-buttons :slot="state.visit.job.id ? 'end' : 'end'">
          <ion-chip @click="jobsModalIsOpen = true">
            <ion-icon :icon="calendarOutline"></ion-icon>
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

    <ion-modal :is-open="jobsModalIsOpen" @didDismiss="jobsModalIsOpen = false">
      <JobsModal
        @jobSelected="attachJob"
        @closeModal="jobsModalIsOpen = false"
      />
    </ion-modal>

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
    <ion-item>
      <ion-textarea auto-grow v-model="state.visit.notes"></ion-textarea>
    </ion-item>
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
import { calendarNumberOutline, calendarOutline } from "ionicons/icons";
import store from "@/store";
import { Job } from "@/types";
import { reactive, ref, watch } from "vue";

export default {
  name: "Visit Main",
  props: {
    visit: Object,
    showEmployeeSelect: Boolean,
  },
  emits: ["visitChanged"],
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
      visit: props.visit,
    });

    const changeDate = (ev: CustomEvent) => {
      state.visit.date = ev.detail.value.substring(0, 10);
    };

    const jobsModalIsOpen = ref(false);

    const attachJob = (job: Job) => {
      jobsModalIsOpen.value = false;
      state.visit.job = { id: job.id, name: job.name };
      console.log(job);
      state.visit.customerName = job.customerName;
    };

    watch(state.visit, (newVisit) => {
      emit("visitChanged", newVisit);
    });

    return {
      state,
      calendarNumberOutline,
      calendarOutline,
      store,
      changeDate,
      jobsModalIsOpen,
      attachJob,
    };
  },
};
</script>

<style></style>
