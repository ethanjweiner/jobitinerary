<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Visit on {{ visit.date.toLocaleDateString() }}</ion-title>

        <div style="padding-left: 20px;">
          <ion-note v-if="visit.customerName"
            >for {{ visit.customerName }} |
          </ion-note>
          <ion-note v-if="visit.employeeName"
            >by {{ visit.employeeName }}</ion-note
          >
        </div>
        <ion-buttons :collapse="true" slot="end">
          <ion-button @click="toggleVisitSettings(true, $event)">
            <ion-icon :icon="ellipsisVertical"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-popover
      :is-open="popoverIsOpen"
      :translucent="true"
      :event="popoverEvent"
      @didDismiss="toggleVisitSettings(false)"
    >
      <VisitPopover />
    </ion-popover>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title>Visit on {{ visit.date.toLocaleDateString() }}</ion-title>
          <ion-buttons collapse="condense" slot="end">
            <ion-button @click="toggleVisitSettings(true, $event)">
              <ion-icon :icon="ellipsisVertical"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

        <!-- Whenever a change to this form is made (debounced), update in Firestore -->
        <!-- Use IonInput debounce function to trigger less changes -->
      </ion-header>

      <SendMessage @click="messageModalIsOpen = true" />
      <form>
        <Sections :sections="sections" wrapCards>
          <template v-slot:main>
            <ion-item>
              <ion-icon :icon="calendarNumberOutline"></ion-icon>
              <ion-label style="margin-left: 7px;">Date of Visit </ion-label>
              <ion-input
                type="date"
                v-model="visit.date"
                placeholder="Search by date"
              ></ion-input>
            </ion-item>
            <!-- Employee Select -->

            <UserSelect
              :names="
                store.state.companyState.employees.map(
                  (employee) => employee.name
                )
              "
              :selectedName="visit.employeeName"
              @userChange="(name) => (visit.employeeName = name)"
              type="employee"
            />
            <!-- Customer Select -->
            <UserSelect
              v-if="!visit.jobID"
              :names="
                store.state.companyState.customers.map(
                  (customer) => customer.name
                )
              "
              :selectedName="visit.customerName"
              @userChange="(name) => (visit.customerName = name)"
              type="customer"
            />
            <!-- Job Attacher -->
            <ion-item>
              <ion-toolbar>
                <ion-note>Attach a Job</ion-note>
                <ion-label v-if="visit.job.id"
                  >"{{ visit.job.name }}"</ion-label
                >
                <ion-buttons :slot="visit.job.id ? 'end' : 'end'">
                  <ion-chip @click="jobsModalIsOpen = true">
                    <ion-icon :icon="calendarOutline"></ion-icon>
                    <ion-label style="margin-top: 6px;">Attach New</ion-label>
                  </ion-chip>
                </ion-buttons>
              </ion-toolbar>
            </ion-item>
            <TimeLog :time="visit.time" :title="'Visit Time Log'" />
            <!-- Additional Notes -->
            <h3 class="ion-text-center">
              <ion-text>Visit Notes</ion-text>
            </h3>
            <ion-item>
              <ion-textarea auto-grow v-model="visit.notes"></ion-textarea>
            </ion-item>
          </template>
          <template v-slot:tasks>
            <div style="height: 600px;"></div>
          </template>
          <template v-slot:tools>
            Tools
          </template>
        </Sections>
      </form>
      <ion-modal
        :is-open="jobsModalIsOpen"
        @didDismiss="jobsModalIsOpen = false"
      >
        <JobsModal
          @jobSelected="attachJob"
          @closeModal="jobsModalIsOpen = false"
        />
      </ion-modal>
      <ion-modal
        :is-open="messageModalIsOpen"
        @didDismiss="messageModalIsOpen = false"
      >
        <MessageModal
          @messageSent="sendMessage"
          @closeModal="messageModalIsOpen = false"
          :date="visit.date.toLocaleDateString()"
        />
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonInput,
  IonItem,
  IonNote,
  IonChip,
  IonIcon,
  IonButtons,
  IonModal,
  IonPopover,
  IonButton,
  IonTextarea,
  IonText,
} from "@ionic/vue";

import Sections from "@/components/Sections.vue";
import JobsModal from "@/components/modals/JobsModal.vue";

import {
  sampleVisit,
  sampleEmptyVisit,
  SectionType,
  Job,
  Message,
} from "@/types";
import { reactive, ref, toRefs } from "@vue/reactivity";
import {
  documentTextOutline,
  constructOutline,
  hammerOutline,
  calendarOutline,
  calendarNumberOutline,
  ellipsisVertical,
} from "ionicons/icons";
import UserSelect from "@/components/UserSelect.vue";
import store from "@/store";
import VisitPopover from "@/components/popovers/VisitPopover.vue";
import TimeLog from "@/components/TimeLog.vue";
import SendMessage from "@/components/buttons/SendMessage.vue";
import MessageModal from "@/components/modals/MessageModal.vue";

export default {
  name: "VisitView",
  props: ["visitID"],
  setup(props: any) {
    const sections = ref<Array<SectionType>>([
      {
        // Includes date, employee, customer, notes, & messaging
        name: "Main",
        icon: documentTextOutline,
        id: "main",
        size: 6,
      },
      {
        name: "Tasks",
        icon: constructOutline,
        id: "tasks",
        size: 6,
      },
      {
        name: "Tools",
        icon: hammerOutline,
        id: "tools",
        size: 6,
      },
    ]);
    const state = reactive({
      visit: sampleEmptyVisit,
    });

    if (props.visitID == "new") {
      // Create empty visit and set...
      state.visit = sampleEmptyVisit;
    } else {
      // Fetch visit with id
      state.visit = sampleVisit;
    }

    const jobsModalIsOpen = ref(false);

    const attachJob = (job: Job) => {
      jobsModalIsOpen.value = false;
      state.visit.job.id = job.id;
      state.visit.job.name = job.name;
    };

    const messageModalIsOpen = ref(false);

    const sendMessage = (message: Message) => {
      console.log(message);
      messageModalIsOpen.value = false;
    };

    const popoverIsOpen = ref(false);
    const popoverEvent = ref();
    const toggleVisitSettings = (state: boolean, ev?: Event) => {
      popoverEvent.value = ev;
      popoverIsOpen.value = state;
    };

    return {
      store,
      ...toRefs(state),
      sections,
      calendarOutline,
      calendarNumberOutline,
      ellipsisVertical,
      jobsModalIsOpen,
      toggleVisitSettings,
      popoverIsOpen,
      popoverEvent,
      attachJob,
      messageModalIsOpen,
      sendMessage,
    };
  },
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    Sections,
    UserSelect,
    IonLabel,
    IonInput,
    IonItem,
    IonNote,
    IonChip,
    IonIcon,
    IonButtons,
    JobsModal,
    IonModal,
    IonPopover,
    IonButton,
    VisitPopover,
    TimeLog,
    IonTextarea,
    IonText,
    SendMessage,
    MessageModal,
  },
};
</script>

<style scoped></style>
