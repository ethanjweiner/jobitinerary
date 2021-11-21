<template>
  <ListPlaceholder v-if="lists.length == 0 || lists[0].length == 0" />

  <ion-list v-else-if="type == 'list' && lists.length == 1">
    <slot v-for="item in lists[0].items" name="item" :item="item"></slot>
  </ion-list>
  <ion-list v-else-if="type == 'list'">
    <ion-item-group v-for="(list, index) in lists" :key="index">
      <ion-item-divider v-if="list.name">
        <ion-label>{{ list.name }}</ion-label>
      </ion-item-divider>
      <slot v-for="item in list.items" name="item" :item="item"></slot>
    </ion-item-group>
  </ion-list>

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
import {
  IonCol,
  IonGrid,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonRow,
} from "@ionic/vue";
import { computed } from "@vue/reactivity";

import { Splitter } from "@/types/auxiliary";

import ListPlaceholder from "../ListPlaceholder.vue";

// NOTE: THIS COMPONENT RERENDERS AND RELOADS DATA UPON ANY SEARCH CHANGE
export default {
  name: "List",
  props: {
    splitters: Array,
    sizes: Object,
    items: Array,
    type: String,
  },
  setup(props: any) {
    console.log(props.items);
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
      return [{ items: [] }];
    });

    return {
      lists,
    };
  },
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonLabel,
    IonItemDivider,
    IonItemGroup,
    ListPlaceholder,
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
