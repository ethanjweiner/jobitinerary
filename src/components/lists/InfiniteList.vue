<template>
  <ion-content>
    <ion-list>
      <div v-if="state.lists.length > 1">
        <!-- Create an item group for each list -->
        <ion-item-group v-for="list in state.lists" :key="list.name">
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
          v-for="(item, index) in state.items"
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
import { reactive } from "@vue/reactivity";
import { Splitter } from "@/types";

interface State {
  items: Array<any>;
  lists: Array<{ name: string; items: Array<any> }>;
  offset: number;
}

// NOTE: THIS COMPONENT RERENDERS AND RELOADS DATA UPON ANY SEARCH CHANGE
export default {
  name: "Infinite List",
  props: {
    splitters: Array,
    pushQuantity: Number,
    dbRef: Object,
    sampleItem: Object, // TEMPORARY: A sample item used in replacement of real document retrievals
    searchParams: Array,
    searchFilter: String,
  },
  setup(props: any) {
    const state = reactive<State>({
      items: [],
      lists: [],
      offset: 0,
    });

    console.log(props.searchFilter);

    // Q: Why query the database directly inside the infinite list component?
    // A: The process of loading more data in the infinite list component is streamlined: Directly query db, instead of emitting

    // pushItems : Retrieves more items and pushes to the parent list _items_
    // A return value of 0 represents success
    // A return value of 1 indicates that query limit has been reached
    const pushItems = async (): Promise<0 | 1> => {
      const max = state.items.length + props.pushQuantity;
      const min = max - props.pushQuantity;

      const newItems = [];

      // QUERY DATABASE WITH FILTERS AS NECESSARY, UNTIL _STATE.OFFSET_ RESULTS ARE RETRIEVED

      // TEMPORARY: Just push _pushQuantity_ items
      for (let i = min; i < max; i++) {
        newItems.push(props.sampleItem);
      }

      state.items = state.items.concat(newItems);

      // Stop scrolling if no queries were retrieved
      if (state.offset >= 30) return 1;

      state.offset += props.pushQuantity;

      return 0;
    };

    const refreshLists = () => {
      state.lists = [];
      // Split items into multiple lists
      if (props.splitters) {
        props.splitters.forEach((splitter: Splitter) => {
          const list = {
            name: splitter.name,
            items: state.items.filter(splitter.filter),
          };
          state.lists.push(list);
        });
      }
    };

    // Add items on load
    pushItems().then(refreshLists);

    // Load more items on scroll
    const loadMore = async (ev: any) => {
      const status = await pushItems();
      refreshLists();
      // Query limit reached
      if (status == 0) ev.target.complete();
      else ev.target.disabled = true;
    };

    return {
      state,
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
