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

  <ion-infinite-scroll
    @ionInfinite="loadMore($event)"
    threshold="100px"
    id="infinite-scroll"
    :disabled="false"
  >
    <ion-infinite-scroll-content
      loading-spinner="bubbles"
      loading-text="Loading visits..."
    >
    </ion-infinite-scroll-content>
  </ion-infinite-scroll>
</template>

<script lang="ts">
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/vue";
import { computed, reactive } from "@vue/reactivity";
import { CollectionRef, Splitter } from "@/types/auxiliary";
import { InfiniteList } from "@/db";
import { onUnmounted } from "@vue/runtime-core";

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
  },
  setup(props: any) {
    console.log(props.searchFilter);
    const state = reactive<State>({
      infiniteList: new InfiniteList(
        props.dbRef,
        10,
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
