<template>
  <ion-page>
    <ion-content>
      <div class="top-spacing">
        <EmployeeDays
          :employeeID="state.employee.data.id"
          title="Dates"
          :dbRef="daysRef"
          :showPaidToggle="true"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import { computed, watch } from "@vue/runtime-core";

import EmployeeDays from "@/components/lists/EmployeeDays.vue";
import { companiesCollection } from "@/main";
import store from "@/store";
import { CollectionRef } from "@/types/auxiliary";

export default {
  name: "Days",
  components: {
    IonContent,
    IonPage,
    EmployeeDays,
  },
  setup() {
    const state = reactive({
      employee: store.state.user,
    });

    const daysRef = computed<CollectionRef>(() => {
      const base = companiesCollection
        .doc(`${store.state.companyID}/employees/${store.state.user.data.id}`)
        .collection("days");

      return base;
    });

    // Move this logic to store
    if (state.employee) {
      watch(state.employee.data, () => {
        if (state.employee) state.employee.save();
      });
    }

    return {
      state,
      daysRef,
    };
  },
};
</script>

<style scoped>
ion-content {
  margin-top: 80px;
}
</style>
