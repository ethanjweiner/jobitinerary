<template>
  <ion-page>
    <ion-content style="height: 100%;">
      <ion-grid style="width: 100%; height: 100%;">
        <ion-row
          class="ion-justify-content-center ion-align-items-center"
          style="height: 100%;"
        >
          <ion-col :size="state.cardSize">
            <div class="ion-text-start">
              <h3 class="text-secondary">
                Activate Employee Account for {{ email }}
              </h3>
            </div>
            <EmployeeSignUp :email="email" />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
// Use this component to actually go ahead and create an authentication mechanism for the employee
// In essense, activates the employee account

import EmployeeSignUp from "@/components/authentication/EmployeeSignUp.vue";

import { IonContent, IonPage, IonGrid, IonRow, IonCol } from "@ionic/vue";

import { defineComponent } from "vue";

export default defineComponent({
  name: "Authentication",
  components: {
    IonPage,
    IonGrid,
    IonRow,
    IonCol,
    IonContent,
    EmployeeSignUp,
  },
  props: {
    email: String,
  },
  data() {
    return {
      state: {
        cardSize: 6,
        loading: true,
      },
    };
  },
  methods: {
    setCardSize() {
      this.state.cardSize = Math.min(Math.floor(7000 / window.innerWidth), 12);
    },
  },
  async created() {
    this.setCardSize();
    window.addEventListener("resize", () => {
      this.setCardSize();
    });
  },
});
</script>

<style>
div {
  border: 1px solid white;
}
h3 {
  color: #027e46;
}
</style>
