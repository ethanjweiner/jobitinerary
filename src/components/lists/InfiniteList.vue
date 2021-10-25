<template>
  <div
    class="empty-list-container ion-text-center ion-padding"
    v-if="lists.length == 0 || lists[0].length == 0"
  >
    <ion-title>
      Add Something to Get Started!
    </ion-title>
  </div>
  <ion-list v-else-if="lists.length >= 1">
    <ion-item-group v-for="(list, index) in lists" :key="index">
      <div v-if="list.items.length">
        <ion-item-divider v-if="list.name">
          <ion-label>
            {{ list.name }}
          </ion-label>
        </ion-item-divider>
        <slot
          name="item"
          v-for="item in list.items"
          :key="item.id"
          :item="item"
        ></slot>
      </div>
    </ion-item-group>
  </ion-list>

  <div v-else>List doesn't exist!</div>

  <ion-infinite-scroll
    v-if="lists.length >= 1 && lists[0].length"
    @ionInfinite="loadMore($event)"
    threshold="100px"
    id="infinite-scroll"
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
  IonList,
  IonItemGroup,
  IonItemDivider,
  IonLabel,
  IonTitle,
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
  },
  setup(props: any) {
    const state = reactive<State>({
      infiniteList: new InfiniteList(
        props.dbRef,
        18,
        props.orderByParam,
        props.searchFilter
      ),
    });

    const lists = computed(() => {
      if (state.infiniteList.list.items.length) {
        if (props.splitters) {
          return props.splitters.map((splitter: Splitter) => {
            return {
              name: splitter.name,
              items: state.infiniteList.list.items.filter(splitter.filter),
            };
          });
        }
        return [{ items: state.infiniteList.list.items }];
      }
      return [];
    });

    const initialize = async () => {
      await state.infiniteList.init();
    };

    const loadMore = async (ev: any) => {
      const status = await state.infiniteList.loadNewBatch();
      if (status == 0) {
        ev.target.complete();
      } else {
        ev.target.disabled = true;
      }
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
    IonList,
    IonItemGroup,
    IonItemDivider,
    IonLabel,
    IonTitle,
  },
};
</script>

<style scoped>
.empty-list-container {
  height: 100%;
  background: rgb(235, 235, 235);
  border: 3px dashed grey;
}
</style>
