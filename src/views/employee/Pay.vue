<template>
  <ion-page>
    <ion-content>
      <PaymentInfo v-model="state.employee" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

import PaymentInfo from "@/components/PaymentInfo.vue";
import store from "@/store";

export default {
  name: "Days",
  components: {
    IonContent,
    IonPage,
    PaymentInfo,
  },
  setup() {
    const state = reactive({
      employee: store.state.user,
    });

    if (state.employee) {
      watch(state.employee.data, () => {
        if (state.employee) state.employee.save();
      });
    }

    return {
      state,
    };
  },
};
</script>

<style scoped></style>
