<template>
  <ion-content>
    <ion-list>
      <div v-if="lists.length > 1">
        <!-- Create an item group for each list -->
        <ion-item-group v-for="list in lists" :key="list.name">
          <div v-if="list.items.length">
            <ion-item-divider>
              <ion-label>
                {{ list.name }}
              </ion-label>
            </ion-item-divider>
            <slot
              name="item"
              v-for="(item, index) in list.items"
              :key="index"
              :item="item"
            ></slot>
          </div>
        </ion-item-group>
      </div>
      <div v-else>
        <!-- Regular list type -->
        <!-- Use "slot props" so that the data from the infinite list is rendered into the item -->
        <slot
          name="item"
          v-for="(item, index) in state.infiniteList.list.items"
          :key="index"
          :item="item"
        ></slot>
      </div>
    </ion-list>

    <ion-infinite-scroll
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
  </ion-content>
</template>

<script lang="ts">
import {
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonItemGroup,
  IonItemDivider,
  IonLabel,
} from "@ionic/vue";
import { computed, reactive } from "@vue/reactivity";
import { CollectionRef, Splitter } from "@/types/auxiliary";
import { InfiniteList } from "@/db";
import { watch } from "@vue/runtime-core";

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
        10,
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
      }
      return [];
    });

    watch(state.infiniteList.list, (newList) => {
      console.log("New List: ", newList);
    });

    const initialize = async () => {
      await state.infiniteList.init();
    };

    const loadMore = async (ev: any) => {
      const status = await state.infiniteList.loadNewBatch();
      if (status == 0) {
        ev.target.complete();
      } else {
        console.log("Limit reached!");
        ev.target.disabled = true;
      }
    };

    if (props.dbRef) {
      initialize();
    }

    return {
      state,
      lists,
      loadMore,
    };
  },
  components: {
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonList,
    IonItemGroup,
    IonItemDivider,
    IonLabel,
  },
};
</script>

<style></style>
