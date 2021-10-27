<template>
  <ion-grid
    v-if="lists.length == 0 || lists[0].length == 0"
    class="ion-justify-content-center"
    style="height: 80%;"
  >
    <ion-row class="ion-align-items-center" style="height: 100%;">
      <ion-col class="ion-text-center">
        <div>
          <ion-title>Nothing to see here...</ion-title>
        </div>
      </ion-col>
    </ion-row>
  </ion-grid>

  <ion-grid v-else-if="lists.length >= 1">
    <ion-row v-for="(list, index) in lists" :key="index">
      <h1 v-if="list.name" class="list-section-title ion-text-center">
        {{ list.name }}
      </h1>
      <ion-col
        v-for="item in list.items"
        :key="item.id"
        :size-xs="sizes ? sizes.xs : 12"
        :size-sm="sizes ? sizes.sm : 12"
        :size-md="sizes ? sizes.md : 6"
        :size-lg="sizes ? sizes.lg : 4"
        :size-xl="sizes ? sizes.xl : 3"
      >
        <slot name="item" :item="item"></slot>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts">
import { IonTitle, IonGrid, IonRow, IonCol } from "@ionic/vue";
import { computed } from "@vue/reactivity";
import { Splitter } from "@/types/auxiliary";

// NOTE: THIS COMPONENT RERENDERS AND RELOADS DATA UPON ANY SEARCH CHANGE
export default {
  name: "List",
  props: {
    splitters: Array,
    sizes: Object,
    items: Array,
  },
  setup(props: any) {
    const lists = computed(() => {
      if (props.items.length) {
        if (props.splitters) {
          return props.splitters
            .map((splitter: Splitter) => {
              return {
                name: splitter.name,
                items: props.items.filter(splitter.filter),
              };
            })
            .filter(
              (list: { name: string; items: Array<any> }) => list.items.length
            );
        }
        return [{ items: props.items }];
      }
      return [];
    });

    return {
      lists,
    };
  },
  components: {
    IonTitle,
    IonGrid,
    IonRow,
    IonCol,
  },
};
</script>

<style scoped>
.list-section-title {
  width: 100%;
  margin-top: 0px !important;
  margin-bottom: 0px !important;
}
</style>
