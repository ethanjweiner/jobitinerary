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
    <ion-row v-for="(list, index) in lists" :key="index" class="ion-margin">
      <h1 v-if="list.name" class="ion-text-center list-section-title">
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

  <ion-infinite-scroll
    @ionInfinite="loadMore($event)"
    threshold="50px"
    id="infinite-scroll"
    :disabled="false"
  >
    <ion-infinite-scroll-content
      loading-spinner="bubbles"
      loading-text="Loading more..."
    >
    </ion-infinite-scroll-content>
  </ion-infinite-scroll>
</template>

<script lang="ts">
import {
  IonCol,
  IonGrid,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonRow,
} from "@ionic/vue";
import { computed, reactive } from "@vue/reactivity";
import { onUnmounted } from "@vue/runtime-core";

import config from "@/config/config";
import { InfiniteList } from "@/db";
import { CollectionRef, Splitter } from "@/types/auxiliary";

import ListPlaceholder from "../ListPlaceholder.vue";

interface State {
  infiniteList: InfiniteList;
}

// NOTE: THIS COMPONENT RERENDERS AND RELOADS DATA UPON ANY SEARCH CHANGE
export default {
  name: "Infinite List",
  props: {
    splitters: Array,
    pushQuantity: Number,
    dbRef: {
      type: Object as () => CollectionRef,
    },
    orderByParam: String,
    searchFilter: String,
    sizes: Object,
    type: String,
  },
  setup(props: any) {
    const state = reactive<State>({
      infiniteList: new InfiniteList(
        props.dbRef,
        props.pushQuantity
          ? props.pushQuantity
          : config.constants.PUSH_QUANTITY,
        props.orderByParam,
        props.searchFilter
      ),
    });

    const lists = computed(() => {
      if (state.infiniteList.list.items.length) {
        if (props.splitters) {
          return props.splitters
            .map((splitter: Splitter) => {
              return {
                name: splitter.name,
                items: state.infiniteList.list.items.filter(splitter.filter),
              };
            })
            .filter(
              (list: { name: string; items: Array<any> }) => list.items.length
            );
        }
        return [{ items: state.infiniteList.list.items }];
      }
      return [];
    });

    const initialize = async () => {
      await state.infiniteList.init();
    };

    const loadMore = async (ev: any) => {
      setTimeout(() => {
        state.infiniteList
          .loadNewBatch()
          .then(() => ev.target.complete())
          .catch((error) => {
            console.log(error);
            ev.target.complete();
            ev.target.disabled = true;
          });
      }, 500);
    };

    if (props.dbRef) {
      initialize();
    }

    // Deactivate listeners
    onUnmounted(() => {
      state.infiniteList.destroy();
    });

    return {
      state,
      lists,
      loadMore,
    };
  },
  components: {
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItemGroup,
    IonItemDivider,
    IonLabel,
    ListPlaceholder,
  },
};
</script>

<style scoped>
.list-section-title {
  width: 100%;
  margin-top: 0px !important;
  margin-bottom: 0px !important;
  text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;
}
</style>
