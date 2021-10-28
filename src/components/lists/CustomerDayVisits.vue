<template>
  <ion-grid>
    <ion-row v-if="state.visits" class="ion-justify-content-around">
      <ion-col
        size-xs="12"
        size-sm="12"
        size-md="12"
        size-lg="6"
        size-xl="6"
        v-for="(visit, index) in state.visits"
        :key="visit.id"
      >
        <ion-card>
          <ion-card-header>
            <ion-card-title v-if="visit.data.employeeID">
              Visit by {{ idToName(visit.data.employeeID) }}
              <ion-button @click="deleteVisit(visit)">
                <ion-icon :icon="icons.trashOutline"></ion-icon>
              </ion-button>
            </ion-card-title>
          </ion-card-header>

          <ion-card-content v-if="state.visits.length">
            <VisitInline
              v-model="state.visits[index]"
              :separateByDefault="true"
              :hideCustomerSelect="true"
            />
          </ion-card-content>
        </ion-card>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script>
export default {};
</script>

<style></style>
